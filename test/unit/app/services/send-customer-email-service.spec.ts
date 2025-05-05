import { SendCustomerEmailService } from '../../../../src/app/services/send-customer-email-service';
import { SendEmail, EmailDetails } from '../../../../src/app/contracts/email';
import { Customer } from '../../../../src/domain/entities/customer';

const makeFakeCustomer = (): Customer => {
  return new Customer({
    customerId: 'any_id',
    name: 'any_name',
    email: 'any_email',
    apiKey: 'any_api_key',
    favorites: [],
  });
};

const makeSendEmail = (): SendEmail => {
  class SendEmailStub implements SendEmail {
    async send(_emailDetails: EmailDetails): Promise<void> {}
  }

  return new SendEmailStub();
};

interface SutTypes {
  sendCustomerEmailService: SendCustomerEmailService;
  sendEmailStub: SendEmail;
}

const makeSut = (): SutTypes => {
  const sendEmailStub = makeSendEmail();
  const sendCustomerEmailService = new SendCustomerEmailService(sendEmailStub);

  return {
    sendCustomerEmailService,
    sendEmailStub,
  };
};

describe('SendCustomerEmailService', () => {
  describe('#execute', () => {
    it('should call SendEmail with correct values', async () => {
      const { sendCustomerEmailService, sendEmailStub } = makeSut();
      const sendEmailSpy = jest.spyOn(sendEmailStub, 'send');

      const customer = makeFakeCustomer();
      await sendCustomerEmailService.execute(customer);

      const expectedEmailDetails: EmailDetails = {
        subject: 'Chave de acesso - Serviço de favoritos',
        to: customer.email,
        html: expect.stringContaining(customer.name) && expect.stringContaining(customer.apiKey),
      };

      expect(sendEmailSpy).toHaveBeenCalledWith(expectedEmailDetails);
    });
  });
});
