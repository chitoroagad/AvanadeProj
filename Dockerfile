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

WORKDIR /src

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

ENTRYPOINT python "/src/main.py"
