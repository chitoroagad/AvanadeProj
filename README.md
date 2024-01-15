# AvanadeProj

## Usage:

1. Build docker image
   ```bash
   docker build -f Dockerfile -t autogen_img .
   ```
2. Run docker container
   ```bash
   docker run -it -v \`pwd\`/src:/src autogen_img:latest python /src/Autogen_test.py
   ```
