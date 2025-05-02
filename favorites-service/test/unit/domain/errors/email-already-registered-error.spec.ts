import { ErrorType } from '../../../../src/domain/enums/error-type';
import { EmailAlreadyRegisteredError } from '../../../../src/domain/errors';

describe('EmailAlreadyRegisteredError', () => {
  it('should create an EmailAlreadyRegisteredError with correct properties', () => {
    const error = new EmailAlreadyRegisteredError();

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(EmailAlreadyRegisteredError);
    expect(error.name).toBe('EmailAlreadyRegisteredError');
    expect(error.message).toBe('This email is already in use');
    expect(error.type).toBe(ErrorType.CONFLICT);
  });
});
