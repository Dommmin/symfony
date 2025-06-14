#!/bin/bash

# Fail immediately if any command fails
set -eo pipefail

# Deployment header
echo "🚀 Starting production deployment..."
echo "🕒 $(date)"

# Pull latest images
echo "📥 Pulling updated Docker images..."
docker compose pull

# Stop existing containers if running
echo "🛑 Stopping existing containers..."
docker compose down --remove-orphans

# Start fresh containers
echo "🔄 Starting new containers..."
docker compose up -d --force-recreate

# Run application maintenance
echo "🔧 Running application maintenance tasks..."
docker compose exec -T php php bin/console cache:clear --env=prod
docker compose exec -T php php bin/console cache:warmup --env=prod
# docker compose exec -T php php bin/console doctrine:migrations:migrate --no-interaction

# Cleanup old Docker objects
echo "🧹 Cleaning up unused Docker resources..."
docker system prune --volumes -f

# Success message
echo "✅ Deployment completed successfully!"
echo "🕒 $(date)"
