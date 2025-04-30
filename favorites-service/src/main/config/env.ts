export default {
  serverConfig: {
    port: Number(process.env.PORT) ?? 8080,
  },
  integrationConfig: {
    productApiUrl: process.env.PRODUCT_API_URL ?? 'http://localhost:8081',
  },
  cacheConfig: {
    staleTime: 10000,
  },
  amqpConfig: {
    uri: process.env.RABBITMQ_URL ?? 'amqp://admin:admin@localhost:5672',
    retryInterval: 10000,
  },
};
