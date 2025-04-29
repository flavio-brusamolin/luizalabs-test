import { CustomError } from './custom-error';
import { ErrorType } from '../enums/error-type';

export class FavoriteNotFoundError extends CustomError {
  type = ErrorType.NOT_FOUND;

  constructor() {
    super('Favorite not found');
    this.name = 'FavoriteNotFoundError';
  }
}
