import { join } from 'path';
import { readFileSync } from 'fs';
import { Customer } from '../../domain/entities/customer';
import { SendCustomerEmailUseCase } from '../../domain/use-cases/send-customer-email';
import { EmailDetails, SendEmail } from '../contracts/email';

const emailPath = join(__dirname, '../templates/customer-email.html');
const emailContent = readFileSync(emailPath, 'utf8');

export class SendCustomerEmailService implements SendCustomerEmailUseCase {
  constructor(private readonly sendEmail: SendEmail) {}

  async execute({ name, email, apiKey, customerId }: Customer): Promise<void> {
    const formattedEmail = emailContent.replace('{{name}}', name).replace('{{apiKey}}', apiKey);

    const emailDetails: EmailDetails = {
      subject: 'Chave de acesso - Serviço de favoritos',
      to: email,
      html: formattedEmail,
    };

    console.log(`Sending email to customer ${customerId} at ${email}`);
    await this.sendEmail.send(emailDetails);
  }
}
