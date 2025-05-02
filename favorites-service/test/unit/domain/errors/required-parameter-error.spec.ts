import { ErrorType } from '../../../../src/domain/enums/error-type';
import { RequiredParameterError } from '../../../../src/domain/errors';

describe('RequiredParameterError', () => {
  it('should create an RequiredParameterError with correct properties', () => {
    const parameter = 'any_parameter';
    const error = new RequiredParameterError(parameter);

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(RequiredParameterError);
    expect(error.name).toBe('RequiredParameterError');
    expect(error.message).toBe(`The ${parameter} parameter is required`);
    expect(error.type).toBe(ErrorType.CONTRACT);
  });
});
