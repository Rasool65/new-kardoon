import { Navigate, Outlet } from 'react-router-dom';
import { URL_LOGIN } from '../configs/urls';
import { useSelector } from 'react-redux';
import { RootStateType } from '@src/redux/Store';

const PrivateRoute = () => {
  const auth = useSelector((state: RootStateType) => state.authentication);
  return auth.isAuthenticate ? <Outlet /> : <Navigate to={URL_LOGIN} />;
};

export default PrivateRoute;
