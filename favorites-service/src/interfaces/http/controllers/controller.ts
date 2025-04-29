import { HttpRequest, HttpResponse } from '../contracts';

export interface Controller {
  handle: (httpRequest: HttpRequest) => Promise<HttpResponse>;
}
