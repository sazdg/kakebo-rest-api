# from base image node
FROM node:8.11-slim

# RUN mkdir -p /usr/src/app
# WORKDIR /usr/src/app
WORKDIR /src

# copying all the files from your file system to container file system
COPY package*.json ./
COPY .env ./

# install all dependencies
RUN npm install 

ENV PORT=3070
# copy other files as well
COPY ./src .

#expose the port
EXPOSE 3070

# command to run when intantiate an image
# The CMD option takes every argument as a separate item in an array
CMD ["node", "server.js"]

# when ready in CMD, crea la docker in questa cartella: 
# boot2docker start
# docker build -t kakebo .
# docker run -p 13070:3070 –name docker-kakebo kakebo