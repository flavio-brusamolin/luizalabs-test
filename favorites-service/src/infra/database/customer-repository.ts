import {
  AddFavoriteRepository,
  CheckFavoriteRepository,
  GetFavoritesRepository,
  PurgeFavoriteRepository,
  RemoveFavoriteRepository,
  AddCustomerRepository,
  LoadCustomerByEmailRepository,
  LoadCustomerByApiKeyRepository,
  LoadCustomerByIdRepository,
  RemoveCustomerRepository,
  UpdateCustomerRepository,
} from '../../app/contracts/database';
import { ApiKey, Customer, CustomerId } from '../../domain/entities/customer';
import { ProductId } from '../../domain/entities/product';
import { CustomerProps } from '../../domain/use-cases/update-customer';
import { DatabaseCustomer } from './database-customer';
import CustomerMapper from './customer-mapper';

export class CustomerRepository
  implements
    AddFavoriteRepository,
    CheckFavoriteRepository,
    GetFavoritesRepository,
    RemoveFavoriteRepository,
    PurgeFavoriteRepository,
    LoadCustomerByEmailRepository,
    AddCustomerRepository,
    LoadCustomerByApiKeyRepository,
    LoadCustomerByIdRepository,
    RemoveCustomerRepository,
    UpdateCustomerRepository
{
  private static customers: DatabaseCustomer[] = [];

  async addCustomer(customer: Customer): Promise<Customer> {
    const dbCustomer = CustomerMapper.toDatabase(customer);
    CustomerRepository.customers.push(dbCustomer);
    return CustomerMapper.toEntity(dbCustomer);
  }

  async updateCustomer(customerId: CustomerId, customerProps: CustomerProps): Promise<Customer> {
    const customer = this.findCustomer(customerId);
    Object.keys(customerProps).forEach((propKey) => (customer[propKey] = customerProps[propKey]));
    return CustomerMapper.toEntity(customer);
  }

  async removeCustomer(customerId: CustomerId): Promise<void> {
    CustomerRepository.customers = CustomerRepository.customers.filter((customer) => customer.customerId !== customerId);
  }

  async loadCustomerById(customerId: CustomerId): Promise<Customer> {
    const dbCustomer = CustomerRepository.customers.find((customer) => customer.customerId === customerId);
    return dbCustomer && CustomerMapper.toEntity(dbCustomer);
  }

  async loadCustomerByEmail(email: string): Promise<Customer> {
    const dbCustomer = CustomerRepository.customers.find((customer) => customer.email === email);
    return dbCustomer && CustomerMapper.toEntity(dbCustomer);
  }

  async loadCustomerByApiKey(apiKey: ApiKey): Promise<Customer> {
    const dbCustomer = CustomerRepository.customers.find((customer) => customer.apiKey === apiKey);
    return dbCustomer && CustomerMapper.toEntity(dbCustomer);
  }

  async addFavorite(customerId: CustomerId, productId: ProductId): Promise<void> {
    const customer = this.findCustomer(customerId);
    if (!customer.favorites.includes(productId)) {
      customer.favorites.push(productId);
    }
  }

  async isFavorite(customerId: CustomerId, productId: ProductId): Promise<boolean> {
    const customer = this.findCustomer(customerId);
    return customer.favorites.includes(productId);
  }

  async getFavorites(customerId: CustomerId): Promise<ProductId[]> {
    const customer = this.findCustomer(customerId);
    return customer.favorites;
  }

  async removeFavorite(customerId: CustomerId, productId: ProductId): Promise<void> {
    const customer = this.findCustomer(customerId);
    customer.favorites = customer.favorites.filter((favorite) => favorite !== productId);
  }

  async purgeFavorite(productId: ProductId): Promise<void> {
    for (const customer of CustomerRepository.customers) {
      if (customer.favorites.includes(productId)) {
        customer.favorites = customer.favorites.filter((favorite) => favorite !== productId);
      }
    }
  }

  private findCustomer(customerId: CustomerId): DatabaseCustomer {
    const customer = CustomerRepository.customers.find((customer) => customer.customerId === customerId);
    if (!customer) {
      throw new Error('Customer not found');
    }

    return customer;
  }
}
