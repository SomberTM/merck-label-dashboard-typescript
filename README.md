<!-- Here starts the template>

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

<!-- PROJECT LOGO -->
<br />
<div align="center">
<h1 align="center" id="readme-top">Merck Lab Logistics Project</h1>

Find us on GitHub!

[![Contributors][contributors-shield]][contributors-url]

</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
        <li><a href="#tools">Tech Stack / Toolkit</a></li>
    </li>
    <li><a href="#getting-started">Getting Started</li>
    <ul><a href="#docker">Docker Installation</a></ul>
    <ul><a href="#installation">Cloning the Repository</a></ul>
    <ul><a href="#imagebuild">Building the Docker Image</a></ul>
    <ul><a href="#alternate">If Docker not working</a></ul>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<h2 id="about-the-project"> About The Project</h2>

Our project seeks to optimize laboratory management by creating a digital solution for logistics and safety.

Manually created labels in laboratories create additional challenges in readability, consistency, and reproducibility.  As a result, it can be difficult to manage samples and scientists can forget to discard expired samples which causes lab safety violations.

Approximately 66% of all lab safety violations are due to solutions not being discarded on time.

Our application's goal is to reduce this number while making overall sample management much more convenient for scientists.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<h2 id="tools">Tech Stack / Toolkit</h2>

-   [![React][react.js] React][react-url]

-   [![typescript][typescript.js] Typescript][typescript-url]

-   [![express][express.js] Express][express-url]

-   [![PostgreSQL][postgresql.js] PostgreSQL][postgresql-url]

-   [![prisma][prisma.js] Prisma][prisma-url]

-   [![redux][redux.js] Redux & Redux-Thunk][redux-url]

-   [![mui][mui.js] Material UI][mui-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

<h2 id="docker">1. Docker Installation Instructions</h2>

The first step is to get the Docker Daemon running on your machine. For Windows and MacOS users, [Docker Desktop](https://www.docker.com/products/docker-desktop/), is the easiest way to get started. Linux users can install docker desktop or the docker engine/server directly through `curl` or `apt-get`. For more information see, [Docker Engine Installation](https://docs.docker.com/engine/install/).

### --Docker Desktop (Windows, MacOS, Linux)

Once docker desktop has been successfully installed and running, you can verify that it is running by running the following command in your terminal:

```bash
docker ps
```

If you see a list of running containers, then you are good to go. If you see an error message, then you may need to restart your machine.

### --Important For Windows Users

If you open Docker Desktop and are stuck waiting for it to start you may need to close Docker Desktop entirely and open up the terminal. Once inside run the command

```bash
wsl --update
```

The main problem is WSL2 does not auto install the kernel when WSL2 installs, yet Docker Desktop expects it already installed.

### --Docker Engine (Linux Only)

If you are using the docker engine, you will need to run the following command to start the docker daemon:

```bash
sudo dockerd
```

You can verify that the docker daemon is running by running the following command in your terminal:

```bash
docker ps
```

<h2 id="installation">2. Cloning the Repository</h2>

The next step is to clone the repository. You can do this by running the following command in your terminal:

```bash
git clone https://github.com/SomberTM/merck-label-dashboard-typescript.git
```

This will clone the repository into a folder called `merck-label-dashboard-typescript` in your current directory.

> Navigate to the `merck-label-dashboard-typescript` folder by running the following command:
>
> ```bash
> cd merck-label-dashboard-typescript
> ```

to start the server. You can verify that the everything is running by navigating to `localhost:3000` in your browser. The api is running on `localhost:5000`.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<h2 id="imagebuild">3. Building the Docker Image</h2>

> Double check that you are in the `merck-label-dashboard-typescript` folder and that the docker daemon is running. For Windows and MacOS users, having docker desktop open is sufficient. For Linux users, see the [Docker Engine](#docker-engine-linux-only) section.

The next step is to build the docker image. You can do this by running the following command in your terminal:

```bash
docker-compose build
```

Once the image is build you can run

```bash
docker-compose up
```

<h2 id="alternate">4. If Docker not working</h2>
If there is an error using Docker commends, please try:

-- Set up Postgres database
* Install Postgres from "https://www.postgresql.org/"
* Set up your username and password
* Set your port to be 5432
* Create a database


-- Set up URI and start server

> ```bash
> cd merck-label-dashboard-typescript/server
> ```

* Create a text file and save it as a .env file, and you can simply name it ".env" 
* The .env should have one line of the URI information: 
* URI format follows: DB_URI = postgres://{user}:{password}@localhost:{port}/{database_name}
* The username and password are the username and password set for the Postgres
* Default port is 5432, and the database name is set in the Postgres
* The bracket should be taken out in the URI, e.g., DB_URI = postgres://abc:123456@localhost:5432/database_1

Run the following comments in the terminal:
> ```bash
> npx prisma migrate dev --name init --preview-feature
> ```

> ```bash
> npm install
> ```

> ```bash
> npm start
> ```

-- Set up the frontend
Start a new terminal and nevigate back to merck-label-dashboard-typescript

> ```bash
> cd merck-label-dashboard-typescript/client
> ```

> ```bash
> npm install --force
> ```

> ```bash
> npm start
> ```

Once the IP address is obtained, copy that into browser and the GUI is opened.
<!-- USAGE EXAMPLES -->

## Usage

Below is a short demonstration of the user interface

![Product Name Screen Shot][product-screenshot]

<!-- Here's a blank template to get started: To avoid retyping too much info. Do a search and replace with your text editor for the following: `github_username`, `repo_name`, `twitter_handle`, `linkedin_username`, `email_client`, `email`, `project_title`, `project_description` -->


<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

Project Link: [https://github.com/SomberTM/merck-label-dashboard-typescript](https://github.com/SomberTM/merck-label-dashboard-typescript)

<h3>LinkedIn pages of developers:</h3>

Thomas Hughes: [https://www.linkedin.com/in/thomas-hughes-450557253/](https://www.linkedin.com/in/thomas-hughes-450557253/)

Justin Smith: [https://www.linkedin.com/in/justin-smith-3bb9b8229/](https://www.linkedin.com/in/justin-smith-3bb9b8229/)

Zixiao Wang: [https://www.linkedin.com/in/zixiao-wang-15b16620b/](https://www.linkedin.com/in/zixiao-wang-15b16620b/)

Kihunn Anderson: [https://www.linkedin.com/in/kihunn/](https://www.linkedin.com/in/kihunn/)

Zihao Liang: [https://www.linkedin.com/in/zihao-liang-232988149/](https://www.linkedin.com/in/zihao-liang-232988149/)

Alexis Hvostal (Team Leader): [https://www.linkedin.com/in/alexis-hvostal/](https://www.linkedin.com/in/alexis-hvostal/)

<h3>GitHub pages of developers:</h3>

Thomas Hughes: [https://github.com/SomberTM](https://github.com/SomberTM)

Justin Smith: [https://github.com/ChimayoX](https://github.com/ChimayoX)

Zixiao Wang: [https://github.com/ChopinNo3Op9](https://github.com/ChopinNo3Op9)

Kihunn Anderson: [https://github.com/kihunn](https://github.com/kihunn)

Zihao Liang: [https://github.com/liang300pu](https://github.com/liang300pu)

Alexis Hvostal (Team Leader): [https://github.com/alexishvostal](https://github.com/alexishvostal)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->

## Acknowledgments


* Merck mentors: Dr. Jonathan Fine and Dr. Terri Bui
* Dr. Mark D. Ward, Meggie Betz, Kevin Amstutz, Nick Rosenorn
* All other Data Mine staff at Purdue

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/forks/SomberTM/merck-label-dashboard-typescript?style=social
[contributors-url]: https://github.com/SomberTM/merck-label-dashboard-typescript
[issues-shield]: https://img.shields.io/github/issues/github_username/repo_name.svg?style=for-the-badge
[issues-url]: https://github.com/github_username/repo_name/issues

<!-->

[product-screenshot]: assets/demo.gif
[next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[next-url]: https://nextjs.org/
[react.js]: assets/react.svg
[react-url]: https://reactjs.org/
[typescript.js]: assets/typescript.svg
[typescript-url]: https://www.typescriptlang.org/
[express.js]: assets/express.svg
[express-url]: https://expressjs.com/
[postgresql.js]: assets/postgres.svg
[postgresql-url]: https://www.postgresql.org/
[prisma.js]: assets/prisma.svg
[prisma-url]: https://www.prisma.io/
[redux.js]: assets/redux.svg
[redux-url]: https://redux.js.org/
[mui.js]: assets/mui.svg
[mui-url]: https://mui.com/
