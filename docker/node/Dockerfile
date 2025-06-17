FROM node:22-alpine

ARG USER_ID=1000
ARG GROUP_ID=1000

RUN apk add --no-cache bash

RUN usermod -u ${USER_ID} node
RUN groupmod -g ${GROUP_ID} node

RUN chown -R node:node /app

WORKDIR /app

USER node

EXPOSE 5173
