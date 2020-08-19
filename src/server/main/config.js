export default {
  port: 3000,
  viewOptions: {
    layout: false,
  },
  favicon: 'src/client/img/logo.png',
  urlencoded: {
    extended: true,
  },
  static: 'src/client',
  entrypoint: '/index.html',
  dataPath: 'data',
  env: 'development',
  databaseName: 'database.db',
  pathToWorkbooks: 'data/workbooks',
  pathToCommits: 'data/commits',
  headerMatcher: {
    name: 'authorization',
    prefix: 'Token ',
  },
};
