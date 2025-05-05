import { RemoveFavoriteService } from '../../../../src/app/services/remove-favorite-service';
import { FavoriteNotFoundError } from '../../../../src/domain/errors';
import { CheckFavoriteRepository, RemoveFavoriteRepository } from '../../../../src/app/contracts/database';

const makeFakeInput = () => ({
  customerId: 'valid_customer_id',
  productId: 'valid_product_id',
});

const makeCheckFavoriteRepository = (): CheckFavoriteRepository => {
  class CheckFavoriteRepositoryStub implements CheckFavoriteRepository {
    async isFavorite(_customerId: string, _productId: string): Promise<boolean> {
      return true;
    }
  }

  return new CheckFavoriteRepositoryStub();
};

const makeRemoveFavoriteRepository = (): RemoveFavoriteRepository => {
  class RemoveFavoriteRepositoryStub implements RemoveFavoriteRepository {
    async removeFavorite(_customerId: string, _productId: string): Promise<void> {}
  }

  return new RemoveFavoriteRepositoryStub();
};

interface SutTypes {
  removeFavoriteService: RemoveFavoriteService;
  checkFavoriteRepositoryStub: CheckFavoriteRepository;
  removeFavoriteRepositoryStub: RemoveFavoriteRepository;
}

const makeSut = (): SutTypes => {
  const checkFavoriteRepositoryStub = makeCheckFavoriteRepository();
  const removeFavoriteRepositoryStub = makeRemoveFavoriteRepository();

  const removeFavoriteService = new RemoveFavoriteService(checkFavoriteRepositoryStub, removeFavoriteRepositoryStub);

  return {
    removeFavoriteService,
    checkFavoriteRepositoryStub,
    removeFavoriteRepositoryStub,
  };
};

describe('RemoveFavoriteService', () => {
  describe('#execute', () => {
    it('should call CheckFavoriteRepository with correct values', async () => {
      const { removeFavoriteService, checkFavoriteRepositoryStub } = makeSut();
      const isFavoriteSpy = jest.spyOn(checkFavoriteRepositoryStub, 'isFavorite');

      const input = makeFakeInput();
      await removeFavoriteService.execute(input);

      expect(isFavoriteSpy).toHaveBeenCalledWith(input.customerId, input.productId);
    });

    it('should throw FavoriteNotFoundError if favorite does not exist', async () => {
      const { removeFavoriteService, checkFavoriteRepositoryStub } = makeSut();
      jest.spyOn(checkFavoriteRepositoryStub, 'isFavorite').mockResolvedValueOnce(false);

      const input = makeFakeInput();
      const promise = removeFavoriteService.execute(input);

      await expect(promise).rejects.toThrow(FavoriteNotFoundError);
    });

    it('should call RemoveFavoriteRepository with correct values', async () => {
      const { removeFavoriteService, removeFavoriteRepositoryStub } = makeSut();
      const removeFavoriteSpy = jest.spyOn(removeFavoriteRepositoryStub, 'removeFavorite');

      const input = makeFakeInput();
      await removeFavoriteService.execute(input);

      expect(removeFavoriteSpy).toHaveBeenCalledWith(input.customerId, input.productId);
    });
  });
});
