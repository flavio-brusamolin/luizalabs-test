import { created, ok, noContent, error } from '../../../../../src/interfaces/http/helpers/http-response-builder';
import { ErrorType } from '../../../../../src/domain/enums/error-type';
import { CustomError } from '../../../../../src/domain/errors/custom-error';

describe('HttpResponseBuilder', () => {
  describe('#created', () => {
    it('should return a 201 response with the provided data', () => {
      const data = { key: 'value' };
      const response = created(data);

      expect(response).toEqual({
        statusCode: 201,
        body: data,
      });
    });
  });

  describe('#ok', () => {
    it('should return a 200 response with the provided data', () => {
      const data = { key: 'value' };
      const response = ok(data);

      expect(response).toEqual({
        statusCode: 200,
        body: data,
      });
    });
  });

  describe('#noContent', () => {
    it('should return a 204 response with no body', () => {
      const response = noContent();

      expect(response).toEqual({
        statusCode: 204,
        body: null,
      });
    });
  });

  describe('#error', () => {
    it('should return a 400 response for a CONTRACT error', () => {
      class ContractError extends CustomError {
        type = ErrorType.CONTRACT;

        constructor(message: string) {
          super(message);
        }
      }

      const contractError = new ContractError('Invalid input');
      const response = error(contractError);

      expect(response).toEqual({
        statusCode: 400,
        body: { error: 'Invalid input' },
      });
    });

    it('should return a 401 response for an AUTHENTICATION error', () => {
      class AuthenticationError extends CustomError {
        type = ErrorType.AUTHENTICATION;

        constructor(message: string) {
          super(message);
        }
      }

      const authenticationError = new AuthenticationError('Authentication failed');
      const response = error(authenticationError);

      expect(response).toEqual({
        statusCode: 401,
        body: { error: 'Authentication failed' },
      });
    });

    it('should return a 404 response for a NOT_FOUND error', () => {
      class NotFoundError extends CustomError {
        type = ErrorType.NOT_FOUND;

        constructor(message: string) {
          super(message);
        }
      }

      const notFoundError = new NotFoundError('Resource not found');
      const response = error(notFoundError);

      expect(response).toEqual({
        statusCode: 404,
        body: { error: 'Resource not found' },
      });
    });

    it('should return a 409 response for a CONFLICT error', () => {
      class ConflictError extends CustomError {
        type = ErrorType.CONFLICT;

        constructor(message: string) {
          super(message);
        }
      }

      const conflictError = new ConflictError('Conflict occurred');
      const response = error(conflictError);

      expect(response).toEqual({
        statusCode: 409,
        body: { error: 'Conflict occurred' },
      });
    });

    it('should return a 500 response for an INTERNAL error', () => {
      class InternalError extends CustomError {
        type = ErrorType.INTERNAL;

        constructor(message: string) {
          super(message);
        }
      }

      const internalError = new InternalError('Unexpected error');
      const response = error(internalError);

      expect(response).toEqual({
        statusCode: 500,
        body: { error: 'Internal server error' },
      });
    });

    it('should return a default 500 response if error type is not provided', () => {
      const anyError = new Error('Any error');
      const response = error(anyError);

      expect(response).toEqual({
        statusCode: 500,
        body: { error: 'Internal server error' },
      });
    });
  });
});
