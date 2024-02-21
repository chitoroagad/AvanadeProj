#!/bin/sh

# Start docker containers
docker compose up --abort-on-container-exit --attach app

# Clean docker containers
docker compose down

# Clean docker volumes
docker volume rm avanadeproj_data
