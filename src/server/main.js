import express, { static, favicon, logger, bodyParser, cookieParser, errorHandler as _errorHandler } from 'express';
import { createServer } from 'http';
import { join } from 'path';

const config = { port: 3000 };

const app = express();

app.set('view options', { layout: false });
app.use(static(`${__dirname}/template`));

app.use(favicon());

if (app.get('env') === 'development') {
  app.use(logger('dev'));
} else {
  app.use(logger('default'));
}

app.use(bodyParser());

app.use(cookieParser());

app.use(app.router);

app.get('/', (req, res) => {
  res.render('/index.html');
});

app.use(static(join(__dirname, 'public')));

app.use((err, req, res, next) => {
  // NODE_ENV = 'production'
  if (app.get('env') === 'development') {
    const errorHandler = _errorHandler();
    errorHandler(err, req, res, next);
  } else {
    res.send(500);
  }
});

createServer(app).listen(config.port, () => {});
