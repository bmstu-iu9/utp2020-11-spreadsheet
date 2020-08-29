FROM node:14
COPY . project
WORKDIR project
RUN npm ci
RUN npm run build
RUN mkdir data
ENTRYPOINT ["npm", "run", "server"]
