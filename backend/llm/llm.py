import json
from pathlib import Path
from time import sleep
from typing import Dict, List

import chromadb
from chromadb.config import Settings
from dotenv import load_dotenv
from langchain.agents import AgentExecutor
from langchain.agents.format_scratchpad import \
    format_to_openai_function_messages
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.tools import StructuredTool
from langchain.tools.retriever import create_retriever_tool
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_community.document_loaders import PyPDFLoader, TextLoader
from langchain_community.vectorstores import Chroma
from langchain_core.agents import AgentActionMessageLog, AgentFinish
from langchain_core.callbacks import Callbacks
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.pydantic_v1 import BaseModel, Field
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_openai import AzureChatOpenAI, AzureOpenAIEmbeddings

load_dotenv()


# Template for the output of the task list
class OutputTasks(BaseModel):
    objective: str = Field(description="The objective of the task list.")
    tasks_list: List[str] = Field(
        description="A list of tasks with their number at the beginning and the task after."
    )


# Function parses OutputTasks function and returns the next action if any
def parse_task_list(output):
    # if not function invoked, return to user
    if "function_call" not in output.additional_kwargs:
        return AgentFinish(return_values={"output": output.content}, log=output.content)

    # parse out function call
    function_call = output.additional_kwargs["function_call"]
    name = function_call["name"]
    input = json.loads(function_call["arguments"])

    # if OutputTasks function, return to user with function inputs
    if name == "OutputTasks":
        return AgentFinish(return_values=input, log=str(function_call))

    # else return agent action
    return AgentActionMessageLog(
        tool=name, tool_input=input, log="", message_log=[output]
    )


# llm tool to execute a task
def task_list_executor_fun(task: str, callbacks: Callbacks) -> str:

    solver_llm = llm.bind_functions(
        [
            primary_database_retriever_tool,
            secondary_database_retriever_tool,
            results_database_retriever_tool,
        ]
    )

    solver_prompt = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                """
                You are given a task to complete by a manager. You are to use the available tools to complete the tasks.
                If you are unable to complete a task, you may ask the user for more
                information. If a task references something you do not know, check the results of previous tasks. If you
                have an answer, return only the answer. Do not aplogize under any circumstances.
                """,
            ),
            (
                "user",
                "{input}",
            ),
            MessagesPlaceholder(variable_name="agent_scratchpad"),
        ]
    )

    solver_agent = (
        {
            "input": lambda x: x["input"],
            "agent_scratchpad": lambda x: format_to_openai_function_messages(
                x["intermediate_steps"]
            ),
        }
        | solver_prompt
        | solver_llm
        | parse_task_list
    )

    solver_executor = AgentExecutor(
        agent=solver_agent,
        tools=[
            primary_database_retriever_tool,
            secondary_database_retriever_tool,
            results_database_retriever_tool,
        ],
        verbose=False,
        return_intermediate_steps=True,
    )

    # out = await solver_executor.ainvoke({"input": task})
    out = solver_executor.invoke({"input": task})
    return out["output"]


task_list_executor = StructuredTool.from_function(
    # coroutine=task_list_executor_fun,
    func=task_list_executor_fun,
    name="TaskExecutor",
    # description="ASYNC. Executes a single task using an agent.",
    description="Executes a single task using an agent.",
)


# llm tool to generate a list of tasks
def task_list_generator_fun(objective: str):
    # out = await organiser_executor.ainvoke({"input": objective})
    out = organiser_executor.invoke({"input": objective})
    return ",\n".join(out["tasks_list"])


task_list_generator = StructuredTool.from_function(
    # coroutine=task_list_generator_fun,
    func=task_list_generator_fun,
    name="TaskListGenerator",
    description="Generates a list of tasks from an objective.",
)


# Try to connect to chroma server
chroma_client = None

for _ in range(15):
    try:
        print("Trying to connect to chroma client")
        chroma_client = chromadb.HttpClient(
            host="localhost", port="8000", settings=Settings(allow_reset=True)
        )
    except Exception:
        sleep(1)

if not chroma_client:
    raise Exception("Chroma client not found")
print("Chroma client found")
chroma_client.reset()

organiser_prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            """
            You are to use the input to create a list of tasks for AI to complete. The AI will have the ability
            to search a database of Supreme Court legal cases and a database of the client's legal case documents. 
            Calling a tools such as searching database is a single task. Explicitly mention if a previous task is a prerequisite for the current 
            task, you must end the tasks with a final task to output an answer to the user. Your answer must be using 
            the output format OutputTasks.
            """,
        ),
        ("user", "{input}"),
        MessagesPlaceholder(variable_name="agent_scratchpad"),
    ]
)

manager_prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            """
            You are a helpful legal assistant. You are to use the user input to solve problems, answer questions,
            and complete tasks. You do this by using the tools available to you to create a list of tasks, then solve,
            also using the tools available to you. you must not answer questions directly, only relay the information
            from your tools. Calling a tool is a single task. If the executor returns a question, you must ask the 
            user for the answer and then continue. Always complete the tasks before telling the user anything.
            """,
        ),
        ("user", "{input}"),
        MessagesPlaceholder(variable_name="agent_scratchpad"),
    ]
)

embeddings_function = AzureOpenAIEmbeddings(azure_deployment="ada")

primary_loader = TextLoader("llm/courtcase.txt")
primary_docs = primary_loader.load()
primary_documents = RecursiveCharacterTextSplitter(
    chunk_size=1000, chunk_overlap=200
).split_documents(primary_docs)
primary_vector = Chroma.from_documents(
    primary_documents, embeddings_function, client=chroma_client
)
primary_retriever = primary_vector.as_retriever()
primary_database_retriever_tool = create_retriever_tool(
    primary_retriever,
    "US_Supreme_Court_Cases-search",
    "Search for US Supreme Court Cases in 2024. For any questions about US Supreme Court Cases, use this tool!.",
)

# load pdfs
pdfs = Path("llm/").glob("*.pdf")
for pdf in pdfs:
    loader = PyPDFLoader(str(pdf))
    pages = loader.load_and_split()
    primary_vector.add_documents(pages)


secondary_vector = Chroma(embedding_function=embeddings_function, client=chroma_client)
secondary_retriever = secondary_vector.as_retriever()
secondary_database_retriever_tool = create_retriever_tool(
    secondary_retriever,
    "Client-Case-Storage-Search",
    "Search for client case documents. For any questions about client case documents, use this tool!.",
)

results_vector = Chroma(embedding_function=embeddings_function, client=chroma_client)
results_retriever = results_vector.as_retriever()
results_database_retriever_tool = create_retriever_tool(
    primary_retriever,
    "Results-Storage-Search",
    "Search for results of previous tasks (id==task_number), from a vector store.",
)


llm = AzureChatOpenAI(azure_deployment="dep", temperature=0, streaming=False)
organiser_llm = llm.bind_functions(
    [primary_database_retriever_tool, secondary_database_retriever_tool, OutputTasks]
)
manager_llm = llm.bind_functions([task_list_executor, task_list_generator])

manager_agent = (
    {
        "input": lambda x: x["input"],
        "agent_scratchpad": lambda x: format_to_openai_function_messages(
            x["intermediate_steps"]
        ),
    }
    | manager_prompt
    | manager_llm
    | parse_task_list
).with_config({"tags": ["manager"]})

organiser_agent = (
    {
        "input": lambda x: x["input"],
        "agent_scratchpad": lambda x: format_to_openai_function_messages(
            x["intermediate_steps"]
        ),
    }
    | organiser_prompt
    | organiser_llm
    | parse_task_list
)

organiser_executor = AgentExecutor(
    agent=organiser_agent,
    tools=[
        primary_database_retriever_tool,
        secondary_database_retriever_tool,
        results_database_retriever_tool,
    ],
    verbose=False,
).with_config({"run_name": "Organiser"})

manager_executor = AgentExecutor(
    agent=manager_agent,
    tools=[task_list_executor, task_list_generator],
    verbose=False,
    return_intermediate_steps=True,
).with_config({"run_name": "Manager"})

message_history = ChatMessageHistory()

manager_executor = RunnableWithMessageHistory(
    runnable=manager_executor,
    get_session_history=lambda session_id: message_history,
    input_messages_key="input",
    history_messages_key="chat_history",
)


# @tool
# def action_executor_tool(input: str, session_id: str) -> str:
#     """Calls executor agent to perform the task."""
#     out = solver_executor.invoke(
#         {"input": input}, config={"configurable": {"session_id": session_id}}
#     )
#     return out["output"]


class LLMCaller:
    @staticmethod
    def call_llm(input: Dict[str, str]):
        """
        Calls manager to perform task.
        """

        # async for event in manager_executor.astream_events(
        #     input,
        #     config={"configurable": {"session_id": "1"}},
        #     version="v1",
        # ):
        #     kind = event["event"]
        #     if kind == "on_chain_start":
        #         if (
        #             event["name"] == "Agent"
        #         ):  # Was assigned when creating the agent with `.with_config({"run_name": "Agent"})`
        #             print(
        #                 f"Starting agent: {event['name']} with input: {event['data'].get('input')}"
        #             )
        #     elif kind == "on_chain_end":
        #         if (
        #             event["name"] == "Agent"
        #         ):  # Was assigned when creating the agent with `.with_config({"run_name": "Agent"})`
        #             print()
        #             print("--")
        #             print(
        #                 f"Done agent: {event['name']} with output: {event['data'].get('output')['output']}"
        #             )
        #     if kind == "on_chat_model_stream":
        #         content = event["data"]["chunk"].content
        #         if content:
        #             # Empty content in the context of OpenAI means
        #             # that the model is asking for a tool to be invoked.
        #             # So we only print non-empty content
        #             print(content, end="|")
        #     elif kind == "on_tool_start":
        #         print("--")
        #         print(
        #             f"Starting tool: {event['name']} with inputs: {event['data'].get('input')}"
        #         )
        #     elif kind == "on_tool_end":
        #         print(f"Done tool: {event['name']}")
        #         print(f"Tool output was: {event['data'].get('output')}")
        #         print("--")
        # return "fin"
        out = manager_executor.invoke(
            input, config={"configurable": {"session_id": "1"}}
        )
        return out

    @staticmethod
    def reload_chat(tasks):
        """
        Calls manager with specifc tasks.
        """
        out = manager_executor.invoke(
            {"input": ",\n".join(tasks)}, config={"configurable": {"session_id": "1"}}
        )
        return out

    @staticmethod
    def add_pdf_document(document):
        """
        Adds a document to the secondary database
        """
        print(document)
        loader = PyPDFLoader(document)
        pages = loader.load_and_split()
        secondary_vector.add_documents(pages)
        return "Document added"


if __name__ == "__main__":
    print("Starting main")
    out = LLMCaller.call_llm(
        {
            "input": "What are some of the reasons for judgement in the case of Merticariu (Appellant) v Judecatoria Arad, Romania(Respondent)"
        }
    )
    print(out)

thing = {
    "input": "What are some of the reasons for judgement in the case of Merticariu (Appellant) v Judecatoria Arad, Romania(Respondent)",
    "chat_history": [],
    "output": "The reasons for judgment in the case of Merticariu (Appellant) v Judecatoria Arad, Romania (Respondent) include the following:\n- The natural and ordinary meaning of the words in section 20(5) of the Act are plain.\n- The judge must decide whether the requested person is \"entitled\" to a retrial or (on appeal) to a review amounting to a retrial.\n- The appropriate judge cannot answer section 20(5) of the 2003 Act in the affirmative if the law of the requesting state confers a right to retrial which depends on a finding by a judicial authority in the requesting state as to whether the requested person was deliberately absent from his trial.\n- In this case, neither the EAW nor the further information provided by the requesting judicial authority confirmed that the appellant was entitled to a retrial.\n- The district judge in this case should therefore have answered section 20(5) in the negative.\n- Accordingly, the Supreme Court quashes the district judge's order and orders the appellant's discharge.",
    "intermediate_steps": [
        (
            AgentActionMessageLog(
                tool="TaskListGenerator",
                tool_input={
                    "objective": "List the reasons for judgement in the case of Merticariu (Appellant) v Judecatoria Arad, Romania(Respondent)"
                },
                log="",
                message_log=[
                    AIMessageChunk(
                        content="",
                        additional_kwargs={
                            "function_call": {
                                "arguments": '{"objective":"List the reasons for judgement in the case of Merticariu (Appellant) v Judecatoria Arad, Romania(Respondent)"}',
                                "name": "TaskListGenerator",
                            }
                        },
                    )
                ],
            ),
            "1. Review the full judgment of the Court to extract the reasons for judgement.,\n2. Provide the reasons for judgement to the user.",
        ),
        (
            AgentActionMessageLog(
                tool="TaskExecutor",
                tool_input={
                    "task": "Review the full judgment of the Court to extract the reasons for judgement."
                },
                log="",
                message_log=[
                    AIMessageChunk(
                        content="",
                        additional_kwargs={
                            "function_call": {
                                "arguments": '{"task":"Review the full judgment of the Court to extract the reasons for judgement."}',
                                "name": "TaskExecutor",
                            }
                        },
                    )
                ],
            ),
            "The reasons for the judgment are as follows:\n- The Supreme Court holds that the natural and ordinary meaning of the words in section 20(5) of the Act are plain.\n- The judge must decide whether the requested person is \"entitled\" to a retrial or (on appeal) to a review amounting to a retrial.\n- The appropriate judge cannot answer section 20(5) of the 2003 Act in the affirmative if the law of the requesting state confers a right to retrial which depends on a finding by a judicial authority in the requesting state as to whether the requested person was deliberately absent from his trial.\n- In this case, neither the EAW nor the further information provided by the requesting judicial authority confirmed that the appellant was entitled to a retrial.\n- The district judge in this case should therefore have answered section 20(5) in the negative.\n- Accordingly, the Supreme Court quashes the district judge's order and orders the appellant's discharge.",
        ),
    ],
}
