import { ErrorType } from '../enums/error-type';

export class CustomError extends Error {
  type: ErrorType;
}
