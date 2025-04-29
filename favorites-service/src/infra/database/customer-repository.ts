import {
  AddFavoriteRepository,
  CheckFavoriteRepository,
  GetFavoritesRepository,
  PurgeFavoriteRepository,
  RemoveFavoriteRepository,
} from '../../app/contracts/database';
import { Customer, CustomerId } from '../../domain/entities/customer';
import { ProductId } from '../../domain/entities/product';

export class CustomerRepository
  implements
    AddFavoriteRepository,
    CheckFavoriteRepository,
    GetFavoritesRepository,
    RemoveFavoriteRepository,
    PurgeFavoriteRepository
{
  private static customers: Customer[] = [
    {
      customerId: '9e4ed06e-d589-40c2-bf07-f3e1069f1d8f',
      email: 'flaviobrusamolin@gec.inatel.br',
      name: 'Flavio',
      favorites: [],
    },
    {
      customerId: '7ee13a9e-0760-47c3-bbaa-4f391afd5640',
      email: 'karenaribeiro81@gmail.com',
      name: 'Karen',
      favorites: [],
    },
    {
      customerId: '7ee13a9e-0760-47c3-bbaa-4f391afd5642',
      email: 'test@gmail.com',
      name: 'Test',
      favorites: [],
    },
  ];

  async addFavorite(customerId: CustomerId, productId: ProductId): Promise<void> {
    const customer = await this.findCustomer(customerId);
    if (!customer.favorites.includes(productId)) {
      customer.favorites.push(productId);
    }
    return Promise.resolve();
  }

  async isFavorite(customerId: CustomerId, productId: ProductId): Promise<boolean> {
    const customer = await this.findCustomer(customerId);
    const isFavorite = customer.favorites.includes(productId);
    return Promise.resolve(isFavorite);
  }

  async getFavorites(customerId: CustomerId): Promise<Array<ProductId>> {
    const customer = await this.findCustomer(customerId);
    return Promise.resolve(customer.favorites);
  }

  async removeFavorite(customerId: CustomerId, productId: ProductId): Promise<void> {
    const customer = await this.findCustomer(customerId);
    customer.favorites = customer.favorites.filter((favorite) => favorite !== productId);
    return Promise.resolve();
  }

  async purgeFavorite(productId: ProductId): Promise<void> {
    for (const customer of CustomerRepository.customers) {
      if (customer.favorites.includes(productId)) {
        customer.favorites = customer.favorites.filter((favorite) => favorite !== productId);
      }
    }
    return Promise.resolve();
  }

  private async findCustomer(customerId: CustomerId): Promise<Customer> {
    const customer = CustomerRepository.customers.find((customer) => customer.customerId === customerId);
    if (!customer) {
      return Promise.reject(new Error('Customer not found'));
    }

    return Promise.resolve(customer);
  }

  // addCustomer(customer: Customer) {
  //   CustomerRepository.customers.push(customer);
  // }
}
