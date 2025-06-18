FROM node:22-alpine

ARG USER_ID=1000
ARG GROUP_ID=1000

RUN apk add --no-cache bash shadow

RUN usermod -u ${USER_ID} node
RUN groupmod -g ${GROUP_ID} node

WORKDIR /app

RUN chown -R node:node /app

USER node

EXPOSE 5173
