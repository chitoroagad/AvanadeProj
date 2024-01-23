from time import sleep
import csv
import chromadb
from chromadb.config import Settings
import chromadb.utils.embedding_functions as ef
from pydantic import BaseModel
import autogen
from typing import Annotated

# setup chroma-db
embedding_function = ef.OpenAIEmbeddingFunction(
    api_key="148aa1a7a3dc4dd88004bfe29e87d2c6",  # Key 1
    api_base="https://chromadb-test.openai.azure.com/",
    api_type="azure",
    api_version="2023-05-01.17.0",
    model_name="text-embedding-ada-002",
)

i = 0
client = None
for j in range(10):
    try:
        client = chromadb.HttpClient(
            host="db", port="8000", settings=Settings(allow_reset=True)
        )
        found = True
        print("CONNECTED TO CHROMA-DB")
        break
    except Exception as e:
        print(e)
        sleep(2)

try:
    collection = client.get_collection(
        name="USSupremeCourt", embedding_function=embedding_function
    )
    print("FOUND COLLECTION")
except Exception:
    collection = client.create_collection(
        name="USSupremeCourt", embedding_function=embedding_function
    )
    print("CREATED COLLECTION")

    with open("src/USSupremeCourt.csv", encoding="iso-8859-1") as file:
        lines = csv.reader(file)
        documents = []
        metadata = []
        ids = []
        id = 1
        for i, line in enumerate(lines):
            if i == 0:
                continue
            if i == 100:  # Batch limit 4931
                break
            documents.append(line[14])
            metadata.append({"item_id": line[0]})
            ids.append(str(id))
            id += 1


oai_config_path = "src/OAI_CONFIG_LIST"
# configure endpoints and LLMS.
config_list_main = autogen.config_list_from_json(
    env_or_file=oai_config_path,  # filter_dict={"model": {"autogen"}}
)
config_list_dispatcher = autogen.config_list_from_json(
    env_or_file=oai_config_path,  # filter_dict={"model": {"dispatcher"}}
)
config_list_worker = autogen.config_list_from_json(
    env_or_file=oai_config_path,  # filter_dict={"model": {"worker"}}
)


# Create agents
dispatcher = autogen.AssistantAgent(
    name="dispatcher",
    system_message="A dispatcher that breaks a taks down into smaller well explained subtasks and assigns them to workers. You do not complete any tasks yourself. Do not mention that you are an AI.",
    llm_config={
        "config_list": config_list_dispatcher,
    },
)

worker = autogen.AssistantAgent(
    name="worker",
    system_message="A worker that does a single task. For any coding tasks use only the functions provided, you have a function that queries a vector database containing cases from the Supereme Court. Do not metion that you are an AI model. Reply TERMINATE when the task is complete",
    llm_config={
        "config_list": config_list_worker,
    },
)

user_proxy = autogen.UserProxyAgent(
    name="user_proxy",
    system_message="A human user asking for help",
    human_input_mode="ALWAYS",
    is_termination_msg=lambda x: x.get("content", "").rstrip().endswith("TERMINATE"),
)

groupchat = autogen.GroupChat(
    agents=[dispatcher, worker, user_proxy],
    messages=[],
)
manager = autogen.GroupChatManager(
    groupchat=groupchat, llm_config={"config_list": config_list_main}
)


# # Create function to fetch data from database
# @user_proxy.register_for_execution()
# @worker.register_for_llm(
#     name="fetch-data-from-database", description="Fetch data from vector database"
# )
# def fetch_data_from_database(
#     query: Annotated[str, "The query to fetch data from database"]
# ) -> Annotated[dict[str, str | None], "The list of data fetched from database"]:
#     return db.query(query)


class Query(BaseModel):
    query: str


class Response(BaseModel):
    response: str


# Create a functino to output hello
@user_proxy.register_for_execution()
@worker.register_for_llm(name="query", description="fetch data from vector database")
def hello(query: Query) -> Response:
    return Response(response="hello")


user_proxy.initiate_chat(manager, message=input("Enter a message: "))
