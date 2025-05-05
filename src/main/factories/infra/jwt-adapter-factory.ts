import env from '../../config/env';
import { JwtAdapter } from '../../../infra/token/jwt-adapter';

export const buildJwtAdapter = (): JwtAdapter => {
  return new JwtAdapter(env.tokenConfig);
};
