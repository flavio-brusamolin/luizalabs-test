import { RequestHandler } from 'express';
import { HttpRequest } from '../../interfaces/http/contracts';
import { Middleware } from '../../interfaces/http/middlewares/middleware';

export const adaptMiddleware = (middleware: Middleware): RequestHandler => {
  return async (req, res, next) => {
    const httpRequest: HttpRequest = {
      body: req.body,
      headers: req.headers,
      params: req.params,
      query: req.query,
    };

    const { statusCode, body } = await middleware.handle(httpRequest);

    const isSuccessCode = statusCode >= 200 && statusCode < 300;
    if (isSuccessCode) {
      Object.assign(req, body);
      next();
    } else {
      res.status(statusCode).json(body);
    }
  };
};
