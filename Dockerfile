FROM python:3.11-slim-bookworm

WORKDIR /src

COPY frontend/src/ /src/

CMD ["bash"]
