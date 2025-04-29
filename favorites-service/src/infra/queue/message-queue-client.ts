import { PublishStaleProductQueue } from '../../app/contracts/queue';
import { ProductId } from '../../domain/entities/product';
import { AmqpProvider } from './amqp-provider';

export class MessageQueueClient implements PublishStaleProductQueue {
  constructor(private readonly amqpProvider: AmqpProvider) {}

  publishStaleProduct(productId: ProductId): void {
    const queue = 'stale-product-update';
    this.amqpProvider.publish(queue, { productId });
  }
}
