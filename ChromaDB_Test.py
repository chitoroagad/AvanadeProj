from datasets import load_dataset


dataset = load_dataset("pile-of-law/pile-of-law", "sec_administrative_proceedings", split="train")
#print(dataset[0])

import chromadb
client = chromadb.Client()


import chromadb.utils.embedding_functions as embedding_functions
openai_ef = embedding_functions.OpenAIEmbeddingFunction(
                api_key="148aa1a7a3dc4dd88004bfe29e87d2c6", # Key 1
                api_base="https://chromadb-test.openai.azure.com/",
                api_type="azure",
                api_version="2023-05-01.17.0",
            )

#TODO: embedding function = openai_ef
embedding_functions = openai_ef

        
collection = client.create_collection("pile-of-law")
collection.add(
    ids=[str(i) for i in range(0, 10)],  
    documents=dataset["text"][:10],
    uris=dataset["url"][:10] 
)

results = collection.query(
    query_texts=["Rule 155"],
    n_results= 5,
    include=["uris"])

print(results)

#TODO: upload a.pdf and get text inside into the document instead of "a.pdf" (Document Intelligence)
#Try doc ai:

