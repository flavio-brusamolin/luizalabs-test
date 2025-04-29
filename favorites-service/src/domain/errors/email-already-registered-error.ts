import { CustomError } from './custom-error';
import { ErrorType } from '../enums/error-type';

export class EmailAlreadyRegisteredError extends CustomError {
  type = ErrorType.CONFLICT;

  constructor() {
    super('This email is already in use');
    this.name = 'EmailAlreadyRegisteredError';
  }
}
