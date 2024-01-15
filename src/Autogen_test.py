import autogen
from typing import Annotated
import ChromaDB_Test as db

# configure endpoints and LLMS.
config_list_main = autogen.config_list_from_json(
    env_or_file="src/OAI_CONFIG_LIST", filter_dict={"model": {"autogen"}}
)
config_list_dispatcher = autogen.config_list_from_json(
    env_or_file="src/OAI_CONFIG_LIST", filter_dict={"model": {"dispatcher"}}
)
config_list_worker = autogen.config_list_from_json(
    env_or_file="src/OAI_CONFIG_LIST", filter_dict={"model": {"worker"}}
)


# Create agents
dispatcher = autogen.AssistantAgent(
    name="dispatcher",
    system_message="A manager that splits a task into a list of smaller subtasks",
    llm_config={
        "config_list": config_list_dispatcher,
        "cache_seed": 21,
    },
)

worker = autogen.AssistantAgent(
    name="worker",
    system_message="A worker that does a list of subtasks, any information that you need must be fetched from a database.",
    llm_config={
        "config_list": config_list_worker,
        "cache_seed": 21,
    },
)

# create a UserProxyAgent instance named "user_proxy"
user_proxy = autogen.UserProxyAgent(
    name="user_proxy",
    system_message="A user asking for help",
    code_execution_config={"last_n_messages": 2, "work_dir": "groupchat"},
    human_input_mode="ALWAYS",
    is_termination_msg=lambda x: x.get("content", "").rstrip().endswith("TERMINATE"),
)

groupchat = autogen.GroupChat(
    agents=[dispatcher, worker, user_proxy],
    messages=[],
)
manager = autogen.GroupChatManager(
    groupchat=groupchat, llm_config={"config_list": config_list_main, "cache_seed": 21}
)


# Create function to fetch data from database
@user_proxy.register_for_execution()
@worker.register_for_llm(description="Fetch data from vector database")
def fetch_data_from_database(
    query: Annotated[str, "The query to fetch data from database"]
) -> Annotated[list, "The list of data fetched from database"]:
    return db.query(query)


user_proxy.initiate_chat(manager, message=input("Enter a message: "))
