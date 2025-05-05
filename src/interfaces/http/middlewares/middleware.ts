import { HttpRequest, HttpResponse } from '../contracts';

export interface Middleware {
  handle: (httpRequest: HttpRequest) => Promise<HttpResponse>;
}
