import { ErrorType } from '../../../../src/domain/enums/error-type';
import { FavoriteNotFoundError } from '../../../../src/domain/errors';

describe('FavoriteNotFoundError', () => {
  it('should create an FavoriteNotFoundError with correct properties', () => {
    const error = new FavoriteNotFoundError();

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(FavoriteNotFoundError);
    expect(error.name).toBe('FavoriteNotFoundError');
    expect(error.message).toBe('Favorite not found');
    expect(error.type).toBe(ErrorType.NOT_FOUND);
  });
});
