#!/bin/sh

# Wait for the database to be ready
echo "Waiting for database to be ready..."
./wait-for-it.sh postgres:5432 -t 60

# Clear Nx cache
echo "Clearing Nx cache..."
npx nx reset

# Check if migrations exist
if [ -d "prisma/migrations" ] && [ "$(ls -A prisma/migrations)" ]; then
    echo "Running database migrations..."
    npx prisma migrate deploy
else
    echo "No migrations found. Creating initial migration..."
    npx prisma migrate dev --name init
fi

# Start the application
echo "Starting the application..."
npm run start:backend