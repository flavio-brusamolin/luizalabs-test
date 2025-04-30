import { MessageQueueClient } from '../../../infra/queue/message-queue-client';
import { AmqpProvider } from '../../../infra/queue/amqp-provider';

export const buildMessageQueueClient = (): MessageQueueClient => {
  return new MessageQueueClient(new AmqpProvider());
};
