#!/bin/sh

# Build necessary docker images
pwd
echo "Building backend docker image"
docker buildx build -t backend -f backend/Dockerfile . || exit 1
echo "Building frontend docker image"
docker buildx build -t frontend -f frontend/Dockerfile --target dev . || exit 1

# Create docker vol
echo "Creating chromadb volume"
docker volume create chromadb

# Start docker containers
echo "Starting chromadb container"
docker run -p 8000:8000 -e ALLOW_RESET=TRUE -e IS_PERSISTENT=TRUE \
	--network host \
	-v chromadb:/chroma/chroma \
	-d chromadb/chroma
echo "Starting frontend container"
docker run -p 3000:3000 -v ./frontend/:/app -v /app/node_modules -v /app/.next \
	--network host \
	-d frontend npm run dev
echo "Starting backend container and attach"
docker run -p 8080:8080 --network host \
	-v ./backend/:/src -it backend python manage.py runserver localhost:8080

# Print out running containers
echo "Running containers:"
docker ps

# kill all containers
docker stop '$(docker ps -q)'
