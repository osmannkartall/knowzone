FROM node:14.17.4-alpine3.14 as build

WORKDIR /app

COPY package*.json ./
RUN npm i npm@7.21.0 -g 
RUN npm install
COPY . ./

ENV REACT_APP_KNOWZONE_BE_URI=http://localhost:8000
ENV REACT_APP_KNOWZONE_FE_URI=http://localhost:3000
ENV DISABLE_ESLINT_PLUGIN=true

RUN npm run build

FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf
COPY ./nginx.conf /etc/nginx/conf.d/

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]