import { Handler } from '../../interfaces/amqp/handlers/handler';

export interface MessageQueueConfig {
  uri: string;
  dlqRetryInterval: number;
}

export interface MessageQueueProvider {
  init: (messageQueueConfig: MessageQueueConfig) => Promise<void>;
  publish: (queue: string, payload: any) => boolean;
  subscribe: (queue: string, handler: Handler) => any;
}
