import express, { Express, Router } from 'express';
import { Controller } from '../../interfaces/http/controllers/controller';
import { adaptRoute } from './express-route-adapter';
import { Middleware } from '../../interfaces/http/middlewares/middleware';
import { adaptMiddleware } from './express-middleware-adapter';

export class HttpServer {
  private app: Express;
  private router: Router;

  constructor() {
    this.app = express();
    this.app.use(express.json());
    this.router = Router();
    this.app.use('/api', this.router);
  }

  on(method: string, path: string, controller: Controller, middlewares: Middleware[] = []): void {
    const adaptedMiddlewares = middlewares.map(adaptMiddleware);
    const adaptedController = adaptRoute(controller);
    this.router[method](path, ...adaptedMiddlewares, adaptedController);
  }

  listen(port: number): void {
    this.app.listen(port, () => console.log(`Server is running at http://localhost:${port}`));
  }
}
