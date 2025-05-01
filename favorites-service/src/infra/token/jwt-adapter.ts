import { sign, verify } from 'jsonwebtoken';
import { EncryptToken } from '../../app/contracts/token';
import { CustomerId } from '../../domain/entities/customer';
import { Token } from '../../domain/use-cases/authenticate-customer';
import { DecryptToken } from '../../app/contracts/token/decrypt-token';

interface TokenConfig {
  secret: string;
  expiration: number;
}

export class JwtAdapter implements EncryptToken, DecryptToken {
  constructor(private readonly tokenConfig: TokenConfig) {}

  async encrypt(customerId: CustomerId): Promise<Token> {
    const { secret, expiration } = this.tokenConfig;
    return sign({ customerId }, secret, { expiresIn: expiration });
  }

  public async decrypt(token: Token): Promise<CustomerId> {
    const { secret } = this.tokenConfig;
    const { customerId }: any = verify(token, secret);
    return customerId;
  }
}
