import json
import chromadb
from chromadb.config import Settings
from langchain.agents.format_scratchpad import format_to_openai_function_messages
from collections import deque
from typing import Dict, List
from dotenv import load_dotenv
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import CSVLoader
from langchain_community.vectorstores import Chroma
from langchain_core.agents import AgentActionMessageLog, AgentFinish
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_openai import AzureOpenAIEmbeddings
from langchain.tools.retriever import create_retriever_tool
from langchain_openai import AzureChatOpenAI
from langchain.agents import AgentExecutor
from langchain_core.pydantic_v1 import BaseModel, Field

load_dotenv()


class TaskResultStorage:
    def __init__(self):
        self.results: Dict[int, str] = {}

    def append(self, task_id: int, result: str):
        self.results[task_id] = result


def get(self, task_id: int):
    return self.results[task_id]


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
        return AgentFinish(return_values=input, log=str(function_call))

    # else return agent action
    return AgentActionMessageLog(
        tool=name, tool_input=input, log="", message_log=[output]
    )


for _ in range(10):
    try:
        chroma_client = chromadb.HttpClient(
            host="chroma", port="8000", settings=Settings(allow_reset=True)
        )
    except: Exception as e:
        print(e)

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
            a previous task is a prerequisite for the current task.
            Your answer must be using the output format OutputTasks.
            """,
        ),
        ("user", "{input}"),
        MessagesPlaceholder(variable_name="agent_scratchpad"),
    ]
)

loader = CSVLoader("/src/USSupremeCourt.csv", encoding="iso-8859-1")
docs = loader.load()
documents = RecursiveCharacterTextSplitter(
    chunk_size=1000, chunk_overlap=200
).split_documents(docs)
vector = Chroma.from_documents(documents, AzureOpenAIEmbeddings(azure_deployment="ada"))
retriever = vector.as_retriever()

main_database_retriever_tool = create_retriever_tool(
    retriever,
    "US_Supreme_Court_Cases-search",
    "Search for US Supreme Court Cases between 2020 and 2022. For any questions about US Supreme Court Cases, use this tool!.",
)


if __name__ == "__main__":

    task_list_storage = TaskListStorage()

    tools = [main_database_retriever_tool, OutputTasks]

    llm = AzureChatOpenAI(azure_deployment="dep", temperature=0)

    llm_with_tools = llm.bind_functions(tools)

    organiser_agent = (
        {
            "input": lambda x: x["input"],
            "agent_scratchpad": lambda x: format_to_openai_function_messages(
                x["intermediate_steps"]
            ),
        }
        | prompt
        | llm_with_tools
        | parse_task_list
    )

    organiser_executor = AgentExecutor(
        agent=organiser_agent, tools=[main_database_retriever_tool], verbose=True
    )

    out = organiser_executor.invoke(
        {
            "input": "reserach important cases regarding divorce where the husband is rewarded alimony"
        }
    )
    print("Output:", out)
    for task in out["tasks_list"]:
        task_list_storage.append({"num": task[0], "name": task[3:]})

    while not task_list_storage.is_empty():
        task = task_list_storage.popleft()
        print("Task:", task)
        print("Task List:", task_list_storage.get_task_names())
