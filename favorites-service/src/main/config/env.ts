import 'dotenv/config';

export default {
  serverConfig: {
    port: Number(process.env.SERVER_PORT || 8080),
  },
  integrationConfig: {
    productApiUrl: process.env.PRODUCT_API_URL || 'http://localhost:8081',
  },
  cacheConfig: {
    staleTime: Number(process.env.CACHE_STALE_TIME || 10000),
  },
  amqpConfig: {
    uri: process.env.RABBITMQ_URL || 'amqp://admin:admin@localhost:5672',
    dlqRetryInterval: Number(process.env.DLQ_RETRY_INTERVAL || 10000),
  },
  smtpConfig: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  },
};
