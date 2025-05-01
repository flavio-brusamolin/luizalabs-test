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

  on(method: string, path: string, controller: Controller, middleware?: Middleware): void {
    if (middleware) {
      this.router[method](path, adaptMiddleware(middleware), adaptRoute(controller));
    }

    this.router[method](path, adaptRoute(controller));
  }

  listen(port: number): void {
    this.app.listen(port, () => console.log(`Server is running at http://localhost:${port}`));
  }
}
