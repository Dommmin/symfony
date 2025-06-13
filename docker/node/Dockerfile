FROM node:22-alpine

RUN apk add --no-cache git

WORKDIR /app

COPY frontend/package*.json ./

RUN npm install

COPY frontend/ .

RUN npm run build

COPY docker/node/start.sh /usr/local/bin/start.sh
COPY docker/node/supervisord.conf /etc/supervisor/supervisord.conf

EXPOSE 5173
