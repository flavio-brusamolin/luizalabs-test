import { MessageQueueClient } from '../../../../src/infra/queue/message-queue-client';
import { MessageQueueConfig, MessageQueueProvider } from '../../../../src/infra/queue/message-queue-provider';
import { Customer } from '../../../../src/domain/entities/customer';
import { Handler } from '../../../../src/interfaces/amqp/handlers/handler';
import queues from '../../../../src/infra/queue/queues';

const makeMessageQueueProvider = (): MessageQueueProvider => {
  class MessageQueueProviderStub implements MessageQueueProvider {
    async init(_messageQueueConfig: MessageQueueConfig): Promise<void> {}
    subscribe(_queue: string, _handler: Handler): any {}
    publish(_queue: string, _payload: any): boolean {
      return true;
    }
  }

  return new MessageQueueProviderStub();
};

interface SutTypes {
  messageQueueClient: MessageQueueClient;
  messageQueueProviderStub: MessageQueueProvider;
}

const makeSut = (): SutTypes => {
  const messageQueueProviderStub = makeMessageQueueProvider();
  const messageQueueClient = new MessageQueueClient(messageQueueProviderStub);

  return { messageQueueClient, messageQueueProviderStub };
};

describe('MessageQueueClient', () => {
  describe('#publishCreatedCustomer', () => {
    it('should call MessageQueueProvider#publish with correct values', () => {
      const { messageQueueClient, messageQueueProviderStub } = makeSut();
      const publishSpy = jest.spyOn(messageQueueProviderStub, 'publish');

      const customer = new Customer({ name: 'any_name', email: 'any_email' });
      messageQueueClient.publishCreatedCustomer(customer);

      expect(publishSpy).toHaveBeenCalledWith(queues.CREATED_CUSTOMER, customer);
    });
  });

  describe('#publishStaleProduct', () => {
    it('should call MessageQueueProvider#publish with correct values', () => {
      const { messageQueueClient, messageQueueProviderStub } = makeSut();
      const publishSpy = jest.spyOn(messageQueueProviderStub, 'publish');

      const productId = 'valid_product_id';
      messageQueueClient.publishStaleProduct(productId);

      expect(publishSpy).toHaveBeenCalledWith(queues.STALE_PRODUCT, { productId });
    });
  });

  describe('#publishRemovedProduct', () => {
    it('should call MessageQueueProvider#publish with correct values', () => {
      const { messageQueueClient, messageQueueProviderStub } = makeSut();
      const publishSpy = jest.spyOn(messageQueueProviderStub, 'publish');

      const productId = 'valid_product_id';
      messageQueueClient.publishRemovedProduct(productId);

      expect(publishSpy).toHaveBeenCalledWith(queues.REMOVED_PRODUCT, { productId });
    });
  });
});
