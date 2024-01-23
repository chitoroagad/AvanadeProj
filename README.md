# AvanadeProj

## Usage:

1. Build docker image
   ```bash
   docker build -f Dockerfile -t autogen_img .
   ```
2. Run App

   ```bash
   docker compose up -d
   ```

3. Delete close + delete app

```bash
    docker compose down
```

_chroma has persistent storage, so to clear storage:_

```bash
    docker volume rm autogen_data
```
