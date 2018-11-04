/* eslint-disable no-param-reassign,no-console */
import createError from 'http-errors';
import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import mongoose from 'mongoose';
import cors from 'cors';
import * as http from 'http';
import passportManager from './config/passport';
import config from './config/db';
import configGlobal from './config/global';
import router from './router';

const app = express();

// mongoose setup
mongoose.Promise = Promise;
mongoose.connect(
  config.database,
  { useNewUrlParser: true },
);
mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${config.database}`);
});

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// // routes setup
// app.use('/',router);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  // return res.json({ 'invalid': 'json' });
  // res.render('error');
  return next();
});

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  next();
});

app.use(passportManager.initialize());

router(app);

const server = http.createServer(app);

const { port } = configGlobal;

server.listen(port, errListen => {
  if (errListen) throw errListen;
  console.log(`> Ready on http://localhost:${port}`);
});

// module.exports = {
//   app: server,
//   wss,
// };
//
export default server;
