FROM node:14
COPY . project
WORKDIR project
RUN npm ci
RUN mkdir data
ENTRYPOINT ["npm", "run", "server"]
