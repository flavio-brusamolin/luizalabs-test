import { CustomError } from './custom-error';
import { ErrorType } from '../enums/error-type';

export class ProductNotFoundError extends CustomError {
  type = ErrorType.NOT_FOUND;

  constructor() {
    super('Product not found');
    this.name = 'ProductNotFoundError';
  }
}
