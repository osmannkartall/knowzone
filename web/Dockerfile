FROM node:14.17.4-alpine3.14
WORKDIR /app

COPY package*.json ./
RUN npm i npm@7.21.0 -g 
RUN npm install
COPY . ./

EXPOSE 3000

ENTRYPOINT ["npm", "start"]