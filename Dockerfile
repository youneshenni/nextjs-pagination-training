FROM node:14-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

USER node

RUN npm install

COPY --chown=node:node . .

ARG jwt_pass

USER root

RUN apk update 
# && apk add --no-cache openssl && openssl genrsa -out ./server/keys/jwt.key -aes128 -passout pass:${jwt_pass} && openssl rsa -in ./server/keys/jwt.key -passin pass:${jwt_pass} -pubout > ./server/keys/jwt.pub

USER node

RUN npm run build

RUN rm .env

RUN cp -r ./server/keys ./dist/server/keys


EXPOSE 3000

CMD [ "npm", "run", "start" ]
