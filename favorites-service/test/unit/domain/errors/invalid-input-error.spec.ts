import { ErrorType } from '../../../../src/domain/enums/error-type';
import { InvalidInputError } from '../../../../src/domain/errors';

describe('InvalidInputError', () => {
  it('should create an InvalidInputError with correct properties', () => {
    const errorMessage = 'any_error_message';
    const error = new InvalidInputError(errorMessage);

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(InvalidInputError);
    expect(error.name).toBe('InvalidInputError');
    expect(error.message).toBe(errorMessage);
    expect(error.type).toBe(ErrorType.CONTRACT);
  });
});
