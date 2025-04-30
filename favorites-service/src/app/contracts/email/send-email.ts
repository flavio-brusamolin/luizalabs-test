export interface EmailDetails {
  to: string;
  subject: string;
  html: string;
}

export interface SendEmail {
  send: (emailDetails: EmailDetails) => Promise<void>;
}
