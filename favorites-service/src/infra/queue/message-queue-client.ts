import { PublishRemovedProductQueue, PublishStaleProductQueue } from '../../app/contracts/queue';
import { ProductId } from '../../domain/entities/product';
import { AmqpProvider } from './amqp-provider';

export class MessageQueueClient implements PublishStaleProductQueue, PublishRemovedProductQueue {
  constructor(private readonly amqpProvider: AmqpProvider) {}

  publishStaleProduct(productId: ProductId): void {
    const queue = 'stale-product';
    this.amqpProvider.publish(queue, { productId });
  }

  publishRemovedProduct(productId: ProductId): void {
    const queue = 'removed-product';
    this.amqpProvider.publish(queue, { productId });
  }
}
