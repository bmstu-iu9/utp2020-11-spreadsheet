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
  databaseName: 'database.db',
  headerMatcher: {
    name: 'authorization',
    prefix: 'Token ',
  },
};
