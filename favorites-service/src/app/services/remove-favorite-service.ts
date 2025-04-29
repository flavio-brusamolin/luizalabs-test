import { FavoriteNotFoundError } from '../../domain/errors';
import { RemoveFavoriteInput, RemoveFavoriteUseCase } from '../../domain/use-cases/remove-favorite';
import { CheckFavoriteRepository, RemoveFavoriteRepository } from '../contracts/database';

export class RemoveFavoriteService implements RemoveFavoriteUseCase {
  constructor(
    private readonly checkFavoriteRepository: CheckFavoriteRepository,
    private readonly removeFavoriteRepository: RemoveFavoriteRepository
  ) {}

  async execute({ customerId, productId }: RemoveFavoriteInput): Promise<void> {
    // validar existencia do customerId, aqui ou na autenticação

    const isFavorite = await this.checkFavoriteRepository.isFavorite(customerId, productId);
    if (!isFavorite) {
      throw new FavoriteNotFoundError();
    }

    await this.removeFavoriteRepository.removeFavorite(customerId, productId);
  }
}
