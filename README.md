# COMP0016 2023-2024 Team 5: JurisBud AI

Add project abstract here

## Quickstart(Locally)

### Run JurisBud AI Altogether

#### Prerequisites

- Have Docker Desktop installed.
- Make sure Docker service is running
- Enter frontend/src directory and run `npm ci`
- Have a .env file in backend directory containing:
  - `AZURE_OPENAI_API_KEY` or `OPENAI_API_KEY`
  - `AZURE_OPENAI_ENDPOINT` or none if using openai
  - `OPENAI_API_VERSION=2023-03-15-preview`

#### Commands

```bash
./run.sh
```

<br>

### Run JurisBud AI Separately (Frontend, Backend, Large-Language Model(LLM))

#### Run Frontend

##### Commands

```bash
cd frontend
npm ci
npm run dev
```

#### Run Backend

##### Prerequisites

- Have Python 3.11 environment.
- Install requirements.
  - `pip install -r requirements.txt`

##### Commands

```bash
cd backend
python manage.py runserver
```

# DOESN'T WORK ANYMORE, NEEDS TO BE UPDATED below

#### Run LLM

##### Prerequisites

- Have Docker Desktop installed.
- Make sure Docker service is running

##### Commands

```bash
./run.sh
```
