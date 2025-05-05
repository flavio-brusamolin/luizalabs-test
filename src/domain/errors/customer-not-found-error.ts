import { CustomError } from './custom-error';
import { ErrorType } from '../enums/error-type';

export class CustomerNotFoundError extends CustomError {
  type = ErrorType.NOT_FOUND;

  constructor() {
    super('Customer not found');
    this.name = 'CustomerNotFoundError';
  }
}
