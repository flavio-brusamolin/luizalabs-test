import joi from 'joi';
import { RequestSchema } from '../request-schema';

export const AddCustomerSchema: RequestSchema = {
  body: joi
    .object({
      name: joi.string().required(),
      email: joi.string().email().required(),
    })
    .required(),
};
