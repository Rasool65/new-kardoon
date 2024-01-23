import { FunctionComponent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import IPageProps from '@src/configs/routerConfig/IPageProps';
import FooterCard from '@src/layout/FooterCard';
import Footer from '@src/layout/Footer';
import Header from '@src/layout/Headers/Header';
import useHttpRequest from '@src/hooks/useHttpRequest';
import { IOutputResult } from '@src/models/output/IOutputResult';
import { IServicesResultModel } from '@src/models/output/services/IServicesResultModel';
import { APIURL_GET_ADVERTISE, APIURL_GET_GUARANTEE, APIURL_GET_SERVICES } from '@src/configs/apiConfig/apiUrls';
import { IAdvertiseResultModel } from '@src/models/output/advertise/IAdvertiseResultModel';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { RootStateType } from '@src/redux/Store';
import { URL_CATEGORIES, URL_PROVINCE, URL_USER_PROFILE } from '@src/configs/urls';
import WhyKardoon from './WhyKardoon';
import SelectCity from '../province/SelectCity';
import Slider from './Slider';
import SelectTheme from '@src/components/selectTheme/SelectTheme';
import CreditInfo from '../profile/CreditInfo';
import MainLoading from '@src/loading/mainLoading';
import { useNotification } from '@src/hooks/useNotification';
import { IUserGuidResultModel } from '@src/models/output/guarantee/IUserGuidResultModel';
import { updateUserData } from '@src/redux/reducers/authenticationReducer';
import { UtilsHelper } from '@src/utils/GeneralHelpers';
import { useQuery } from 'react-query';
import { services } from '@src/configs/apiConfig/cachNames';

const Main: FunctionComponent<IPageProps> = (props) => {
  const color = useSelector((state: RootStateType) => state.theme.color);
  const walletBalance = useSelector((state: RootStateType) => state.message.walletBalance);
  const httpRequest = useHttpRequest();
  const { t }: any = useTranslation();
  const navigate = useNavigate();
  const auth = useSelector((state: RootStateType) => state.authentication.isAuthenticate);
  const userData = useSelector((state: RootStateType) => state.authentication.userData);
  const fetchCount = useNotification();
  // const [services, setServices] = useState<IServicesResultModel[]>();
  // const [loading, setLoading] = useState<boolean>(false);
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

  const GetServices = async (cityId: number) => {
    // setLoading(true);
    const response = await httpRequest.getRequest<IOutputResult<IServicesResultModel[]>>(
      `${APIURL_GET_SERVICES}?CityId=${cityId}`
    );
    //  .then((result) => {
    //     setServices(result.data.data);
    //     setLoading(false);
    //   });
    return response.data.data;
  };

  const handleSearch = (value: string) => {
    let findData = getServicesQuery.data?.filter((el: IServicesResultModel) => el.title?.match(value));
    // value ? setServices(findData) : GetServices(cityId ? cityId : 0);
    value ? getServicesQuery.data(findData) : GetServices(cityId ? cityId : 0);
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
  const requestNotificationPermission = () => {
    //@ts-ignore
    if (window.safari && window.safari.pushNotification) {
      //@ts-ignore
      const permissionData = window.safari.pushNotification.permission('your.website.push.notification.id');
      window.alert(permissionData);
      if (permissionData.permission === 'default') {
        window.alert('Please enable notifications for this website.');
      } else if (permissionData.permission === 'denied') {
        window.alert('You have denied permission for notifications.');
      } else if (permissionData.permission === 'granted') {
        window.alert('You have granted permission for notifications.');
      }
    } else {
      // Safari Push Notifications not supported
      window.alert('Safari Push Notifications are not supported on this device.');
    }
  };
  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    /android/.test(userAgent) || /windows/.test(userAgent) ? Notification.requestPermission() : requestNotificationPermission();
    auth && GetGuarantee();
  }, []);

  useEffect(() => {
    GetAdvertise();
    document.title = props.title;
  }, [props.title]);

  const getServicesQuery: any = useQuery(services, () => GetServices(cityId ? cityId : 0));

  return (
    <>
      {getServicesQuery.isLoading ? (
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
                    {getServicesQuery.data &&
                      getServicesQuery.data.length > 0 &&
                      getServicesQuery.data.map((item: IServicesResultModel, index: number) => {
                        return (
                          getServicesQuery.data[index].id !== 14 && ( // حذف هوم وارانتی
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
                          )
                        );
                      })}
                  </div>
                </div>
              </section>
            </div>
            <WhyKardoon />
            <FooterCard />
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
          {
            <div className={` modal technician-alert ${auth && checkRole('TECHNICIAN') && walletBalance! > 0 && 'd-flex'}`}>
              <div className="modal-content bank-data">
                <div className="alert-header">
                  <img src={require(`@src/scss/images/icons/${color}-info.svg`)} alt="" />
                  <h5>تکنسین گرامی</h5>
                  <h4>لطفأ بدهی حساب خود را تسویه نمایید</h4>
                </div>
                <div className="wallet-info">
                  <h5 className="item-label">مبلغ بدهی</h5>
                  <p className="wallet-amount debtor-text">
                    {'(' + UtilsHelper.threeDigitSeparator(Math.abs(walletBalance!)) + ')'} ریال
                  </p>
                </div>
                <button
                  onClick={() => {
                    navigate(URL_USER_PROFILE, { state: { tabPage: 1 } });
                  }}
                >
                  باشه
                </button>
              </div>
            </div>
          }
        </>
      )}
    </>
  );
};

export default Main;
