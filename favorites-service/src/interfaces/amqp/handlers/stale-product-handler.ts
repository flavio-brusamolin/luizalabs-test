import { ProductId } from '../../../domain/entities/product';
import { UpdateStaleProductUseCase } from '../../../domain/use-cases/update-stale-product';
import { Handler, Message } from './handler';

type StaleProductContent = { productId: ProductId };

export class StaleProductHandler implements Handler {
  constructor(private readonly updateStaleProductUseCase: UpdateStaleProductUseCase) {}

  async handle(message: Message<StaleProductContent>): Promise<void> {
    try {
      await this.updateStaleProductUseCase.execute(message.content);
    } catch (exception) {
      console.error(exception);
      throw exception;
    }
  }
}
