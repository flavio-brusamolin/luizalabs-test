import express, { Express, Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import { Controller } from '../../interfaces/http/controllers/controller';
import { Middleware } from '../../interfaces/http/middlewares/middleware';
import { Route } from './route';
import { adaptMiddleware } from './express-middleware-adapter';
import { adaptRoute } from './express-route-adapter';
import { buildOpenApiSpec } from './docs/openapi';

export class HttpServer {
  private app: Express;
  private router: Router;

  constructor() {
    this.app = express();
    this.app.use(express.json());
    this.router = Router();
    this.app.use('/api', this.router);
  }

  docs(routes: Route[]): void {
    const openApiSpec = buildOpenApiSpec(routes);
    this.router.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiSpec));
  }

  on(method: string, path: string, controller: Controller, middlewares: Middleware[] = []): void {
    const adaptedMiddlewares = middlewares.map(adaptMiddleware);
    const adaptedController = adaptRoute(controller);
    this.router[method](path, ...adaptedMiddlewares, adaptedController);
  }

  listen(port: number): void {
    this.app.listen(port, () => console.log(`Server is running at http://localhost:${port}`));
  }

  getApp(): Express {
    return this.app;
  }
}
