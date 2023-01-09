import { FunctionComponent, useEffect, useState } from 'react';
import { IPageProps } from '@src/configs/routerConfig/IPageProps';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useHttpRequest from '@src/hooks/useHttpRequest';
import { RootStateType } from '@src/redux/Store';
import { IOutputResult } from '@src/models/output/IOutputResult';
import { APIURL_GET_CITIES, APIURL_UPDATE_RESIDENCE_CITY } from '@src/configs/apiConfig/apiUrls';
import { ICitiesResultModel } from '@src/models/output/countryDivision/ICitiesResultModel';
import LoadingComponent from '@src/components/spinner/LoadingComponent';
import { useToast } from '@src/hooks/useToast';
import { reloadUserData } from '@src/redux/reducers/authenticationReducer';
import { IUserModel } from '@src/models/output/authentication/ILoginResultModel';
import { URL_MAIN } from '@src/configs/urls';

const City: FunctionComponent<IPageProps> = (props) => {
  const color = useSelector((state: RootStateType) => state.theme.color);
  const userData = useSelector((state: RootStateType) => state.authentication.userData);
  const auth = useSelector((state: RootStateType) => state.authentication.isAuthenticate);
  const [cities, setCities] = useState<any>();
  const httpRequest = useHttpRequest();
  const [loading, setLoading] = useState<boolean>(false);
  const { t }: any = useTranslation();
  const toast = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { state }: any = useLocation();

  const GetCitiesList = () => {
    state.city
      ? httpRequest
          .getRequest<IOutputResult<ICitiesResultModel[]>>(`${APIURL_GET_CITIES}?ParentId=${state.city.value}`)
          .then((result) => {
            setCities(result.data.data);
          })
      : toast.showError('هیچ شهری در این استان یافت نشد');
  };

  const UpdateResidenceCity = (userId: number, cityId: number) => {
    const body = {
      userId: userId,
      cityId: cityId,
    };
    httpRequest.updateRequest<IOutputResult<IUserModel>>(APIURL_UPDATE_RESIDENCE_CITY, body).then((result) => {
      dispatch(reloadUserData(result));
      navigate(URL_MAIN);
      history.go(0);
    });
  };

  const handleSearch = (value: string) => {
    let findData = cities?.filter((el: ICitiesResultModel) => el.label?.match(value));
    value ? setCities(findData) : GetCitiesList();
  };
  useEffect(() => {
    document.title = props.title;
  }, [props.title]);

  useEffect(() => {
    GetCitiesList();
  }, []);

  return (
    <>
      <div className="home-container">
        <div className="select-city">
          <div className="search-city">
            <div className="container">
              <h2>شهر محل سکونت خود را انتخاب کنید.</h2>
              <div className="search-boxer">
                <input
                  dir="rtl"
                  onChange={(e) => handleSearch(e.target.value)}
                  className="sort-input"
                  type="text"
                  placeholder="انتخاب شهر ..."
                />
                <a className="saerch-icon-sort">
                  <img src={require(`@src/scss/images/icons/${color}-search3449-7ho.svg`)} />
                </a>
              </div>
            </div>
          </div>
          <div className="container">
            <div className="city-item">
              <div className="title">همه شهرها</div>
              {loading ? (
                <LoadingComponent />
              ) : (
                <ul>
                  {cities &&
                    cities.length > 0 &&
                    cities.map((city: ICitiesResultModel, index: number) => {
                      return (
                        <>
                          <li>
                            <a
                              onClick={() => {
                                auth
                                  ? UpdateResidenceCity(userData?.userId ? userData.userId : 0, city.value!)
                                  : (localStorage.setItem('city', JSON.stringify(city)), navigate(URL_MAIN), history.go(0));
                              }}
                            >
                              {city.label}
                            </a>
                          </li>
                        </>
                      );
                    })}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default City;
