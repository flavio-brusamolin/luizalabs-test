import { CustomError } from './custom-error';
import { ErrorType } from '../enums/error-type';

export class RequiredParameterError extends CustomError {
  type = ErrorType.CONTRACT;

  constructor(parameter: string) {
    super(`The ${parameter} parameter is required`);
    this.name = 'RequiredParameterError';
  }
}
