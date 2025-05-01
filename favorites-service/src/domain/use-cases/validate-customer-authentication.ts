import { CustomerId } from '../entities/customer';
import { Token } from './authenticate-customer';
import { UseCase } from './use-case';

export type ValidateCustomerAuthenticationUseCase = UseCase<Token, CustomerId>;
