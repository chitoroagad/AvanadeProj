import json
import asyncio
import pprint
import chromadb
from time import sleep
from chromadb.config import Settings
from langchain.agents.format_scratchpad import format_to_openai_function_messages
from collections import deque
from typing import Dict, List
from dotenv import load_dotenv
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import CSVLoader
from langchain_community.vectorstores import Chroma
from langchain_core.callbacks import Callbacks
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_core.agents import AgentActionMessageLog, AgentFinish
from langchain_core.callbacks.manager import CallbackManagerForToolRun
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_openai import AzureOpenAIEmbeddings
from langchain.tools.retriever import create_retriever_tool
from langchain.tools import StructuredTool
from langchain_openai import AzureChatOpenAI
from langchain.agents import AgentExecutor
from langchain_core.pydantic_v1 import BaseModel, Field

load_dotenv()


# data structure for storing tasks
class TaskListStorage:
    def __init__(self):
        self.tasks = deque([])
        self.task_id_counter = 0

    def append(self, task: Dict):
        self.tasks.append(task)

    def replace(self, tasks: List[Dict]):
        self.tasks = deque(tasks)

    def popleft(self):
        return self.tasks.popleft()

    def is_empty(self):
        return False if self.tasks else True

    def next_task_id(self):
        self.task_id_counter += 1
        return self.task_id_counter

    def get_task_names(self):
        return [task["name"] for task in self.tasks]


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
async def task_list_executor_fun(task: str, callbacks: Callbacks) -> str:

    solver_llm = llm.bind_functions(
        [main_database_retriever_tool, results_database_retriever_tool]
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
        tools=[main_database_retriever_tool, results_database_retriever_tool],
        verbose=True,
        return_intermediate_steps=True,
    )

    out = await solver_executor.ainvoke({"input": task})
    return out["output"]


task_list_executor = StructuredTool.from_function(
    coroutine=task_list_executor_fun,
    name="TaskExecutor",
    description="ASYNC. Executes a single task using an agent.",
)


# llm tool to generate a list of tasks
async def task_list_generator_fun(objective: str):
    out = await organiser_executor.ainvoke({"input": objective})
    return ",\n".join(out["tasks_list"])


task_list_generator = StructuredTool.from_function(
    coroutine=task_list_generator_fun,
    name="TaskListGenerator",
    description="AYSNC. Generates a list of tasks from an objective.",
)


# Try to connect to chroma server
chroma_client = None

for _ in range(15):
    try:
        chroma_client = chromadb.HttpClient(
            host="chroma", port="8000", settings=Settings(allow_reset=True)
        )
    except Exception:
        sleep(1)

if not chroma_client:
    raise Exception("Chroma client not found")
print("Chroma client found")
chroma_client.reset()

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


organiser_prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            """
            You are to use the input to create a list of tasks for AI to complete. The AI will have the ability
            to search a database of Supreme Court legal cases and a database of the client's legal case documents. Explicitly mention if
            a previous task is a prerequisite for the current task, you must end the tasks with a final task to output an answer to the user.
            Your answer must be using the output format OutputTasks.
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
            from your tools. If the executor returns a question, you must ask the user for the answer and then continue.
            Always complete the tasks before telling the user anything.
            """,
        ),
        ("user", "{input}"),
        MessagesPlaceholder(variable_name="agent_scratchpad"),
    ]
)

embeddings_function = AzureOpenAIEmbeddings(azure_deployment="ada")

loader = CSVLoader("/llm/USSupremeCourt.csv", encoding="iso-8859-1")
docs = loader.load()
documents = RecursiveCharacterTextSplitter(
    chunk_size=1000, chunk_overlap=200
).split_documents(docs)
vector = Chroma.from_documents(documents, embeddings_function, client=chroma_client)
retriever = vector.as_retriever()
main_database_retriever_tool = create_retriever_tool(
    retriever,
    "US_Supreme_Court_Cases-search",
    "Search for US Supreme Court Cases between 2020 and 2022. For any questions about US Supreme Court Cases, use this tool!.",
)

results_vector = Chroma(embedding_function=embeddings_function, client=chroma_client)
results_retriever = results_vector.as_retriever()
results_database_retriever_tool = create_retriever_tool(
    retriever,
    "Results-Storage-Search",
    "Search for results of previous tasks (id==task_number), from a vector store.",
)

task_list_storage = TaskListStorage()

llm = AzureChatOpenAI(azure_deployment="dep", temperature=0, streaming=True)
organiser_llm = llm.bind_functions([main_database_retriever_tool, OutputTasks])
solver_llm = llm.bind_functions(
    [main_database_retriever_tool, results_database_retriever_tool]
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

organiser_executor = AgentExecutor(
    agent=organiser_agent, tools=[main_database_retriever_tool], verbose=False
)

solver_executor = AgentExecutor(
    agent=solver_agent,
    tools=[main_database_retriever_tool, results_database_retriever_tool],
    verbose=True,
    return_intermediate_steps=True,
)

manager_executor = AgentExecutor(
    agent=manager_agent,
    tools=[task_list_executor, task_list_generator],
    verbose=True,
    return_intermediate_steps=True,
).with_config({"run_name": "Agent"})

message_history = ChatMessageHistory()

manager_executor = RunnableWithMessageHistory(
    manager_executor,
    lambda session_id: message_history,
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


async def main():
    # async for chunk in manager_executor.astream(
    #     {
    #         "input": "reserach important cases regarding divorce where the husband is rewarded alimony"
    #     },
    #     config={"configurable": {"session_id": "1"}},
    # ):
    #     # Agent Action
    #     if "actions" in chunk:
    #         for action in chunk["actions"]:
    #             print(f"Calling Tool: `{action.tool}` with input `{action.tool_input}`")
    #     # Observation
    #     elif "steps" in chunk:
    #         for step in chunk["steps"]:
    #             print(f"Tool Result: `{step.observation}`")
    #     # Final result
    #     elif "output" in chunk:
    #         print(f'Final Output: {chunk["output"]}')
    #     else:
    #         raise ValueError()
    #     print("---")

    async for event in manager_executor.astream_events(
        {
            "input": "reserach important cases regarding divorce where the husband is rewarded alimony"
        },
        config={"configurable": {"session_id": "1"}},
        version="v1",
    ):
        kind = event["event"]
        if kind == "on_chain_start":
            if (
                event["name"] == "Agent"
            ):  # Was assigned when creating the agent with `.with_config({"run_name": "Agent"})`
                print(
                    f"Starting agent: {event['name']} with input: {event['data'].get('input')}"
                )
        elif kind == "on_chain_end":
            if (
                event["name"] == "Agent"
            ):  # Was assigned when creating the agent with `.with_config({"run_name": "Agent"})`
                print()
                print("--")
                print(
                    f"Done agent: {event['name']} with output: {event['data'].get('output')['output']}"
                )
        if kind == "on_chat_model_stream":
            content = event["data"]["chunk"].content
            if content:
                # Empty content in the context of OpenAI means
                # that the model is asking for a tool to be invoked.
                # So we only print non-empty content
                print(content, end="|")
        elif kind == "on_tool_start":
            print("--")
            print(
                f"Starting tool: {event['name']} with inputs: {event['data'].get('input')}"
            )
        elif kind == "on_tool_end":
            print(f"Done tool: {event['name']}")
            print(f"Tool output was: {event['data'].get('output')}")
            print("--")


if __name__ == "__main__":
    print("Starting main")
    asyncio.run(main())

    # out = manager_executor.invoke(
    #     {
    #         "input": "reserach important cases regarding divorce where the husband is rewarded alimony"
    #     },
    #     config={"configurable": {"session_id": "1"}},
    # )
    # print("output=", out)
