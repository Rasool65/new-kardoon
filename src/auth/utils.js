import useJwt from '@src/hooks/jwt/jwt/useJwt';

/**
 * Return if user is logged in
 * This is completely up to you and how you want to store the token in your frontend application
 * e.g. If you are using cookies to store the application please update this function
 */
// eslint-disable-next-line arrow-body-style
const userData_localStorage = localStorage.getItem('userData');

export const isUserLoggedIn = () => {
  return userData_localStorage && localStorage.getItem(useJwt.jwtConfig.storageTokenKeyName);
};

export const getUserData = () => userData_localStorage && JSON.parse(userData_localStorage);

/**
 * This function is used for demo purpose route navigation
 * In real app you won't need this function because your app will navigate to same route for each users regardless of ability
 * Please note role field is just for showing purpose it's not used by anything in frontend
 * We are checking role just for ease
 * NOTE: If you have different pages to navigate based on user ability then this function can be useful. However, you need to update it.
 * @param {String} userRole Role of user
 */
export const getHomeRouteForLoggedInUser = (userRole) => {
  if (userRole === 'admin') return '/';
  if (userRole === 'client') return { name: 'access-control' };
  return { name: 'auth-login' };
};
