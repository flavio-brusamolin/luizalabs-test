import { CreatedCustomerHandler } from '../../../../../src/interfaces/amqp/handlers/created-customer-handler';
import { SendCustomerEmailUseCase } from '../../../../../src/domain/use-cases/send-customer-email';
import { Customer } from '../../../../../src/domain/entities/customer';
import { Message } from '../../../../../src/interfaces/amqp/handlers/handler';

const makeFakeMessage = (): Message<Customer> => ({
  content: new Customer({
    name: 'valid_name',
    email: 'valid_email@example.com',
  }),
});

const makeSendCustomerEmailUseCase = (): SendCustomerEmailUseCase => {
  class SendCustomerEmailUseCaseStub implements SendCustomerEmailUseCase {
    async execute(_customer: Customer): Promise<void> {}
  }

  return new SendCustomerEmailUseCaseStub();
};

interface SutTypes {
  createdCustomerHandler: CreatedCustomerHandler;
  sendCustomerEmailUseCaseStub: SendCustomerEmailUseCase;
}

const makeSut = (): SutTypes => {
  const sendCustomerEmailUseCaseStub = makeSendCustomerEmailUseCase();
  const createdCustomerHandler = new CreatedCustomerHandler(sendCustomerEmailUseCaseStub);

  return {
    createdCustomerHandler,
    sendCustomerEmailUseCaseStub,
  };
};

describe('CreatedCustomerHandler', () => {
  describe('#handle', () => {
    it('should call SendCustomerEmailUseCase with correct customer', async () => {
      const { createdCustomerHandler, sendCustomerEmailUseCaseStub } = makeSut();
      const executeSpy = jest.spyOn(sendCustomerEmailUseCaseStub, 'execute');

      const message = makeFakeMessage();
      await createdCustomerHandler.handle(message);

      expect(executeSpy).toHaveBeenCalledWith(message.content);
    });

    it('should throw if SendCustomerEmailUseCase throws', async () => {
      const { createdCustomerHandler, sendCustomerEmailUseCaseStub } = makeSut();

      const exception = new Error('any_error');
      jest.spyOn(sendCustomerEmailUseCaseStub, 'execute').mockRejectedValueOnce(exception);

      const message = makeFakeMessage();
      const promise = createdCustomerHandler.handle(message);

      await expect(promise).rejects.toThrow(exception);
    });
  });
});
