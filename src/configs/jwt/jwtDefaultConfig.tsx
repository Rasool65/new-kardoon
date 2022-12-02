export default {
  loginEndpoint: '/jwt/login',
  registerEndpoint: '/jwt/register',
  refreshEndpoint: '/jwt/refresh-token',
  logoutEndpoint: '/jwt/logout',
  tokenType: 'Bearer',
  storageTokenKeyName: 'AccessToken',
  storageRefreshTokenKeyName: 'RefreshToken',
  storageUUIDKeyName: 'UUID',
};
