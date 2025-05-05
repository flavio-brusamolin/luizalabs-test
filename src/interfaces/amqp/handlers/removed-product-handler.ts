import { ProductId } from '../../../domain/entities/product';
import { PurgeRemovedProductUseCase } from '../../../domain/use-cases/purge-removed-product';
import { Handler, Message } from './handler';

type RemovedProductContent = { productId: ProductId };

export class RemovedProductHandler implements Handler {
  constructor(private readonly purgeRemovedProductUseCase: PurgeRemovedProductUseCase) {}

  async handle(message: Message<RemovedProductContent>): Promise<void> {
    try {
      await this.purgeRemovedProductUseCase.execute(message.content);
    } catch (exception) {
      console.error(exception);
      throw exception;
    }
  }
}
