const express = require('express');
const http = require('http');
const path = require('path');
const config = require('./config');
const log = require('./log')(module);

const app = express();
app.set('views', `${__dirname}/template`);
app.set('view engine', 'ejs');

app.use(express.favicon()); // /favicon.ico
if (app.get('env') === 'development') {
  app.use(express.logger('dev'));
} else {
  app.use(express.logger('default'));
}

app.use(express.bodyParser()); // req.body....

app.use(express.cookieParser()); // req.cookies

app.use(app.router);

app.get('/', (req, res) => {
  res.render('index', {
    body: '<b>Hello</b>',
  });
});

app.get('/minecraft', (req, res) => {
  res.render('index', {
    body: '<b>МАЙНКРААААФТ</b>',
  });
});

app.use(express.static(path.join(__dirname, 'public')));

app.use((err, req, res, next) => {
  // NODE_ENV = 'production'
  if (app.get('env') === 'development') {
    const errorHandler = express.errorHandler();
    errorHandler(err, req, res, next);
  } else {
    res.send(500);
  }
});
/*
var routes = require('./routes');
var user = require('./routes/user');
// all environments
app.get('/', routes.index);
app.get('/users', user.list);
*/

http.createServer(app).listen(config.get('port'), () => {
  log.info(`Express server listening on port ${config.get('port')}`);
});
