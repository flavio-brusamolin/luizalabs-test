import jwt from 'jsonwebtoken';
import { JwtAdapter } from '../../../../src/infra/token/jwt-adapter';

jest.mock('jsonwebtoken', () => ({
  sign(): string {
    return 'any_token';
  },

  verify(): { customerId: string } {
    return { customerId: 'any_id' };
  },
}));

interface SutTypes {
  jwtAdapter: JwtAdapter;
  tokenConfig: {
    secret: string;
    expiration: number;
  };
}

const makeSut = (): SutTypes => {
  const tokenConfig = { secret: 'any_secret', expiration: 3600 };
  const jwtAdapter = new JwtAdapter(tokenConfig);
  return { jwtAdapter, tokenConfig };
};

describe('Jwt Adapter', () => {
  describe('#encrypt', () => {
    it('should call sign with correct values', async () => {
      const { jwtAdapter, tokenConfig } = makeSut();
      const { secret, expiration } = tokenConfig;

      const signSpy = jest.spyOn(jwt, 'sign');

      await jwtAdapter.encrypt('any_id');

      expect(signSpy).toHaveBeenCalledWith({ customerId: 'any_id' }, secret, { expiresIn: expiration });
    });

    test('should return a token on sign success', async () => {
      const { jwtAdapter } = makeSut();

      const accessToken = await jwtAdapter.encrypt('any_id');

      expect(accessToken).toBe('any_token');
    });

    describe('#decrypt', () => {
      test('should call verify with correct values', async () => {
        const { jwtAdapter, tokenConfig } = makeSut();
        const { secret } = tokenConfig;

        const verifySpy = jest.spyOn(jwt, 'verify');

        await jwtAdapter.decrypt('any_token');

        expect(verifySpy).toHaveBeenCalledWith('any_token', secret);
      });

      test('should return a customerId on verify success', async () => {
        const { jwtAdapter } = makeSut();

        const value = await jwtAdapter.decrypt('any_token');

        expect(value).toBe('any_id');
      });
    });
  });
});
