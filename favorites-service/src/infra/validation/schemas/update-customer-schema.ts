import joi from 'joi';
import { RequestSchema } from '../request-schema';

export const UpdateCustomerSchema: RequestSchema = {
  body: joi
    .object({
      name: joi.string().example('Flavio Brito'),
      email: joi.string().email().example('flaviobrusamolin07@gmail.com'),
    })
    .required()
    .min(1),
};
