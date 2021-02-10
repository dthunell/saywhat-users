FROM node:14-alpine

# create root application folder
WORKDIR /app

# copy configs to /app folder
COPY package*.json /app/
COPY tsconfig.json /app/
COPY .eslint* /app/
COPY wait-for.sh /

# copy source code to /app/src folder
COPY src /app/src
COPY tests /app/tests

# Install and test
RUN npm install
RUN npm run build

EXPOSE 80
EXPOSE 443