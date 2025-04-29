import { connect, ChannelModel, Channel, Replies } from 'amqplib';
// import { AsyncHandler } from '../../../presentation/protocols/async-handler';

export class AmqpProvider {
  private static connection: ChannelModel;
  private static channel: Channel;

  public async init(uri: string, queues: string[]): Promise<void> {
    await this.establishConnection(uri);
    await this.createChannel();
    await this.assertQueues(queues);
  }

  public publish<T>(queue: string, payload: T): boolean {
    const payloadBuffer = Buffer.from(JSON.stringify(payload));
    return AmqpProvider.channel.sendToQueue(queue, payloadBuffer, { persistent: true });
  }

  public subscribe(queue: string, asyncHandler: any): Promise<Replies.Consume> {
    return AmqpProvider.channel.consume(queue, async (message) => {
      try {
        await asyncHandler.handle({ content: JSON.parse(message.content.toString()) });
        AmqpProvider.channel.ack(message);
      } catch (error) {
        console.error(error);
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

  private async assertQueues(queues: string[]): Promise<void> {
    for (const queue of queues) {
      await AmqpProvider.channel.assertQueue(queue, { durable: true });
    }
  }
}
