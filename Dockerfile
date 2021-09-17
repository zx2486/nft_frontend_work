FROM node:16.6.1-alpine3.14

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY www/package*.json ./

RUN npm install
RUN npm install request --save
RUN npm install moment --save
RUN npm install dotenv --save
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY www .

EXPOSE 80
CMD [ "node", "server.js" ]
