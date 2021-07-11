###################
### Build image ###
###################

FROM node:14 as build

# Install build dependencies for underlying OS
RUN apt-get update && apt-get install -y g++ build-essential

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install --no-audit

# Bundle app source
COPY . .

#####################
### Runtime image ###
#####################

FROM node:14-slim

# Update packages
RUN apt-get update

# Create app directory
WORKDIR /usr/src/app

# Copy the required files from the build step
COPY --from=build /usr/src/app/server.js ./server.js
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/docs ./docs

# Print Node.js version
RUN node --version

# Set container exposed port
EXPOSE 8080

CMD [ "node", "server.js" ]
