import joi from 'joi';
import { RequestSchema } from '../request-schema';

export const UpdateCustomerSchema: RequestSchema = {
  body: joi
    .object({
      name: joi.string(),
      email: joi.string().email(),
    })
    .required()
    .min(1),
};
