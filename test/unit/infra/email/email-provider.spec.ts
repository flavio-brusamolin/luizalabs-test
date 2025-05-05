import { EmailProvider } from '../../../../src/infra/email/email-provider';
import { EmailDetails } from '../../../../src/app/contracts/email';
import nodemailer from 'nodemailer';

interface TestAccount {
  smtp: {
    host: string;
    port: number;
  };
  user: string;
  pass: string;
}

interface Transporter {
  sendMail: () => Promise<{ messageId: string }>;
}

jest.mock('nodemailer', () => ({
  async createTestAccount(): Promise<TestAccount> {
    return {
      smtp: {
        host: 'smtp.test.account.com',
        port: 100,
      },
      user: 'testuser',
      pass: 'testpass',
    };
  },

  createTransport(): Transporter {
    return {
      async sendMail() {
        return {
          messageId: '123',
        };
      },
    };
  },

  getTestMessageUrl(): string {
    return 'http://test-preview-url';
  },
}));

const makeFakeEmailDetails = (): EmailDetails => ({
  to: 'recipient@example.com',
  subject: 'Test Email',
  html: '<p>This is a test email</p>',
});

const makeSut = (withSmtpHost: boolean = true) => {
  const smtpConfig = {
    host: withSmtpHost ? 'smtp.example.com' : undefined,
    port: 587,
    auth: {
      user: 'user@example.com',
      pass: 'password',
    },
  };
  const emailProvider = new EmailProvider(smtpConfig);
  return { emailProvider, smtpConfig };
};

describe('EmailProvider', () => {
  beforeEach(() => {
    (EmailProvider as any).transporter = undefined;
  });

  describe('#send', () => {
    it('should initialize transporter if not already initialized', async () => {
      const { emailProvider, smtpConfig } = makeSut();
      const createTransportSpy = jest.spyOn(nodemailer, 'createTransport');

      const emailDetails = makeFakeEmailDetails();
      await emailProvider.send(emailDetails);

      expect(createTransportSpy).toHaveBeenCalledWith(smtpConfig);
    });

    it('should use test account to initialize transporter if no SMTP config is provided', async () => {
      const { emailProvider } = makeSut(false);
      const createTestAccountSpy = jest.spyOn(nodemailer, 'createTestAccount');
      const createTransportSpy = jest.spyOn(nodemailer, 'createTransport');

      const emailDetails = makeFakeEmailDetails();
      await emailProvider.send(emailDetails);

      expect(createTestAccountSpy).toHaveBeenCalled();
      expect(createTransportSpy).toHaveBeenCalledWith({
        host: 'smtp.test.account.com',
        port: 100,
        auth: {
          user: 'testuser',
          pass: 'testpass',
        },
      });
    });

    it('should call transporter#sendMail with correct values', async () => {
      const { emailProvider } = makeSut();

      const sendMailSpy = jest.fn();
      (nodemailer.createTransport as jest.Mock).mockReturnValue({ sendMail: sendMailSpy });

      const emailDetails = makeFakeEmailDetails();
      await emailProvider.send(emailDetails);

      expect(sendMailSpy).toHaveBeenCalledWith({
        to: emailDetails.to,
        subject: emailDetails.subject,
        html: emailDetails.html,
      });
    });

    it('should log the email preview URL if available', async () => {
      const { emailProvider } = makeSut();
      const consoleLogSpy = jest.spyOn(console, 'log');

      const emailDetails = makeFakeEmailDetails();
      await emailProvider.send(emailDetails);

      expect(consoleLogSpy).toHaveBeenCalledWith('Email preview URL: http://test-preview-url');
    });
  });
});
