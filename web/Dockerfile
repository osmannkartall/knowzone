FROM node:18.15.0-alpine3.17 as base

WORKDIR /app

ENV REACT_APP_KNOWZONE_BE_URI=http://localhost:8000
ENV REACT_APP_KNOWZONE_FE_URI=http://localhost:3000
ENV DISABLE_ESLINT_PLUGIN=true

COPY package*.json ./

# stage for the test build
FROM base as test
RUN npm ci
COPY . .
RUN CI=true npm run test

# stage for production build
FROM base as prod
RUN npm ci --production
COPY . .
RUN npm run build

FROM nginx:stable-alpine
COPY --from=prod /app/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY ./nginx.conf /etc/nginx/conf.d/

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]