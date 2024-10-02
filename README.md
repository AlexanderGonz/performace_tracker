# PerformanceTracker
Code Challenge for a performance tracking app
Using Nx as the build system and docker for containerization

On frontend, it's a react app with Ionic
On backend, it's a node app and uses Prisma as the ORM for the Postgres database

## Run tasks

To run the dev server for your app, use:

```sh
npx nx serve frontend
```

To create a production bundle:

```sh
npx nx build frontend
```

## Docker

To run the docker container use the following command:

```sh
docker compose up --build
```

In the docker-compose.yml, It's added volume mounts for both the backend and frontend services. This allows for live reloading of code changes without rebuilding the containers
The backend is running on port 4000 and the frontend on 3000