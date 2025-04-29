import { CustomError } from './custom-error';
import { ErrorType } from '../enums/error-type';

export class ExistingFavoriteError extends CustomError {
  type = ErrorType.CONFLICT;

  constructor() {
    super('This product has already been favorited');
    this.name = 'ExistingFavoriteError';
  }
}
