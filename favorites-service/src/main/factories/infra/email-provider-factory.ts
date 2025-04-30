import env from '../../config/env';
import { EmailProvider } from '../../../infra/email/email-provider';

export const buildEmailProvider = (): EmailProvider => {
  return new EmailProvider(env.smtpConfig);
};
