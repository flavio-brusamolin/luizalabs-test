import { AuthenticationFailedError } from '../../../../src/domain/errors/authentication-failed-error';
import { ErrorType } from '../../../../src/domain/enums/error-type';

describe('AuthenticationFailedError', () => {
  it('should create an AuthenticationFailedError with correct properties', () => {
    const error = new AuthenticationFailedError();

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(AuthenticationFailedError);
    expect(error.name).toBe('AuthenticationFailedError');
    expect(error.message).toBe('Authentication failed');
    expect(error.type).toBe(ErrorType.AUTHENTICATION);
  });
});
