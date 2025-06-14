FROM node:22-alpine

WORKDIR /app

COPY ./frontend/package*.json ./frontend/vite.config.ts ./frontend/tsconfig.json ./
RUN npm ci

COPY deployment/node/.env .env

COPY ./frontend .

RUN npm run build
