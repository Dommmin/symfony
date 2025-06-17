# Building a Modern Headless + Frontend Application with Docker: A Complete Guide

## Table of Contents
- [Building a Modern Headless + Frontend Application with Docker: A Complete Guide](#building-a-modern-headless--frontend-application-with-docker-a-complete-guide)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Project Structure](#project-structure)
  - [Docker Configuration](#docker-configuration)
    - [PHP Backend Service](#php-backend-service)
    - [Node.js Frontend Service](#nodejs-frontend-service)
    - [Nginx Reverse Proxy](#nginx-reverse-proxy)
    - [Database and Cache Services](#database-and-cache-services)
  - [Development Workflow](#development-workflow)
  - [Environment Configuration](#environment-configuration)
  - [Best Practices and Tips](#best-practices-and-tips)
  - [Source Code](#source-code)

## Introduction

In this comprehensive guide, we'll explore how to set up and manage a modern web application using a headless architecture with Docker. This setup combines a PHP-based backend (Symfony) with a Node.js frontend, providing a robust and scalable development environment. We'll cover everything from initial setup to production deployment considerations.

## Project Structure

Our application follows a clear separation of concerns with the following structure:

```
project/
├── api/                 # Symfony backend application
├── frontend/           # Node.js frontend application
├── docker/
│   ├── nginx/         # Nginx configuration
│   ├── node/          # Node.js Dockerfile
│   └── php/           # PHP Dockerfile and configuration
└── docker-compose.yml # Main Docker configuration
```

## Docker Configuration

### PHP Backend Service

The PHP service is configured to run a Symfony application with PHP-FPM. Here's the key configuration:

```yaml
services:
  php:
    build:
      context: .
      dockerfile: docker/php/Dockerfile
      args:
        - USER_ID=${USER_ID:-1000}
        - GROUP_ID=${GROUP_ID:-1000}
    container_name: ${COMPOSE_PROJECT_NAME}_api
    volumes:
      - ./api:/var/www/html:cached
      - ./docker/php/php.ini:/usr/local/etc/php/conf.d/php.ini
      - ./docker/php/www.conf:/usr/local/etc/php-fpm.d/www.conf
    networks:
      - symfony-network
    ports:
      - "9000:9000"
```

Key features:
- Uses PHP 8.4 with FPM
- Proper user permissions handling
- Volume mounting for live code updates
- Custom PHP configuration
- Health checks for dependencies

### Node.js Frontend Service

The frontend service is configured to run a Node.js application with hot-reloading:

```yaml
services:
  node:
    build:
      context: .
      dockerfile: docker/node/Dockerfile
    container_name: ${COMPOSE_PROJECT_NAME}_frontend
    command: ["sh", "-c", "if [ ! -d 'node_modules' ]; then npm install; fi && npm run dev"]
    working_dir: /app
    volumes:
      - ./frontend:/app:cached
    environment:
      - VITE_API_URL=http://api.symfony.local
    ports:
      - "5173:5173"
```

Key features:
- Uses Node.js 22 Alpine for smaller image size
- Automatic node_modules installation
- Development mode with hot-reloading
- Environment variable configuration
- Volume mounting for live code updates

### Nginx Reverse Proxy

Nginx serves as a reverse proxy, handling requests and routing them to the appropriate service:

```yaml
services:
  nginx:
    image: nginx:alpine
    container_name: ${COMPOSE_PROJECT_NAME}_nginx
    ports:
      - "80:80"
    volumes:
      - ./docker/nginx/nginx.conf:/etc/nginx/conf.d/default.conf
```

### Database and Cache Services

The setup includes MySQL and Redis for data persistence and caching:

```yaml
services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_PASSWORD}
      MYSQL_USER: ${DB_USER}
      MYSQL_PASSWORD: ${DB_PASSWORD}
      MYSQL_DATABASE: ${DB_DATABASE}
    healthcheck:
      test: [ "CMD", "mysqladmin", "ping", "-h", "localhost" ]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:alpine
    healthcheck:
      test: [ "CMD", "redis-cli", "ping" ]
      interval: 5s
      timeout: 3s
      retries: 5
```

## Development Workflow

1. **Host Configuration**
   Add the following entries to your `/etc/hosts` file:
   ```
   127.0.0.1 api.symfony.local
   127.0.0.1 symfony.local
   ```

2. **Starting the Environment**
   ```bash
   docker-compose up -d
   ```

3. **Accessing Services**
   - Backend API: http://api.symfony.local
   - Frontend: http://symfony.local
   - Adminer (Database): http://localhost:8080
   - MailHog (Email Testing): http://localhost:8025

4. **Development Process**
   - Backend changes are automatically reflected due to volume mounting
   - Frontend changes trigger hot-reloading
   - Database changes persist in a Docker volume

## Environment Configuration

Create a `.env` file in your project root with the following variables:

```env
COMPOSE_PROJECT_NAME=your-project
DB_PASSWORD=your-password
DB_USER=your-user
DB_DATABASE=your-database
USER_ID=1000
GROUP_ID=1000
```

## Best Practices and Tips

1. **Performance Optimization**
   - Use `:cached` for volume mounts to improve performance
   - Implement proper health checks for all services
   - Use Alpine-based images for supporting services (Nginx, Redis)

2. **Security Considerations**
   - Never expose database ports in production
   - Use environment variables for sensitive data
   - Implement proper user permissions

3. **Development Tips**
   - Use Docker Compose profiles for different environments
   - Implement proper logging
   - Use volume mounts for development, but consider copying files in production

4. **Maintenance**
   - Regularly update base images
   - Monitor container logs
   - Implement proper backup strategies for volumes

## Source Code

The complete source code for this project is available on GitHub. You can find it in the repository: [symfony-headless-frontend](https://github.com/dommin/symfony-headless-frontend). The repository includes:

- Complete Docker configuration
- PHP and Node.js Dockerfiles
- Nginx configuration
- Example environment files
- Additional documentation and setup instructions

For more insights and professional experience, you can connect with me on [LinkedIn](https://www.linkedin.com/in/dominik-jasiński/).