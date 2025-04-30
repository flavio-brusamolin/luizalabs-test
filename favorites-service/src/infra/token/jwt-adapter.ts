import { sign } from 'jsonwebtoken';
import { EncryptToken } from '../../app/contracts/token';
import { CustomerId } from '../../domain/entities/customer';
import { Token } from '../../domain/use-cases/authenticate-customer';

interface TokenConfig {
  secret: string;
  expiration: number;
}

export class JwtAdapter implements EncryptToken {
  constructor(private readonly tokenConfig: TokenConfig) {}

  async encrypt(customerId: CustomerId): Promise<Token> {
    const { secret, expiration } = this.tokenConfig;
    return sign({ customerId }, secret, { expiresIn: expiration });
  }
}
