FROM node:18.15.0 as base

WORKDIR /app

COPY package*.json ./

# stage for test build
FROM base as test
RUN apt-get install libcurl4
RUN npm ci
COPY . .
RUN npm run test

# stage for prod build
FROM base as prod
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV
ARG PORT=8000
ENV PORT $PORT
EXPOSE $PORT
RUN npm ci --production
COPY . .
CMD ["node", "./src/app.js"]