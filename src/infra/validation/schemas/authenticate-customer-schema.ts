import joi from 'joi';
import { RequestSchema } from '../request-schema';

export const AuthenticateCustomerSchema: RequestSchema = {
  body: joi
    .object({
      apiKey: joi.string().guid({ version: 'uuidv4' }).required(),
    })
    .required(),
};
