import joi from 'joi';
import { RequestSchema } from '../request-schema';

export const AddCustomerSchema: RequestSchema = {
  body: joi
    .object({
      name: joi.string().required().example('Flavio Brusamolin'),
      email: joi.string().email().required().example('flaviobrusamolin@gec.inatel.br'),
    })
    .required(),
};
