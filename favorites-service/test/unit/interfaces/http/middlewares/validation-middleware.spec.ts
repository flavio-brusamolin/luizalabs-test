import { ValidationMiddleware } from '../../../../../src/interfaces/http/middlewares/validation-middleware';
import { InputValidator, HttpRequest } from '../../../../../src/interfaces/http/contracts';
import { noContent, error } from '../../../../../src/interfaces/http/helpers/http-response-builder';
import { InvalidInputError } from '../../../../../src/domain/errors';

const makeFakeRequest = (): HttpRequest => ({
  body: { any_field: 'any_value' },
});

const makeInputValidator = (): InputValidator => {
  class InputValidatorStub implements InputValidator {
    validate(_input: HttpRequest): string {
      return null;
    }
  }

  return new InputValidatorStub();
};

interface SutTypes {
  validationMiddleware: ValidationMiddleware;
  inputValidatorStub: InputValidator;
}

const makeSut = (): SutTypes => {
  const inputValidatorStub = makeInputValidator();
  const validationMiddleware = new ValidationMiddleware(inputValidatorStub);

  return {
    validationMiddleware,
    inputValidatorStub,
  };
};

describe('ValidationMiddleware', () => {
  describe('#handle', () => {
    it('should call InputValidator with correct values', async () => {
      const { validationMiddleware, inputValidatorStub } = makeSut();
      const validateSpy = jest.spyOn(inputValidatorStub, 'validate');

      const httpRequest = makeFakeRequest();
      await validationMiddleware.handle(httpRequest);

      expect(validateSpy).toHaveBeenCalledWith(httpRequest);
    });

    it('should return 204 if validation succeeds', async () => {
      const { validationMiddleware } = makeSut();

      const httpRequest = makeFakeRequest();
      const httpResponse = await validationMiddleware.handle(httpRequest);

      expect(httpResponse).toEqual(noContent());
    });

    it('should return a InvalidInputError if validation fails', async () => {
      const { validationMiddleware, inputValidatorStub } = makeSut();

      jest.spyOn(inputValidatorStub, 'validate').mockReturnValueOnce('Invalid input');

      const httpRequest = makeFakeRequest();
      const httpResponse = await validationMiddleware.handle(httpRequest);

      expect(httpResponse).toEqual(error(new InvalidInputError('Invalid input')));
    });

    it('should return an error response if InputValidator throws', async () => {
      const { validationMiddleware, inputValidatorStub } = makeSut();

      const exception = new InvalidInputError('any_error');
      jest.spyOn(inputValidatorStub, 'validate').mockImplementationOnce(() => {
        throw exception;
      });

      const httpRequest = makeFakeRequest();
      const httpResponse = await validationMiddleware.handle(httpRequest);

      expect(httpResponse).toEqual(error(exception));
    });
  });
});
