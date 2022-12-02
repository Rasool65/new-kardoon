import { IJwtConfig } from '@src/configs/jwt/IJwtConfig';
import jwtDefaultConfig from '@src/configs/jwt/jwtDefaultConfig';
import JwtService from './jwtService';

export default function useJwt(jwtOverrideConfig?: IJwtConfig) {
  const jwt = new JwtService(jwtOverrideConfig ? jwtOverrideConfig : jwtDefaultConfig);

  return {
    jwt,
  };
}
