import express, { Request, Response, NextFunction } from 'express';
import { json } from 'body-parser';

export const testContextMiddleware = (context: any) => (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  // @ts-ignore
  req['context'] = context;
  next();
};

export const initializeApp = (context: any) => {
  const app = express();
  app.use(json());
  app.use(testContextMiddleware(context));
  return app;
};
