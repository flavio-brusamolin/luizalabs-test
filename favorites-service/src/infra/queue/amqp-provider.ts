import { connect, ChannelModel, Channel, Replies } from 'amqplib';
import { Handler } from '../../interfaces/amqp/handlers/handler';
import queues from './queues';

interface Config {
  uri: string;
  dlqRetryInterval: number;
}

export class AmqpProvider {
  private static connection: ChannelModel;
  private static channel: Channel;

  public async init({ uri, dlqRetryInterval }: Config): Promise<void> {
    await this.establishConnection(uri);
    await this.createChannel();
    await this.assertQueues(dlqRetryInterval);
  }

  public publish<T>(queue: string, payload: T): boolean {
    const payloadBuffer = Buffer.from(JSON.stringify(payload));
    return AmqpProvider.channel.sendToQueue(queue, payloadBuffer, { persistent: true });
  }

  public subscribe(queue: string, handler: Handler): Promise<Replies.Consume> {
    return AmqpProvider.channel.consume(queue, async (message) => {
      try {
        await handler.handle({ content: JSON.parse(message.content.toString()) });
        AmqpProvider.channel.ack(message);
      } catch (error) {
        AmqpProvider.channel.reject(message, false);
      }
    });
  }

  private async establishConnection(uri: string): Promise<void> {
    if (!AmqpProvider.connection) {
      AmqpProvider.connection = await connect(uri);
    }
  }

  private async createChannel(): Promise<void> {
    if (!AmqpProvider.channel) {
      AmqpProvider.channel = await AmqpProvider.connection.createChannel();
    }
  }

  private async assertQueues(dlqRetryInterval: number): Promise<void> {
    for (const queue of Object.values(queues)) {
      const deadLetterQueue = `${queue}-dlq`;

      await AmqpProvider.channel.assertQueue(deadLetterQueue, {
        durable: true,
        deadLetterExchange: '',
        deadLetterRoutingKey: queue,
        messageTtl: dlqRetryInterval,
      });

      await AmqpProvider.channel.assertQueue(queue, {
        durable: true,
        deadLetterExchange: '',
        deadLetterRoutingKey: deadLetterQueue,
      });
    }
  }
}
