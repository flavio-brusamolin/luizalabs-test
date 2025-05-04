import { PublishCreatedCustomerQueue, PublishRemovedProductQueue, PublishStaleProductQueue } from '../../app/contracts/queue';
import { Customer } from '../../domain/entities/customer';
import { ProductId } from '../../domain/entities/product';
import { MessageQueueProvider } from './message-queue-provider';
import queues from './queues';

export class MessageQueueClient implements PublishStaleProductQueue, PublishRemovedProductQueue, PublishCreatedCustomerQueue {
  constructor(private readonly messageQueueProvider: MessageQueueProvider) {}

  publishCreatedCustomer(customer: Customer): void {
    const queue = queues.CREATED_CUSTOMER;
    this.messageQueueProvider.publish(queue, customer);
  }

  publishStaleProduct(productId: ProductId): void {
    const queue = queues.STALE_PRODUCT;
    this.messageQueueProvider.publish(queue, { productId });
  }

  publishRemovedProduct(productId: ProductId): void {
    const queue = queues.REMOVED_PRODUCT;
    this.messageQueueProvider.publish(queue, { productId });
  }
}
