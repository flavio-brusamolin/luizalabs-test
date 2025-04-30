import { Customer } from '../../../domain/entities/customer';
import { SendCustomerEmailUseCase } from '../../../domain/use-cases/send-customer-email';
import { Handler, Message } from './handler';

export class CreatedCustomerHandler implements Handler {
  constructor(private readonly sendCustomerEmailUseCase: SendCustomerEmailUseCase) {}

  async handle(message: Message<Customer>): Promise<void> {
    try {
      await this.sendCustomerEmailUseCase.execute(message.content);
    } catch (exception) {
      console.error(exception);
      throw exception;
    }
  }
}
