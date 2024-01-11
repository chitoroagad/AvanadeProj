
# import libraries
import os
from azure.core.credentials import AzureKeyCredential
from azure.ai.documentintelligence import DocumentIntelligenceClient

# set `<your-endpoint>` and `<your-key>` variables with the values from the Azure portal
endpoint = "https://test-docai2.cognitiveservices.azure.com/"
key = "6a81c91a4ad5443ca1a2e200268f4474"


def analyze_layout():
    # sample document
    formUrl = "https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-layout.pdf"

    document_intelligence_client = DocumentIntelligenceClient(
        endpoint=endpoint, credential=AzureKeyCredential(key)
    )

    poller = document_intelligence_client.begin_analyze_document_from_url(
        "prebuilt-layout", formUrl
    )
    result = poller.result()

    if any([style.is_handwritten for style in result.styles]):
        print("Document contains handwritten content")
    else:
        print("Document does not contain handwritten content")

    for page in result.pages:
        print(f"----Analyzing layout from page #{page.page_number}----")
        print(
            f"Page has width: {page.width} and height: {page.height}, measured with unit: {page.unit}"
        )

        for line_idx, line in enumerate(page.lines):
            words = get_words(page, line)
            print(
                f"...Line # {line_idx} has word count {len(words)} and text '{line.content}' "
                f"within bounding polygon '{line.polygon}'"
            )

            for word in words:
                print(
                    f"......Word '{word.content}' has a confidence of {word.confidence}"
                )

        for selection_mark in page.selection_marks:
            print(
                f"Selection mark is '{selection_mark.state}' within bounding polygon "
                f"'{selection_mark.polygon}' and has a confidence of {selection_mark.confidence}"
            )

    for table_idx, table in enumerate(result.tables):
        print(
            f"Table # {table_idx} has {table.row_count} rows and "
            f"{table.column_count} columns"
        )
        for region in table.bounding_regions:
            print(
                f"Table # {table_idx} location on page: {region.page_number} is {region.polygon}"
            )
        for cell in table.cells:
            print(
                f"...Cell[{cell.row_index}][{cell.column_index}] has text '{cell.content}'"
            )
            for region in cell.bounding_regions:
                print(
                    f"...content on page {region.page_number} is within bounding polygon '{region.polygon}'"
                )

    print("----------------------------------------")


if __name__ == "__main__":
    analyze_layout()