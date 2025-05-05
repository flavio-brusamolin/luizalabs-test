import { ObjectSchema } from 'joi';
import { HttpRequest } from '../../interfaces/http/contracts';

export type RequestSchema = Omit<HttpRequest<ObjectSchema, ObjectSchema, ObjectSchema, ObjectSchema>, 'customerId'>;
