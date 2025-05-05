import { ErrorType } from '../../../../src/domain/enums/error-type';
import { ProductNotFoundError } from '../../../../src/domain/errors';

describe('ProductNotFoundError', () => {
  it('should create an ProductNotFoundError with correct properties', () => {
    const error = new ProductNotFoundError();

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ProductNotFoundError);
    expect(error.name).toBe('ProductNotFoundError');
    expect(error.message).toBe('Product not found');
    expect(error.type).toBe(ErrorType.NOT_FOUND);
  });
});
