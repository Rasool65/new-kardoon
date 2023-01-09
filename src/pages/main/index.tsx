import { FunctionComponent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import IPageProps from '../../configs/routerConfig/IPageProps';
import FooterCard from '@src/layout/FooterCard';
import Footer from '@src/layout/Footer';
import Header from '../../layout/Headers/Header';
import useHttpRequest from '@src/hooks/useHttpRequest';
import { IOutputResult } from '@src/models/output/IOutputResult';
import { IServicesResultModel } from '@src/models/output/services/IServicesResultModel';
import { APIURL_GET_ADVERTISE, APIURL_GET_GUARANTEE, APIURL_GET_SERVICES } from '@src/configs/apiConfig/apiUrls';
import { IAdvertiseResultModel } from '@src/models/output/advertise/IAdvertiseResultModel';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { RootStateType } from '@src/redux/Store';
import { URL_CATEGORIES, URL_PROVINCE } from '@src/configs/urls';
import WhyKardoon from './WhyKardoon';
import SelectCity from '../province/SelectCity';
import Slider from './Slider';
import SelectTheme from '@src/components/selectTheme/SelectTheme';
import CreditInfo from '../profile/CreditInfo';
import MainLoading from '@src/loading/mainLoading';
import { useNotification } from '@src/hooks/useNotification';
import { IUserGuidResultModel } from '@src/models/output/guarantee/IUserGuidResultModel';
import { updateUserData } from '@src/redux/reducers/authenticationReducer';

const Main: FunctionComponent<IPageProps> = (props) => {
  const color = useSelector((state: RootStateType) => state.theme.color);
  const httpRequest = useHttpRequest();
  const { t }: any = useTranslation();
  const navigate = useNavigate();
  const auth = useSelector((state: RootStateType) => state.authentication.isAuthenticate);
  const userData = useSelector((state: RootStateType) => state.authentication.userData);
  const fetchCount = useNotification();
  const [services, setServices] = useState<IServicesResultModel[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const [advertise, setAdvertise] = useState<any>([]);
  const dispatch = useDispatch();
  const cityId = auth
    ? useSelector((state: RootStateType) => state.authentication.userData?.profile.residenceCityId)
    : localStorage.getItem('city')
    ? JSON.parse(localStorage.getItem('city')!).value
    : navigate(URL_PROVINCE);
  const checkRole = (normalizedName: string) => {
    return userData?.roles ? userData?.roles.some((roleName) => roleName.normalizedName === normalizedName) : false;
  };

  const GetGuarantee = () => {
    httpRequest.getRequest<IOutputResult<IUserGuidResultModel>>(APIURL_GET_GUARANTEE).then((result) => {
      const temp = { ...userData };
      temp['guId'] = result.data.data.guid;
      dispatch(updateUserData(temp));
    });
  };
  const GetServices = (cityId: number) => {
    setLoading(true);
    httpRequest.getRequest<IOutputResult<IServicesResultModel[]>>(`${APIURL_GET_SERVICES}?CityId=${cityId}`).then((result) => {
      setServices(result.data.data);
      setLoading(false);
    });
  };
  const handleSearch = (value: string) => {
    let findData = services?.filter((el: IServicesResultModel) => el.title?.match(value));
    value ? setServices(findData) : GetServices(cityId ? cityId : 0);
  };
  const GetAdvertise = () => {
    httpRequest.getRequest<IOutputResult<IAdvertiseResultModel[]>>(APIURL_GET_ADVERTISE).then((result) => {
      setAdvertise(result.data.data);
    });
  };

  useEffect(() => {
    fetchCount.getCountBlogMessage();
    fetchCount.getCountMessage();
    fetchCount.getStatusMissionCount();
    fetchCount.getWalletBalance();
  }, []);

  useEffect(() => {
    auth && GetGuarantee();
  }, []);

  useEffect(() => {
    GetServices(cityId ? cityId : 0);
    GetAdvertise();
    document.title = props.title;
  }, [props.title]);

  return (
    <>
      {loading ? (
        <MainLoading />
      ) : (
        <>
          <div className="home-container">
            <Header />
            <Footer activePage={2} />
            <SelectTheme />
            <div className="container">
              <section className="search-section container-16">
                <div className="search-box">
                  <input
                    dir="rtl"
                    onChange={(e) => {
                      handleSearch(e.currentTarget.value);
                    }}
                    className="search-input"
                    type="text"
                    placeholder="جستجوی خدمت مورد نظر"
                  />
                  <SelectCity />
                  <div className="saerch-icon">
                    <img
                      src={require(`@src/scss/images/icons/${color}-search3449-7ho.svg`)}
                      alt="search3449"
                      className="home-search2"
                    />
                  </div>
                </div>
              </section>

              {!!advertise &&
                advertise.length > 0 &&
                advertise.map((items: IAdvertiseResultModel[], index: number) => {
                  return (
                    <>
                      <div className="banner">
                        <div className="slideshow-container">
                          <Slider slideList={items} />
                        </div>
                      </div>
                    </>
                  );
                })}

              <section className="kardoon-services">
                <div className="srvice-card">
                  <h4 className="srvice-title">خدمات کاردون</h4>
                  <div className="service-item-box">
                    {services &&
                      services.length > 0 &&
                      services.map((item: IServicesResultModel, index: number) => {
                        return (
                          <div
                            className="service-item pointer"
                            onClick={(e) =>
                              navigate(URL_CATEGORIES, {
                                state: {
                                  ServiceTypeId: item.id,
                                },
                              })
                            }
                          >
                            <img className="home-vector30" style={{ maxWidth: '50px' }} src={item.icon} />
                            <p>{item.title}</p>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </section>
            </div>
            <WhyKardoon />
            <FooterCard />
          </div>

          <div className="modal">
            <div className="modal-content">salam</div>
          </div>

          {/* اگر کاربر لاگین بود ، رول تکنسین داشت ، نام بانکی در حساب اش ثبت نشده بود مودال رو نشون بده */}
          {
            <div
              className={` modal ${
                auth &&
                checkRole('TECHNICIAN') &&
                userData &&
                userData?.accountInfo &&
                userData?.accountInfo?.bankName == null &&
                'd-flex'
              }`}
            >
              <div className="modal-content bank-data">
                <h4>
                  تکنسین گرامی
                  <br />
                  <br /> لطفأ ابتدا مشخصات حساب بانکی خود را تکمیل فرمایید.
                </h4>
                {auth && (
                  <CreditInfo
                  //  closeModal={()=>setShowAccountModal(false)}
                  />
                )}
              </div>
            </div>
          }
        </>
      )}
    </>
  );
};

export default Main;
