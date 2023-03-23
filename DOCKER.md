# Docker Installation Instructions
The first step is to get the Docker Daemon running on your machine. For Windows and MacOS users, [Docker Desktop](https://www.docker.com/products/docker-desktop/), is the easiest way to get started. Linux users can install docker desktop or the docker engine/server directly through `curl` or `apt-get`. For more information see, [Docker Engine Installation](https://docs.docker.com/engine/install/).

## Docker Desktop (Windows, MacOS, Linux)
Once docker desktop has been successfully installed and running, you can verify that it is running by running the following command in your terminal:
```bash
docker ps
```
If you see a list of running containers, then you are good to go. If you see an error message, then you may need to restart your machine.

## Important For Windows Users
If you open Docker Desktop and are stuck waiting for it to start you may need to close Docker Desktop entirely and open up the terminal. Once inside run the command
```bash
wsl --update
```
The main problem is WSL2 does not auto install the kernel when WSL2 installs, yet Docker Desktop expects it already installed.

## Docker Engine (Linux Only)
If you are using the docker engine, you will need to run the following command to start the docker daemon:
```bash
sudo dockerd
```
You can verify that the docker daemon is running by running the following command in your terminal:
```bash
docker ps
```

# Cloning the Repository
The next step is to clone the repository. You can do this by running the following command in your terminal:
```bash
git clone https://github.com/SomberTM/merck-label-dashboard-typescript.git
```
This will clone the repository into a folder called `merck-label-dashboard-typescript` in your current directory.
> Navigate to the `merck-label-dashboard-typescript` folder by running the following command:
> ```bash
> cd merck-label-dashboard-typescript
> ```

# Building the Docker Image

> Double check that you are in the `merck-label-dashboard-typescript` folder and that the docker daemon is running. For Windows and MacOS users, having docker desktop open is sufficient. For Linux users, see the [Docker Engine](#docker-engine-linux-only) section.

The next step is to build the docker image. You can do this by running the following command in your terminal:
```bash
docker-compose build
```
Once the image is build you can run 
```bash
docker-compose up
```
to start the server. You can verify that the everything is running by navigating to `localhost:3000` in your browser. The api is running on `localhost:5000`.