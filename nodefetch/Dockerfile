FROM node:12-buster as build

# Create Directory for the Container
WORKDIR /usr/src/app

# Only copy the package.json file to work directory
COPY package.json .
# Install all Packages

RUN npm install

# Copy all other source code to work directory
ADD src /usr/src/app/src
ADD tsconfig.json /usr/src/app

# TypeScript
RUN npm run build

FROM node:12-buster-slim

# Create Directory for the Container
WORKDIR /usr/src/app

# Copy wait-for-it script
COPY wait-for-it.sh ./wait-for-it.sh

# Only copy the package.json file to work directory
COPY package.json .

# Install all Packages
RUN npm install --production

# Copy node modules to work directory
COPY --from=build /usr/src/app/node_modules ./node_modules

# Copy compiled output to work directory
COPY --from=build /usr/src/app/out ./out

# Start
CMD [ "./wait-for-it.sh" , "-h", "sync-service", "-p", "8080" , "--strict" , "--timeout=600" , "--", "npm", "start" ]