FROM node:alpine

RUN mkdir -p /usr/src/dolph-frontend

WORKDIR /usr/src/dolph-frontend

ARG NODE_ENV=production

ENV NODE_ENV=${NODE_ENV}

COPY package.json ./
COPY yarn.lock ./

RUN npm install --legacy-peer-deps --include=dev && npx husky install

COPY . /usr/src/dolph-frontend

RUN npm run build

EXPOSE 4200

CMD [ "npm", "start" ]
