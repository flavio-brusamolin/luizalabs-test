import { RequestHandler, Request, Response } from 'express';
import { Controller } from '../../interfaces/http/controllers/controller';
import { HttpRequest } from '../../interfaces/http/contracts';

export const adaptRoute = (controller: Controller): RequestHandler => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body,
      headers: req.headers,
      params: req.params,
      query: req.query,
    };

    const { statusCode, body } = await controller.handle(httpRequest);
    res.status(statusCode).json(body);
  };
};
