FROM node:14.17.4-alpine3.14

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

ARG PORT=8000
ENV PORT $PORT
EXPOSE $PORT

RUN mkdir /opt/node_app && chown root:root /opt/node_app
WORKDIR /opt/node_app

USER root
COPY --chown=root:root package*.json ./
RUN npm install --no-optional && npm cache clean --force
ENV PATH /opt/node_app/node_modules/.bin:$PATH

COPY --chown=root:root . ./

ENTRYPOINT ["node", "./src/app.js"]
