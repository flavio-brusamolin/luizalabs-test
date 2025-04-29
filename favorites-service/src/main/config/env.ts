export default {
  port: Number(process.env.PORT) ?? 8080,
  productApiUrl: process.env.PRODUCT_API_URL ?? 'http://localhost:8081',
  amqpConfig: {
    uri: process.env.RABBITMQ_URL ?? 'amqp://admin:admin@localhost:5672',
    queues: ['stale-product', 'removed-product'],
    retryInterval: 10000,
  },
};
