import { IJwtConfig } from '@src/configs/jwt/IJwtConfig.js';
import jwtDefaultConfig from '@src/configs/jwt/jwtDefaultConfig';

export default class JwtService {
  jwtConfig: IJwtConfig = { ...jwtDefaultConfig };

  constructor(jwtOverrideConfig: IJwtConfig) {
    this.jwtConfig = { ...this.jwtConfig, ...jwtOverrideConfig };
  }
}
