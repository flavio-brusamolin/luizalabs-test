import { ErrorType } from '../enums/error-type';

export abstract class CustomError extends Error {
  abstract type: ErrorType;
}
