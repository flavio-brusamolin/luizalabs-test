import joi from 'joi';
import { RequestSchema } from '../request-schema';

export const GetFavoritesSchema: RequestSchema = {
  query: joi.object({
    page: joi.number().integer().min(1),
    limit: joi.number().integer().min(1).max(100),
  }),
};
