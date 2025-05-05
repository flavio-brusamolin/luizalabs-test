import { ErrorType } from '../../../../src/domain/enums/error-type';
import { CustomerNotFoundError } from '../../../../src/domain/errors';

describe('CustomerNotFoundError', () => {
  it('should create an CustomerNotFoundError with correct properties', () => {
    const error = new CustomerNotFoundError();

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(CustomerNotFoundError);
    expect(error.name).toBe('CustomerNotFoundError');
    expect(error.message).toBe('Customer not found');
    expect(error.type).toBe(ErrorType.NOT_FOUND);
  });
});
