import { HttpRequest, InputValidator } from '../../interfaces/http/contracts';
import { RequestSchema } from './request-schema';

export class JoiAdapter implements InputValidator {
  constructor(private readonly requestSchema: RequestSchema) {}

  validate(httpRequest: HttpRequest): string {
    const requestParts = Object.keys(this.requestSchema) as Array<keyof RequestSchema>;

    for (const requestPart of requestParts) {
      const input = httpRequest[requestPart];
      const schema = this.requestSchema[requestPart];

      if (input && schema) {
        const { error } = schema.validate(input);
        if (error) {
          return error.message;
        }
      }
    }
  }
}
