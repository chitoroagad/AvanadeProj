#!/bin/bash

# Start docker containers
docker compose up --abort-on-container-exit --attach app

# clear docker containers
docker compose down
