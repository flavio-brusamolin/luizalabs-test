import { AmqpProvider } from '../../../../src/infra/queue/amqp-provider';
import queues from '../../../../src/infra/queue/queues';
import amqplib from 'amqplib';
import { Handler } from '../../../../src/interfaces/amqp/handlers/handler';

jest.mock('amqplib', () => {
  const assertQueueSpy = jest.fn();
  const sendToQueueSpy = jest.fn().mockReturnValueOnce(true);
  const consumeSpy = jest.fn();
  const ackSpy = jest.fn();
  const rejectSpy = jest.fn();

  const createChannelSpy = jest.fn().mockResolvedValueOnce({
    assertQueue: assertQueueSpy,
    sendToQueue: sendToQueueSpy,
    consume: consumeSpy,
    ack: ackSpy,
    reject: rejectSpy,
  });

  const connectSpy = jest.fn().mockResolvedValueOnce({
    createChannel: createChannelSpy,
  });

  return {
    connect: connectSpy,
    createChannelSpy: createChannelSpy,
    assertQueueSpy: assertQueueSpy,
    sendToQueueSpy: sendToQueueSpy,
    consumeSpy: consumeSpy,
    ackSpy: ackSpy,
    rejectSpy: rejectSpy,
  };
});

const makeSut = () => {
  const amqpProvider = new AmqpProvider();
  return {
    amqpProvider,
    connectSpy: (amqplib as any).connect,
    createChannelSpy: (amqplib as any).createChannelSpy,
    assertQueueSpy: (amqplib as any).assertQueueSpy,
    sendToQueueSpy: (amqplib as any).sendToQueueSpy,
    consumeSpy: (amqplib as any).consumeSpy,
    ackSpy: (amqplib as any).ackSpy,
    rejectSpy: (amqplib as any).rejectSpy,
  };
};

describe('AmqpProvider', () => {
  describe('#init', () => {
    it('should establish connection', async () => {
      const { amqpProvider, connectSpy } = makeSut();

      const messageQueueConfig = { uri: 'amqp://any-url', dlqRetryInterval: 5000 };
      await amqpProvider.init(messageQueueConfig);

      expect(connectSpy).toHaveBeenCalledWith(messageQueueConfig.uri);
    });

    it('should create channel', async () => {
      const { amqpProvider, createChannelSpy } = makeSut();

      const messageQueueConfig = { uri: 'amqp://any-url', dlqRetryInterval: 5000 };
      await amqpProvider.init(messageQueueConfig);

      expect(createChannelSpy).toHaveBeenCalledTimes(1);
    });

    it('should assert queues', async () => {
      const { amqpProvider, assertQueueSpy } = makeSut();

      const messageQueueConfig = { uri: 'amqp://any-url', dlqRetryInterval: 5000 };
      await amqpProvider.init(messageQueueConfig);

      for (const queue of Object.values(queues)) {
        const deadLetterQueue = `${queue}-dlq`;

        expect(assertQueueSpy).toHaveBeenCalledWith(deadLetterQueue, {
          durable: true,
          deadLetterExchange: '',
          deadLetterRoutingKey: queue,
          messageTtl: messageQueueConfig.dlqRetryInterval,
        });

        expect(assertQueueSpy).toHaveBeenCalledWith(queue, {
          durable: true,
          deadLetterExchange: '',
          deadLetterRoutingKey: deadLetterQueue,
        });
      }
    });
  });

  describe('#publish', () => {
    it('should call channel#sendToQueue with correct values', async () => {
      const { amqpProvider, sendToQueueSpy } = makeSut();

      const messageQueueConfig = { uri: 'amqp://any-url', dlqRetryInterval: 5000 };
      await amqpProvider.init(messageQueueConfig);

      const queue = 'any_queue';
      const payload = { key: 'value' };
      amqpProvider.publish(queue, payload);

      const payloadBuffer = Buffer.from(JSON.stringify(payload));
      expect(sendToQueueSpy).toHaveBeenCalledWith(queue, payloadBuffer, { persistent: true });
    });
  });

  describe('#subscribe', () => {
    it('should call channel#consume with correct values', async () => {
      const { amqpProvider, consumeSpy } = makeSut();

      const messageQueueConfig = { uri: 'amqp://any-url', dlqRetryInterval: 5000 };
      await amqpProvider.init(messageQueueConfig);

      const queue = 'any_queue';
      const handler = { handle: async () => {} };
      amqpProvider.subscribe(queue, handler);

      expect(consumeSpy).toHaveBeenCalledWith(queue, expect.any(Function));
    });

    it('should call handler#handle and channel#ack on successful message processing', async () => {
      const { amqpProvider, consumeSpy, ackSpy } = makeSut();

      const messageQueueConfig = { uri: 'amqp://any-url', dlqRetryInterval: 5000 };
      await amqpProvider.init(messageQueueConfig);

      let capturedMessage: Function;
      consumeSpy.mockImplementationOnce((_queue: string, onMessage: Function) => (capturedMessage = onMessage));

      const queue = 'any_queue';
      const handler = { handle: jest.fn() };
      amqpProvider.subscribe(queue, handler);

      const message = { content: Buffer.from(JSON.stringify({ key: 'value' })) };
      await capturedMessage(message);

      expect(handler.handle).toHaveBeenCalledWith({ content: { key: 'value' } });
      expect(ackSpy).toHaveBeenCalledWith(message);
    });

    it('should call channel#reject on handler error', async () => {
      const { amqpProvider, consumeSpy, rejectSpy } = makeSut();

      const messageQueueConfig = { uri: 'amqp://any-url', dlqRetryInterval: 5000 };
      await amqpProvider.init(messageQueueConfig);

      const message = { content: Buffer.from(JSON.stringify({ key: 'value' })) };
      consumeSpy.mockImplementationOnce((_queue: string, onMessage: Function) => onMessage(message));

      const queue = 'any_queue';
      const handler = {
        handle: () => {
          throw new Error('Handler error');
        },
      };
      amqpProvider.subscribe(queue, handler);

      expect(rejectSpy).toHaveBeenCalledWith(message, false);
    });
  });
});
