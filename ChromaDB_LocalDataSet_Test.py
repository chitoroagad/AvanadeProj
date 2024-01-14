import csv
import chromadb
import chromadb.utils.embedding_functions as embedding_functions

with open('USSupremeCourt.csv', encoding="windows-1252") as file:
    lines = csv.reader(file)

    documents = []
    metadata = []
    ids = []
    id = 1

    for i, line in enumerate(lines):
        if i == 0:
            continue
        if i == 100: # Batch limit 4931
            break
        documents.append(line[14])
        metadata.append({"item_id": line[0]})
        ids.append(str(id))
        id += 1

chroma_client = chromadb.Client()

collection = chroma_client.create_collection(name="USSupremeCourt")
collection.add(
    documents=documents,
    metadatas=metadata,
    ids=ids
)

openai_ef = embedding_functions.OpenAIEmbeddingFunction(
                api_key="148aa1a7a3dc4dd88004bfe29e87d2c6", # Key 1
                api_base="https://chromadb-test.openai.azure.com/",
                api_type="azure",
                api_version="2023-05-01.17.0",
                model_name="text-embedding-ada-002"
            )

#TODO: embedding function = openai_ef
embedding_functions = openai_ef
                
            

results = collection.query(
    query_texts=["American"],
    n_results= 5,
    include=["documents"]
)
print(results)


