import queues from '../../infra/queue/queues';
import { AmqpProvider } from '../../infra/queue/amqp-provider';
import { buildCreatedCustomerHandler, buildRemovedProductHandler, buildStaleProductHandler } from '../factories/handlers';

export const setupQueues = (amqpProvider: AmqpProvider): void => {
  amqpProvider.subscribe(queues.STALE_PRODUCT, buildStaleProductHandler());
  amqpProvider.subscribe(queues.REMOVED_PRODUCT, buildRemovedProductHandler());
  amqpProvider.subscribe(queues.CREATED_CUSTOMER, buildCreatedCustomerHandler());
};
