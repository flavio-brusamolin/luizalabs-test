import joi from 'joi';
import { RequestSchema } from '../request-schema';

export const RemoveFavoriteSchema: RequestSchema = {
  params: joi
    .object({
      productId: joi.string().guid({ version: 'uuidv4' }).required(),
    })
    .required(),
};
