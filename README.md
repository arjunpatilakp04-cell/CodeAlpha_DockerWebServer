# CodeAlpha_DockerWebServer

A web server deployed in Docker containers, built for the CodeAlpha DevOps Internship, Task 4: Web Server using Docker.

## What it does

- Runs a Node.js (Express) web server in its own container
- Puts an nginx reverse proxy in front of it, exposed on port 8080
- Checks the server's health every 30 seconds with a Docker health check
- Logs every request as JSON
- Restarts the server automatically if it crashes
- Includes a separate nginx image that serves a simple HTML page

## How it fits together

```text
Browser -> nginx (:8080) -> web-server (Express, :3000)
```

Only nginx is open to the outside. The web server can only be reached inside the Docker network.

## Project structure

```text
.
├── Dockerfile            Static page image (nginx + html/)
├── docker-compose.yml    Runs web-server and nginx together
├── html/index.html       Static page
├── nginx/nginx.conf      Reverse proxy settings
└── web-server/
    ├── Dockerfile        Image for the Express app
    ├── server.js         Server with health, metrics and logging
    └── package.json
```

## Run the full stack

```bash
docker compose up -d --build
```

| Page | URL |
|---|---|
| Home | http://localhost:8080/ |
| Health check | http://localhost:8080/health |
| Metrics | http://localhost:8080/metrics |

## Run the static page image

```bash
docker build -t codealpha-static .
docker run -d -p 8081:80 --name static-site codealpha-static
```

Then open http://localhost:8081.

## Container commands

```bash
docker compose ps
docker
