# Run ALL

## Prerequisites

- Have Docker Desktop installed.
- Make sure Docker service is running

## Commands

```bash
./run.sh
```

<br>

# Run seperately

## Run Frontend

### Commands

```bash
cd frontend
npm ci
npm run dev
```

## Run Backend

### Prerequisites

- Have Python 3.11 environment.
- Install requirements.
  - `pip install -r requirements.txt`

### Commands

```bash
cd backend
python manage.py runserver
```

## Run LLM

### Prerequisites

- Have Docker Desktop installed.
- Make sure Docker service is running

### Commands

```bash
./run.sh
```
