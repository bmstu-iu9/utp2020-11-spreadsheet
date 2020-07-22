import express from 'express';
import http from 'http';

const config = { port: 3000 };

const app = express();

app.set('view options', { layout: false });
app.use(express.static('src/client'));

app.use(express.favicon());

if (app.get('env') === 'development') {
  app.use(express.logger('dev'));
} else {
  app.use(express.logger('default'));
}

app.use(express.bodyParser());

app.use(express.cookieParser());

app.use(app.router);

app.get('/', (req, res) => {
  res.render('/index.html');
});

app.use((err, req, res, next) => {
  // NODE_ENV = 'production'
  if (app.get('env') === 'development') {
    const errorHandler = express.errorHandler();
    errorHandler(err, req, res, next);
  } else {
    res.send(500);
  }
});

http.createServer(app).listen(config.port, () => {});
