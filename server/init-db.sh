#!/bin/bash

docker run -d \
  -p 27017:27017 \
  --name dev-mongo \
  -v dev-mongo-data:/data/db \
  mongo:latest \
  mongod --replSet rs0

sleep 4

docker exec dev-mongo \
  mongosh --eval "rs.initiate({ _id: 'rs0', members: [{ _id: 0, host: 'localhost:27017' }] })"