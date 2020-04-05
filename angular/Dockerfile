# First stage: build angular app
FROM node:12-buster as build

# Create Directory for the Container
WORKDIR /usr/src/app

# Only copy the package.json file to work directory
COPY package.json .

# Install all Packages
RUN npm install

# Copy all other source code to work directory
ADD src /usr/src/app/src
ADD angular.json /usr/src/app
ADD browserslist /usr/src/app
ADD tsconfig.json /usr/src/app
ADD tsconfig.app.json /usr/src/app
ADD tsconfig.spec.json /usr/src/app
ADD tslint.json /usr/src/app

# TypeScript
RUN npm run build-prod

# Second stage: run configuration
FROM nginx:1.17-alpine

COPY default.conf /etc/nginx/conf.d

COPY --from=build /usr/src/app/dist/angular /usr/share/nginx/html

