import { FunctionComponent, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import IPageProps from '../../configs/routerConfig/IPageProps';
import Footer from '@src/layout/Footer';
import useHttpRequest from '@src/hooks/useHttpRequest';
import { IOutputResult } from '@src/models/output/IOutputResult';
import { APIURL_GET_ADVERTISE, APIURL_GET_CATEGORIES, APIURL_GET_SERVICES } from '@src/configs/apiConfig/apiUrls';
import { IAdvertiseResultModel } from '@src/models/output/advertise/IAdvertiseResultModel';
import { useTranslation } from 'react-i18next';
import { ICategory } from '@src/models/output/productCategory/ICategory';
import { URL_MAIN, URL_PRODUCTS, URL_PROVINCE } from './../../configs/urls';
import { useSelector } from 'react-redux';
import { RootStateType } from '@src/redux/Store';
import LoadingComponent from '@src/components/spinner/LoadingComponent';
import PrevHeader from '@src/layout/Headers/PrevHeader';

const Category: FunctionComponent<IPageProps> = (props) => {
  const navigate = useNavigate();
  const auth = useSelector((state: RootStateType) => state.authentication.isAuthenticate);
  const cityId = auth
    ? useSelector((state: RootStateType) => state.authentication.userData?.profile.residenceCityId)
    : localStorage.getItem('city')
    ? JSON.parse(localStorage.getItem('city')!).value
    : navigate(URL_PROVINCE);

  const [advertise, setAdvertise] = useState<any>([]);
  const [categories, setCategories] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const httpRequest = useHttpRequest();
  const { t }: any = useTranslation();
  const { state }: any = useLocation();
  const GetAdvertise = () => {
    httpRequest.getRequest<IOutputResult<IAdvertiseResultModel[]>>(APIURL_GET_ADVERTISE).then((result) => {
      setAdvertise(result.data.data);
    });
  };

  const GetCategories = () => {
    cityId
      ? state && state.ServiceTypeId
        ? (setLoading(true),
          httpRequest
            .getRequest<IOutputResult<ICategory>>(
              `${APIURL_GET_CATEGORIES}/?CityId=${cityId}&ServiceTypeId=${state.ServiceTypeId}`
            )
            .then((result) => {
              setCategories(result.data.data);
              setLoading(false);
            })
            .finally(() => setLoading(false)))
        : navigate(URL_MAIN)
      : navigate(URL_PROVINCE);
  };

  useEffect(() => {
    GetAdvertise();
    GetCategories();
    document.title = props.title;
  }, [props.title]);

  return (
    <>
      <Footer />
      <PrevHeader />
      <div className="page-content">
        {loading ? (
          <LoadingComponent />
        ) : (
          <div className="container srvice-card">
            <div className="service-item-box">
              {!!categories &&
                categories.length > 0 &&
                categories.map((item: ICategory, index: number) => {
                  return (
                    <div
                      className="service-item pointer category-page"
                      style={{
                        backgroundImage: `url(${item.backgroundImageUrl})`,
                      }}
                      onClick={() => {
                        navigate(URL_PRODUCTS, {
                          state: {
                            ProductCategoryId: item.id,
                            ServiceTypeId: state.ServiceTypeId,
                          },
                        });
                      }}
                    >
                      <div className="text-center">
                        <img src={item.logoUrl} className="" />
                        <p>{item.name}</p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Category;
