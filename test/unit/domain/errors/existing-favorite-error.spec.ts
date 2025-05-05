import { ErrorType } from '../../../../src/domain/enums/error-type';
import { ExistingFavoriteError } from '../../../../src/domain/errors';

describe('ExistingFavoriteError', () => {
  it('should create an ExistingFavoriteError with correct properties', () => {
    const error = new ExistingFavoriteError();

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ExistingFavoriteError);
    expect(error.name).toBe('ExistingFavoriteError');
    expect(error.message).toBe('This product has already been favorited');
    expect(error.type).toBe(ErrorType.CONFLICT);
  });
});
