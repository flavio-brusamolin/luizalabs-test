import { PublishRemovedProductQueue, PublishStaleProductQueue } from '../../app/contracts/queue';
import { ProductId } from '../../domain/entities/product';
import { AmqpProvider } from './amqp-provider';
import queues from './queues';

export class MessageQueueClient implements PublishStaleProductQueue, PublishRemovedProductQueue {
  constructor(private readonly amqpProvider: AmqpProvider) {}

  publishStaleProduct(productId: ProductId): void {
    const queue = queues.STALE_PRODUCT;
    this.amqpProvider.publish(queue, { productId });
  }

  publishRemovedProduct(productId: ProductId): void {
    const queue = queues.REMOVED_PRODUCT;
    this.amqpProvider.publish(queue, { productId });
  }
}
