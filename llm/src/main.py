import json
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
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_core.agents import AgentActionMessageLog, AgentFinish
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_openai import AzureOpenAIEmbeddings
from langchain.tools.retriever import create_retriever_tool
from langchain.tools import tool
from langchain_openai import AzureChatOpenAI
from langchain.agents import AgentExecutor
from langchain_core.pydantic_v1 import BaseModel, Field

load_dotenv()


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


class OutputTasks(BaseModel):
    objective: str = Field(description="The objective of the task list.")
    tasks_list: List[str] = Field(
        description="A list of tasks with their number at the beginning and the task after."
    )


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
        print("INPUT:", str(input))
        return AgentFinish(return_values=input, log=str(function_call))

    # else return agent action
    return AgentActionMessageLog(
        tool=name, tool_input=input, log="", message_log=[output]
    )


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
            You are given tasks to complete. You are to use the available tools to complete the tasks. To the best of your ability, complete the tasks in the order given. If a task is a prerequisite for another task, complete the prerequisite task first. If you are unable to complete a task, you may ask the user for more information.
            """,
        ),
        (
            "user",
            "{input}",
        ),
        MessagesPlaceholder(variable_name="agent_scratchpad"),
    ]
)


prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            """
            You are to use the user input to create a list of tasks for AI to complete. The AI will have the ability
            to search a database of Supreme Court legal cases and a database of the client's legal case documents. Explicitly mention if
            a previous task is a prerequisite for the current task, you must end the tasks with a final task to output an answer to the user.
            Your answer must be using the output format OutputTasks.
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

tools = [main_database_retriever_tool, OutputTasks]

llm = AzureChatOpenAI(azure_deployment="dep", temperature=0)
organiser_llm = llm.bind_functions([main_database_retriever_tool, OutputTasks])
solver_llm = llm.bind_functions(
    [main_database_retriever_tool, results_database_retriever_tool]
)

organiser_agent = (
    {
        "input": lambda x: x["input"],
        "agent_scratchpad": lambda x: format_to_openai_function_messages(
            x["intermediate_steps"]
        ),
    }
    | prompt
    | organiser_llm
    | parse_task_list
)

action_agent = (
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

action_executor = AgentExecutor(
    agent=action_agent,
    tools=[main_database_retriever_tool, results_database_retriever_tool],
    verbose=False,
)

message_history = ChatMessageHistory()

action_executor = RunnableWithMessageHistory(
    action_executor,
    lambda session_id: message_history,
    input_messages_key="input",
    history_messages_key="chat_history",
)


@tool
def action_executor_tool(input: str, session_id: str) -> str:
    """Calls executor agent to perform the task."""
    out = action_executor.invoke(
        {"input": input}, config={"configurable": {"session_id": session_id}}
    )
    return out["output"]


if __name__ == "__main__":
    chunks = []
    out = organiser_executor.invoke(
        {
            "input": "reserach important cases regarding divorce where the husband is rewarded alimony"
        }
    )
    print("Output:", out)
    for task in out["tasks_list"]:
        task_list_storage.append({"num": task[0], "name": task[3:]})

    while not task_list_storage.is_empty():
        task_list = enumerate(task_list_storage.get_task_names())
        task = task_list_storage.popleft()
        out = action_executor.invoke(
            {"input": task["num"] + ". " + task["name"]},
            config={"configurable": {"session_id": "1"}},
        )

        # async for chunk in action_executor.astream({"input": task}):
        #     chunks.append(chunk)
        #     print("---------")
        #     pprint.pprint(chunk, depth=1)

        results_vector.add_texts(ids=[task["num"]], texts=[out["output"]])
    print("OUTPUT:", out)
    print("History:", message_history)


# out = {
#     "input": "5. Provide a report on the important cases regarding divorce where the husband is rewarded alimony.",
#     "chat_history": [
#         HumanMessage(
#             content="1. Search for US Supreme Court Cases between 2020 and 2022 related to divorce and alimony."
#         ),
#         AIMessage(
#             content="The search for US Supreme Court Cases between 2020 and 2022 related to divorce and alimony returned the following cases:\n\n1. Case 2020-001: 2022-004\n2. Case 2020-001: 2020-055\n3. Case 2020-001: 2022-053\n4. Case 2020-001: 2021-026\n\nIf you would like more detailed information about any of these cases, please let me know!"
#         ),
#         HumanMessage(
#             content="2. Review the details of the identified cases to find relevant information."
#         ),
#         AIMessage(
#             content="Here are the details of the identified US Supreme Court cases related to divorce and alimony:\n\n1. Case 2020-001: 2022-004\n   - Date: 12/14/2020 - 4/22/2021\n   - Case Name: TEXAS v. NEW MEXICO\n   - Citation: 141 S. Ct. 509 - 141 S. Ct. 1352\n   - Lexis Citation: 2020 U.S. LEXIS 6091 - 2021 U.S. LEXIS 2109\n\n2. Case 2020-001: 2020-055\n   - Date: 12/14/2020 - 6/1/2023\n   - Case Name: TEXAS v. NEW MEXICO\n   - Citation: 141 S. Ct. 509 - 143 S. Ct. 1391\n   - Lexis Citation: 2020 U.S. LEXIS 6091 - 2023 U.S. LEXIS 2300\n\n3. Case 2020-001: 2022-053\n   - Date: 12/14/2020 - 1/25/2021\n   - Case Name: TEXAS v. NEW MEXICO\n   - Citation: 141 S. Ct. 509 - 141 S. Ct. 656\n   - Lexis Citation: 2020 U.S. LEXIS 6091 - 2021 U.S. LEXIS 746\n\nIf you need more detailed information about any of these cases, please let me know!"
#         ),
#         HumanMessage(
#             content="3. Analyze the court decisions and outcomes of the cases."
#         ),
#         AIMessage(
#             content="Here are the details of the identified US Supreme Court cases related to divorce and alimony:\n\n1. Case 2020-001: 2022-004\n   - Date: 12/14/2020 - 4/22/2021\n   - Case Name: TEXAS v. NEW MEXICO\n   - Citation: 141 S. Ct. 509 - 141 S. Ct. 1352\n   - Lexis Citation: 2020 U.S. LEXIS 6091 - 2021 U.S. LEXIS 2109\n\n2. Case 2020-001: 2020-055\n   - Date: 12/14/2020 - 6/1/2023\n   - Case Name: TEXAS v. NEW MEXICO\n   - Citation: 141 S. Ct. 509 - 143 S. Ct. 1391\n   - Lexis Citation: 2020 U.S. LEXIS 6091 - 2023 U.S. LEXIS 2300\n\n3. Case 2020-001: 2022-053\n   - Date: 12/14/2020 - 1/25/2021\n   - Case Name: TEXAS v. NEW MEXICO\n   - Citation: 141 S. Ct. 509 - 141 S. Ct. 656\n   - Lexis Citation: 2020 U.S. LEXIS 6091 - 2021 U.S. LEXIS 746\n\nIf you need more detailed information about any of these cases, please let me know!"
#         ),
#         HumanMessage(
#             content="4. Summarize the key findings and outcomes of the cases."
#         ),
#         AIMessage(
#             content="Here are the key findings and outcomes of the identified US Supreme Court cases related to divorce and alimony:\n\n1. Case 2020-001: 2022-004\n   - Date: 12/14/2020 - 4/22/2021\n   - Case Name: TEXAS v. NEW MEXICO\n   - Citation: 141 S. Ct. 509 - 141 S. Ct. 1352\n   - Lexis Citation: 2020 U.S. LEXIS 6091 - 2021 U.S. LEXIS 2109\n\n2. Case 2020-001: 2020-055\n   - Date: 12/14/2020 - 6/1/2023\n   - Case Name: TEXAS v. NEW MEXICO\n   - Citation: 141 S. Ct. 509 - 143 S. Ct. 1391\n   - Lexis Citation: 2020 U.S. LEXIS 6091 - 2023 U.S. LEXIS 2300\n\n3. Case 2020-001: 2022-053\n   - Date: 12/14/2020 - 1/25/2021\n   - Case Name: TEXAS v. NEW MEXICO\n   - Citation: 141 S. Ct. 509 - 141 S. Ct. 656\n   - Lexis Citation: 2020 U.S. LEXIS 6091 - 2021 U.S. LEXIS 746\n\nIf you need more detailed information about any of these cases, please let me know!"
#         ),
#     ],
#     "output": "It seems that there is an issue with retrieving specific cases related to divorce where the husband is awarded alimony. I will attempt to find the relevant information using a different approach.\nI apologize for the inconvenience. It seems that there is an issue with retrieving specific cases related to divorce where the husband is awarded alimony. I will attempt to find the relevant information using a different approach.",
# }
