import Joi from 'joi';
import { JoiAdapter } from '../../../../src/infra/validation/joi-adapter';
import { HttpRequest } from '../../../../src/interfaces/http/contracts';
import { RequestSchema } from '../../../../src/infra/validation/request-schema';

const makeFakeHttpRequest = (): HttpRequest => ({
  body: { field: 'value' },
  query: { page: 1 },
  params: { id: '6ce6b564-92d3-492a-91ba-ee4e6aee7d87' },
});

const makeFakeRequestSchema = (): RequestSchema => ({
  body: Joi.object({ field: Joi.string().required() }),
  query: Joi.object({ page: Joi.number().integer().positive() }),
  params: Joi.object({ id: Joi.string().uuid() }),
});

const makeSut = () => {
  const requestSchema = makeFakeRequestSchema();
  const joiAdapter = new JoiAdapter(requestSchema);
  return { joiAdapter, requestSchema };
};

describe('JoiAdapter', () => {
  describe('#validate', () => {
    it('should return undefined if validation succeeds', () => {
      const { joiAdapter } = makeSut();

      const httpRequest = makeFakeHttpRequest();
      const errorMessage = joiAdapter.validate(httpRequest);

      expect(errorMessage).toBeUndefined();
    });

    it('should return an error message if validation fails', () => {
      const { joiAdapter } = makeSut();

      const httpRequest = { ...makeFakeHttpRequest(), body: { field: 123 } };
      const errorMessage = joiAdapter.validate(httpRequest);

      expect(errorMessage).toBe('"field" must be a string');
    });
  });
});
