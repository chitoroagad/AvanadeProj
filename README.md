<!--
Hey, thanks for using the awesome-readme-template template.
If you have any enhancements, then fork this project and create a pull request
or just open an issue with the label "enhancement".

Don't forget to give this project a star for additional support ;)
Maybe you can mention me or this repo in the acknowledgements too
-->
<div align="center">

  <img src="/rmlogo.png" alt="logo" width="200" height="auto" />
  <h1>COMP0016 2023-2024 Team 5: JurisBUD AI</h1>
  
  <h3>
    How to use MS 365 and AI to extract better insights in Legal Knowledge Management
  </h3>
  <br>
  <br>  
   
</div>

<br />

<!-- Table of Contents -->

# :notebook_with_decorative_cover: Table of Contents

- [About the Project](#star2-about-the-project)
  - [Abstract](#book-bstract)
  - [Screenshots](#camera-screenshots)
  - [Tech Stack](#space_invader-tech-stack)
  - [Features](#dart-features)
  - [Environment Variables](#key-environment-variables)
- [Getting Started](#toolbox-getting-started)
  - [Prerequisites](#bangbang-prerequisites)
  - [Installation](#gear-installation)
  - [Running Tests](#test_tube-running-tests)
  - [Deployment](#triangular_flag_on_post-deployment)
- [Usage](#eyes-usage)
- [Roadmap](#compass-roadmap)
- [License](#warning-license)
- [Contact](#handshake-contact)
- [Documentations](#gem-documentations)

<!-- About the Project -->

## :star2: About the Project

### :book: Abstract

<div>
<p>
  With the rapid development of Artificial Intelligence, the trend leaded by OpenAI brings the public to be more willing to work with AI.
  However, it is unusual to have an AI assistant that is specifically designed for the legal industry. <br><br>
  <strong>This is where JurisBUD AI comes in.</strong>
  By using the latest concept of AI agents, JuridsBUD AI can help legal professionals to solve problems that they might face in their Day-to-Day work.<br><br>
  Instead of working alone till midnight, searching online and reading 1000 pages of documents, you can now just ask JurisBUD AI and a whole team 
  of AI agents with split work into tasks, that can assure clarity, enhancement and quality.
</p>

<!-- Screenshots -->

### :camera: Screenshots

<details>
        <summary>Click to view</summary>
#### Home

![Home](<./COMP0016\ Team\ 5\ Portfolio/images/Demo\ Screenshots/Home.png>)

#### Sign In

![Sign In](<./COMP0016\ Team\ 5\ Portfolio/images/Demo\ Screenshots/Sign\ in.png>)

#### Sign Up

![Sign Up](<./COMP0016\ Team\ 5\ Portfolio/images/Demo\ Screenshots/Sign\ UP.png>)

#### Dashboard

![Chats](<./COMP0016\ Team\ 5\ Portfolio/images/Demo\ Screenshots/Chats.png>)

#### Chat Details

![Chat Details](<./COMP0016\ Team\ 5\ Portfolio/images/Demo\ Screenshots/Chat\ Details.png>)

#### Chat Process

![Chat Process](<./COMP0016\ Team\ 5\ Portfolio/images/Demo\ Screenshots/Chat\ Process.png>)

#### Create Space

![Create Space](<./COMP0016\ Team\ 5\ Portfolio/images/Demo\ Screenshots/screencapture-localhost-3000-create-space-2024-03-24-05_02_19.png>)

#### Space

![Space](<./COMP0016\ Team\ 5\ Portfolio/images/Demo\ Screenshots/screencapture-localhost-3000-Space-18-2024-03-24-05_02_43.png>)

</details>

<!-- TechStack -->

### :space_invader: Tech Stack

<details>
  <summary>Client</summary>
  <ul>
    <li><a href="https://www.typescriptlang.org/">TypeScript</a></li>
    <li><a href="https://www.javascript.com/">JavaScript</a></li>
    <li><a href="https://nextjs.org/">Next.js</a></li>
    <li><a href="https://daisyui.com/">Daisy UI</a></li>
    <li><a href="https://tailwindcss.com/">TailwindCSS</a></li>
  </ul>
</details>

<details>
  <summary>Backend</summary>
  <ul>
    <li><a href="https://www.djangoproject.com/">Django</a></li>
    <li><a href="https://www.langchain.com/">LangChain</a></li>
    <li><a href="https://www.python.org/">Python</a></li>
  </ul>
</details>

<details>
<summary>Database</summary>
  <ul>
    <li><a href="https://www.trychroma.com/">ChromaDB</a></li>
  </ul>
</details>

<details>
<summary>DevOps</summary>
  <ul>
    <li><a href="https://www.docker.com/">Docker</a></li>
  </ul>
</details>

<!-- Features -->

### :dart: Features

- Multi-Agent System
- Legal Knowledge Management
- Multi step problem-solving
- Can use various tool/models

<!-- Env Variables -->

### :key: Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`AZURE_OPENAI_API_KEY` or `OPENAI_API_KEY`

`AZURE_OPENAI_ENDPOINT` or none if using openai

`OPENAI_API_VERSION=2023-03-15-preview`

<!-- Getting Started -->

## :toolbox: Getting Started

<!-- Prerequisites -->

### :bangbang: Prerequisites

- Environment variables specified in `backend/.env`

#### Running locally

- latest Node.js + npm.
- Python >= 3.10 environment.

#### Running with Docker

- Docker Desktop installed.

<!-- Installation -->

### :gear: Installation

1. Clone the repo

```sh
git clone https://github.com/DariusChit/AvanadeProj.git
```

_Only for local running past this step_

2. Install NPM packages

```sh
cd frontend
npm ci
```

3. Install Python packages

```sh
pip install -r backend/requirements.txt
```

<!-- Running Tests -->

### :test_tube: Running Tests

```sh
cd backend
python manage.py test
```

<!-- Deployment -->

### :triangular_flag_on_post: Deployment

#### Docker

_You may want to edit the `llm.py` file in the backend to not wipe the chroma database on every run._

1. Create VM
2. Make sure to have Docker installed
3. Run `./run.sh` in the root directory
4. Make sure the locahost is accessible from a domain.

<!-- Usage -->

## :eyes: Usage

### Docker

- `./run.sh`
- Access the website at `localhost:3000`
- default user: email=_juris@bud.com_ password=_password_

### Local

```sh
docker run -p 8000:8000 -e ALLOW_RESET=TRUE -e IS_PERSISTENT=TRUE -v chromadb:/chroma/chroma -d chromadb/chroma
cd frontend
npm run dev &
cd ../backend
python manage.py runserver localhost:8080
```

<!-- Roadmap -->

## :compass: Roadmap

![Gantt Chart](<./COMP0016\ Team\ 5\ Portfolio/images/Online\ Gantt\ 20240322.png>)

<!-- License -->

## :warning: License

GNU GENERAL PUBLIC LICENSE V3.0. See LICENSE for more information.

<!-- Contact -->

## :handshake: Contact

- Zhaoqi Chen - zhaoqi.chen.22@ucl.ac.uk
- Darius Chitoroaga - darius.chitoroaga.22@ucl.ac.uk
- Faisal Hassan - faisal.hassan.22@ucl.ac.uk

<!-- Acknowledgments -->

## :gem: Documentations

- [LangChain](https://python.langchain.com/docs/get_started/introduction)
- [Azure OpenAI](https://learn.microsoft.com/en-us/azure/ai-services/openai/)

- [Portfolio](https://students.cs.ucl.ac.uk/2023/group5/)
- [User Manual](https://students.cs.ucl.ac.uk/2023/group5/usermn.html)
- [Deployment Manual](https://students.cs.ucl.ac.uk/2023/group5/dply.html)
- [CC License](https://students.cs.ucl.ac.uk/2023/group5/cc.html)
- [EULA](https://students.cs.ucl.ac.uk/2023/group5/eula.html)
- [Legal Statement](https://students.cs.ucl.ac.uk/2023/group5/Project%20Legal%20Statement.pdf)
- [Summary Video](https://youtu.be/HTEUgppOQUs)
- [Blog](https://jurisbudaidevelopmentblog.wordpress.com/)
