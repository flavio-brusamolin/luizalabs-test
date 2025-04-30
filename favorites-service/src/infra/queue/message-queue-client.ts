import { PublishCreatedCustomerQueue, PublishRemovedProductQueue, PublishStaleProductQueue } from '../../app/contracts/queue';
import { Customer } from '../../domain/entities/customer';
import { ProductId } from '../../domain/entities/product';
import { AmqpProvider } from './amqp-provider';
import queues from './queues';

export class MessageQueueClient implements PublishStaleProductQueue, PublishRemovedProductQueue, PublishCreatedCustomerQueue {
  constructor(private readonly amqpProvider: AmqpProvider) {}

  publishCreatedCustomer(customer: Customer): void {
    const queue = queues.CREATED_CUSTOMER;
    this.amqpProvider.publish(queue, customer);
  }

  publishStaleProduct(productId: ProductId): void {
    const queue = queues.STALE_PRODUCT;
    this.amqpProvider.publish(queue, { productId });
  }

  publishRemovedProduct(productId: ProductId): void {
    const queue = queues.REMOVED_PRODUCT;
    this.amqpProvider.publish(queue, { productId });
  }
}
