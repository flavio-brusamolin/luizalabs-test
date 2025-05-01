import { FavoriteNotFoundError } from '../../domain/errors';
import { RemoveFavoriteInput, RemoveFavoriteUseCase } from '../../domain/use-cases/remove-favorite';
import { CheckFavoriteRepository, RemoveFavoriteRepository } from '../contracts/database';

export class RemoveFavoriteService implements RemoveFavoriteUseCase {
  constructor(
    private readonly checkFavoriteRepository: CheckFavoriteRepository,
    private readonly removeFavoriteRepository: RemoveFavoriteRepository
  ) {}

  async execute({ customerId, productId }: RemoveFavoriteInput): Promise<void> {
    const isFavorite = await this.checkFavoriteRepository.isFavorite(customerId, productId);
    if (!isFavorite) {
      console.error(`Favorite ${productId} not found for customer ${customerId}`);
      throw new FavoriteNotFoundError();
    }

    console.log(`Removing favorite ${productId} for customer ${customerId}`);
    await this.removeFavoriteRepository.removeFavorite(customerId, productId);
  }
}
