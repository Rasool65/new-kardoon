import { useLocalStorage } from './useLocalStorage';
import * as uuid from 'uuid';
import { validate as uuidValidate } from 'uuid';
import { IJwtConfig } from '@src/configs/jwt/IJwtConfig';
import jwtDefaultConfig from '@src/configs/jwt/jwtDefaultConfig';

export const useTokenAuthentication = () => {
  const storage = useLocalStorage();
  const jwtConfig: IJwtConfig = { ...jwtDefaultConfig };

  const saveLoginToken = (token: string, refreshToken: string, currentTokenGuid: string) => {
    storage.set(jwtConfig.storageTokenKeyName, token);
    storage.set(jwtConfig.storageRefreshTokenKeyName, refreshToken);
    storage.set(jwtConfig.storageUUIDKeyName, currentTokenGuid);
  };

  const deleteLogoutToken = () => {
    storage.remove(jwtConfig.storageTokenKeyName);
    storage.remove(jwtConfig.storageUUIDKeyName);
    storage.remove(jwtConfig.storageRefreshTokenKeyName);
  };

  const isAuthenticate = (): boolean => {
    const uuid = storage.get(jwtConfig.storageUUIDKeyName);
    const token = storage.get(jwtConfig.storageTokenKeyName);
    const refreshToken = storage.get(jwtConfig.storageRefreshTokenKeyName);
    if (token && uuid && refreshToken) return uuidValidate(uuid) && token != '' && refreshToken != '';
    return false;
  };

  const getToken = (): string => {
    return storage.get(jwtConfig.storageTokenKeyName) || '';
  };

  const getRefreshToken = (): string => {
    return storage.get(jwtConfig.storageRefreshTokenKeyName) || '';
  };

  return {
    saveLoginToken,
    deleteLogoutToken,
    isAuthenticate,
    getToken,
    getRefreshToken,
  };
};
