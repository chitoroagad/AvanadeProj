import io
import re

import magic
import openai
from django.conf import settings
from django.core import exceptions
from llm.llm import LLMCaller
from pdfminer.high_level import extract_text
from pdfminer.layout import LAParams

openai.api_key = settings.OPENAI_API_KEY


def validate_file_type(
    content, content_type, allowed_types=["application/pdf", "text/plain"]
):
    if content_type not in allowed_types:
        raise exceptions.ValidationError("Invalid file content type.")
    mime = magic.from_buffer(content, mime=True)
    if mime not in allowed_types:
        raise exceptions.ValidationError("Invalid file content type.")
    return mime


def preprocess_text(text):
    """Preprocess the text to remove unnecessary parts for more efficient summarization."""
    # Example: Remove excessive whitespace
    text = re.sub(r"\s+", " ", text)
    # Add more preprocessing steps here as needed
    return text


async def ask_gpt(prompt):
    try:
        iterator = LLMCaller.call_llm(prompt)
        async for event in iterator:
            if event["event"] == "on_chain_end":
                return (event["data"].get("output")["output"],)
    except:
        return ""


def clean_and_extract_important_text(text):
    """Uses OpenAI's model to clean and extract important text from the given text."""
    preprocessed_text = preprocess_text(text)  # Preprocess text first
    response = openai.chat.completions.create(
        model="gpt-3.5-turbo",  # Use an appropriate model here
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {
                "role": "user",
                "content": f"Summarize the following text into important points:\n{preprocessed_text}",
            },
        ],
    )
    return response.choices[0].message.content


def pdf_to_text(pdf_content):
    """Converts PDF file to text using pdfminer."""
    try:
        # pdf_text = extract_text(pdf_path)
        file_data = io.BytesIO(pdf_content)

        pdf_text = extract_text(file_data)
        # Convert the extracted text to a string
        return clean_and_extract_important_text(pdf_text)
    except Exception as e:
        return str(e)
