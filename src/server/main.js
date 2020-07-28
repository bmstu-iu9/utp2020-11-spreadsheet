import express from 'express';
import http from 'http';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import favicon from 'serve-favicon';
import bodyParser from 'body-parser';
import errorHandler from 'errorhandler';

const app = express();

app.set('port', 3000);

app.set('view options', { layout: false });

app.use(favicon('src/client/styles/img/favicon.ico'));

if (app.get('env') === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('short'));
}

app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('src/client'));

app.get('/', (req, res) => {
  res.render('/index.html');
});

app.use(errorHandler());

http.createServer(app).listen(app.get('port'), () => {});
