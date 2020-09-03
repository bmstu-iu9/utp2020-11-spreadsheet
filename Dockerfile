FROM node:14
COPY . /project
WORKDIR /project
RUN npm i
RUN npm run build
ENTRYPOINT ["npm", "run", "server"]
