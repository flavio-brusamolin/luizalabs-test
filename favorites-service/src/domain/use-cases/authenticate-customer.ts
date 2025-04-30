import { ApiKey } from '../entities/customer';
import { UseCase } from './use-case';

export type AccessToken = { accessToken: string };
export type AuthenticateCustomerInput = { apiKey: ApiKey };
export type AuthenticateCustomerUseCase = UseCase<AuthenticateCustomerInput, AccessToken>;
