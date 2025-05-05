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
  tokenConfig: {
    secret:
      process.env.TOKEN_SECRET ||
      'dca42a848e5d3c8681c39282c3747fb04242c2ff742d8bf29af684985f54cecdfc2f1eec359ec5302eaade1a10813cb2ff5272827f63ecccc5d5b2d1abff9957',
    expiration: Number(process.env.TOKEN_EXPIRATION || 3600),
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
