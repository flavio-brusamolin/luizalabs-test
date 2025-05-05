import { InvalidInputError } from '../../../domain/errors';
import { ErrorResponse, HttpRequest, HttpResponse, InputValidator } from '../contracts';
import { error, noContent } from '../helpers/http-response-builder';
import { Middleware } from './middleware';

type ResponseBody = ErrorResponse;

export class ValidationMiddleware implements Middleware {
  constructor(private readonly inputValidator: InputValidator) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse<ResponseBody>> {
    try {
      const errorMessage = this.inputValidator.validate(httpRequest);
      if (errorMessage) {
        throw new InvalidInputError(errorMessage);
      }

      return noContent();
    } catch (exception) {
      console.error(exception);
      return error(exception);
    }
  }
}
