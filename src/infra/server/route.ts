import { Controller } from '../../interfaces/http/controllers/controller';
import { RequestSchema } from '../validation/request-schema';

interface Responses {
  [statusCode: number]: {
    description: string;
  };
}

export interface Route {
  method: string;
  path: string;
  controller: Controller;
  schema?: RequestSchema;
  auth: boolean;
  summary: string;
  tag?: string;
  responses?: Responses;
}
