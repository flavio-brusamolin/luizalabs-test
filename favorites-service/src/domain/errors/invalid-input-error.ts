import { CustomError } from './custom-error';
import { ErrorType } from '../enums/error-type';

export class InvalidInputError extends CustomError {
  type = ErrorType.CONTRACT;

  constructor(errorMessage: string) {
    super(errorMessage);
    this.name = 'InvalidInputError';
  }
}
