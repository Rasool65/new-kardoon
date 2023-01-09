import { FunctionComponent } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import routes from '../configs/routerConfig/RouterList';
import RouteType from '../configs/routerConfig/RouteType';
import PrivateRoute from './PrivateRoute';
import { URL_LOGIN, URL_MAIN } from '@src/configs/urls';
import { useSelector } from 'react-redux';
import { RootStateType } from '@src/redux/Store';
import PrivateLayout from '@src/layout/PrivateLayout';
import NotFound from '@src/pages/notFound';

const Routers: FunctionComponent = () => {
  const authenticationStore = useSelector((state: RootStateType) => state.authentication);

  return (
    <BrowserRouter>
      <Routes>
        {routes.map((route, index) => {
          return route.type == RouteType.all ? (
            <>
              <Route path="*" element={<NotFound title="404 | صفحه موردنظر پیدا نشد" />} />
              <Route key={index} path={route.path} element={<route.component {...route.props} />} />
            </>
          ) : (
            <>
              {routes.map((route, index) => {
                return route.type == RouteType.private ? (
                  //* Private Route
                  <Route key={index} path={route.path} element={<PrivateRoute />}>
                    <Route
                      key={index}
                      path={route.path}
                      element={
                        // <PrivateLayout {...route.props}>
                        <route.component name={route.name} {...route.props} />
                        // </PrivateLayout>
                      }
                    />
                  </Route>
                ) : (
                  //* Public Route
                  <Route
                    key={index}
                    path={route.path}
                    element={
                      authenticationStore.isAuthenticate && route.path == URL_MAIN ? (
                        <Navigate to={URL_MAIN} />
                      ) : route.path == URL_LOGIN ? (
                        // <PrivateLayout>
                        <route.component name={route.name} {...route.props} />
                      ) : (
                        //  </PrivateLayout>
                        // <PublicLayout>
                        <route.component name={route.name} {...route.props} />
                        // </PublicLayout>
                      )
                    }
                  />
                );
              })}
            </>
          );
        })}
      </Routes>
    </BrowserRouter>
  );
};

export default Routers;
