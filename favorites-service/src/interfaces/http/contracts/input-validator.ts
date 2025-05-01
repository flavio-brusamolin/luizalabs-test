import { HttpRequest } from './http-request';

export interface InputValidator {
  validate: (httpRequest: HttpRequest) => string;
}
