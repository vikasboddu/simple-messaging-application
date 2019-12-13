import { config } from 'dotenv';
import express from 'express';
import { Errback, Request, Response, NextFunction } from 'express';
import { PoolConfig } from 'mysql';
import { Context } from './Context';
import * as bodyParser from 'body-parser';
import thread from './routes/thread';

config();

const app = express();

const {
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  DB_CONNECTION_LIMIT,
} = process.env;

const mysqlConfig: PoolConfig = {
  connectionLimit: parseInt(DB_CONNECTION_LIMIT as string),
  host: DB_HOST,
  port: parseInt(DB_PORT as string),
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  charset: 'utf8mb4',
};

const context = new Context(mysqlConfig);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req: Request, _: Response, next: NextFunction) => {
  // @ts-ignore
  req['context'] = context;
  next();
});

app.use('/thread', thread);

app.use(function(err: Errback, req: Request, _: Response, next: NextFunction) {
  console.error(
    `Got error during request to URL [${req.method}] ${req.originalUrl}`
  );
  console.error(`Request body is ${JSON.stringify(req.body)}`);
  console.error(err);
  next(err);
});

// http server
const http = require('http');

const port = '8081';
app.set('port', port);

const server = http.createServer(app);
server.listen(port);

server.on('listening', () => {
  const addr = server.address();
  console.log(`Server is listening port ${addr.port}`);
});
