import { ApiKey } from '../entities/customer';
import { UseCase } from './use-case';

export type Token = string;
export type AuthenticateCustomerInput = { apiKey: ApiKey };
export type AuthenticateCustomerUseCase = UseCase<AuthenticateCustomerInput, Token>;
