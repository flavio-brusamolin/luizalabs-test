import joi from 'joi';
import { RequestSchema } from '../request-schema';

export const AddFavoriteSchema: RequestSchema = {
  body: joi
    .object({
      productId: joi.string().guid({ version: 'uuidv4' }).required().example('6ce6b564-92d3-492a-91ba-ee4e6aee7d87'),
    })
    .required(),
};
