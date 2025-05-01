import { RequestHandler } from 'express';
import { HttpRequest } from '../../interfaces/http/contracts';
import { Middleware } from '../../interfaces/http/middlewares/middleware';

export const adaptMiddleware = (middleware: Middleware): RequestHandler => {
  return async (req, res, next) => {
    const httpRequest: HttpRequest = {
      headers: req.headers,
    };

    const { statusCode, body } = await middleware.handle(httpRequest);

    if (statusCode === 200) {
      Object.assign(req, body);
      next();
    } else {
      res.status(statusCode).json(body);
    }
  };
};
