import joi from 'joi';
import { RequestSchema } from '../request-schema';

export const AddFavoriteSchema: RequestSchema = {
  body: joi
    .object({
      productId: joi.string().guid({ version: 'uuidv4' }).required(),
    })
    .required(),
};
