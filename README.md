# PerformanceTracker
Code Challenge for a performance tracking app
Using Nx as the build system, docker for containerization and typescript for the backend and frontend.

## Docker

This Application was built using docker, to run the docker container use the following command:

```sh
docker compose up --build
```

This command will start the docker container and run the backend, frontend, redis and postgres services.
This includes a migration to create the database and tables.

In the docker-compose.yml, It's added volume mounts for both the backend and frontend services. This allows for live reloading of code changes without rebuilding the containers
The backend is running on port 4000 and the frontend on 3000

## Architecture

The app is built with a modular architecture in mind. The frontend and backend are both using the same shared libraries. This allows for a lot of code to be reused between the two services.

NX was used as the build system, enabling efficient management of the monorepo structure and shared code between frontend and backend.

The backend is using Prisma as the ORM for the Postgres database. It's also using Redis for the cache layer.

The frontend is using React with Ionic for the UI.

## CI/CD

A github pipeline was created to run the tests and build the application. But it's not fully functional yet.