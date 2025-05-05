import { createTransport, createTestAccount, getTestMessageUrl, Transporter } from 'nodemailer';
import { EmailDetails, SendEmail } from '../../app/contracts/email';

interface SmtpConfig {
  host: string;
  port: number;
  auth: {
    user: string;
    pass: string;
  };
}

export class EmailProvider implements SendEmail {
  private static transporter: Transporter;

  constructor(private smtpConfig: SmtpConfig) {}

  private async init() {
    if (!this.smtpConfig.host) {
      const { smtp, user, pass } = await createTestAccount();

      this.smtpConfig = {
        host: smtp.host,
        port: smtp.port,
        auth: { user, pass },
      };
    }

    EmailProvider.transporter = createTransport(this.smtpConfig);
  }

  async send({ to, subject, html }: EmailDetails): Promise<void> {
    if (!EmailProvider.transporter) {
      await this.init();
    }

    const info = await EmailProvider.transporter.sendMail({
      to,
      subject,
      html,
    });

    const emailPreviewUrl = getTestMessageUrl(info);
    if (emailPreviewUrl) {
      console.log(`Email preview URL: ${emailPreviewUrl}`);
    }
  }
}
