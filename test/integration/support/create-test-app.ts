import { Express } from 'express';
import { HttpServer } from '../../../src/infra/server/http-server';
import { setupRoutes } from '../../../src/main/config/routes';

jest.mock('../../../src/infra/queue/amqp-provider', () => {
  return {
    AmqpProvider: class {
      async init(): Promise<void> {}
      subscribe(): void {}
      publish(): boolean {
        return true;
      }
    },
  };
});

export async function createTestApp(): Promise<Express> {
  const httpServer = new HttpServer();
  setupRoutes(httpServer);
  return httpServer.getApp();
}
