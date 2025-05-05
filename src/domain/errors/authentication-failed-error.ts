import { CustomError } from './custom-error';
import { ErrorType } from '../enums/error-type';

export class AuthenticationFailedError extends CustomError {
  type = ErrorType.AUTHENTICATION;

  constructor() {
    super('Authentication failed');
    this.name = 'AuthenticationFailedError';
  }
}
