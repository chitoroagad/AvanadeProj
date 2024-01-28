# AvanadeProj

## Usage:

1. Build docker image
   ```bash
   docker build -f Dockerfile -t autogen_img .
   ```
2. Run App

   ```bash
   sh start.sh
   ```

_chroma has persistent storage, so to clear storage:_

```bash
    docker volume rm autogen_data
```
