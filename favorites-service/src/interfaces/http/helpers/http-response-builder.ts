import { ErrorType } from '../../../domain/enums/error-type';
import { CustomError } from '../../../domain/errors/custom-error';
import { ErrorResponse, HttpResponse } from '../contracts';

export const created = <T>(data: T): HttpResponse<T> => ({
  statusCode: 201,
  body: data,
});

// export const ok = <T>(data: T): HttpResponse<T> => ({
//   statusCode: 200,
//   body: data,
// });

export const error = (error: CustomError): HttpResponse<ErrorResponse> => ({
  statusCode: mapStatusCode(error),
  body: mapMessage(error),
});

const mapStatusCode = ({ type = ErrorType.INTERNAL }: CustomError): number => {
  const errors = {
    // [ErrorType.CONTRACT]: 400,
    // [ErrorType.AUTHENTICATION]: 401,
    [ErrorType.NOT_FOUND]: 404,
    [ErrorType.CONFLICT]: 409,
    // [ErrorType.BUSINESS]: 422,
    [ErrorType.INTERNAL]: 500,
  };

  return errors[type] ?? errors[ErrorType.INTERNAL];
};

const mapMessage = ({ type = ErrorType.INTERNAL, message }: CustomError): ErrorResponse => {
  if (type === ErrorType.INTERNAL) {
    return { error: 'Internal server error' };
  }

  return { error: message };
};
