FROM python:3.11-slim-bookworm

RUN : \
    && apt-get update \
    && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
    software-properties-common \
    && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
    python3-venv \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* \
    && :

RUN python3 -m venv /venv
ENV PATH=/venv/bin:$PATH

RUN cd /venv; pip install pyautogen openai chromadb
# Pre-load popular packages as per https://learnpython.com/blog/most-popular-python-packages/
RUN pip install numpy requests docker datasets

ENTRYPOINT python "/src/Autogen_test.py"
