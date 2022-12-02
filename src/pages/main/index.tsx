import { FunctionComponent, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import IPageProps from '../../configs/routerConfig/IPageProps';
import FooterCard from '@src/layout/FooterCard';
import Footer from '@src/layout/Footer';
import Header from '../../layout/Headers/Header';
import useHttpRequest from '@src/hooks/useHttpRequest';
import { IOutputResult } from '@src/models/output/IOutputResult';
import { IServicesResultModel } from '@src/models/output/services/IServicesResultModel';
import { APIURL_GET_ADVERTISE, APIURL_GET_MESSAGE_COUNT, APIURL_GET_SERVICES } from '@src/configs/apiConfig/apiUrls';
import { IAdvertiseResultModel } from '@src/models/output/advertise/IAdvertiseResultModel';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { RootStateType } from '@src/redux/Store';
import { URL_CATEGORIES, URL_PROVINCE } from '@src/configs/urls';
import { Spinner } from 'reactstrap';
import { URL_CITY } from './../../configs/urls';
import { IChatCountResultModel } from '@src/models/output/categoryConversation/IChatCountResultModel';
import { handleNewMessageCount } from '@src/redux/reducers/messageReducer';
import LoginModal from '../authentication/LoginModal';
import { useToast } from '@src/hooks/useToast';
import WhyKardoon from './WhyKardoon';
import SelectCity from '../province/SelectCity';
import Slider from './Slider';
import SelectTheme from '@src/components/selectTheme/SelectTheme';
import CreditInfo from '../profile/CreditInfo';
import { IBankAccountInfoResultModel } from '@src/models/output/profile/IBankAccountInfoResultModel';
const Main: FunctionComponent<IPageProps> = (props) => {
  const color = useSelector((state: RootStateType) => state.theme.color);
  const httpRequest = useHttpRequest();
  const { t }: any = useTranslation();
  const navigate = useNavigate();
  const auth = useSelector((state: RootStateType) => state.authentication.isAuthenticate);
  const userData = useSelector((state: RootStateType) => state.authentication.userData);
  const dispatch = useDispatch();
  const toast = useToast();
  const [services, setServices] = useState<IServicesResultModel[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const [bankAccountModal, setBankAccountModal] = useState<boolean>(false);
  const [advertise, setAdvertise] = useState<any>([]);

  const checkRole = (normalizedName: string) => {
    return userData?.roles ? userData?.roles.some((roleName) => roleName.normalizedName === normalizedName) : false;
  };

  const getCountMessage = () => {
    auth &&
      httpRequest
        .getRequest<IOutputResult<IChatCountResultModel>>(`${APIURL_GET_MESSAGE_COUNT}?UserId=${userData?.userId}`)
        .then((result) => {
          dispatch(handleNewMessageCount(result.data.data.count));
        });
  };
  const cityId = auth
    ? useSelector((state: RootStateType) => state.authentication.userData?.profile.residenceCityId)
    : localStorage.getItem('city')
    ? JSON.parse(localStorage.getItem('city')!).value
    : navigate(URL_PROVINCE);

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
    GetServices(cityId ? cityId : 0);
    GetAdvertise();
    document.title = props.title;
  }, [props.title]);

  useEffect(() => {
    auth && getCountMessage();
  }, []);

  return (
    <>
      <div className="home-container">
        <Header />
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

          {/* <section className="kardoon-services">
            <div className="srvice-card">
              <h4 className="srvice-title">خدمات کاردون</h4>
              <div className="new-service-item-box">
                ===================> Paste new category design here <===================
                ===================> Paste new category design here <===================
                ===================> Paste new category design here <===================
                ===================> Paste new category design here <===================
              </div>
            </div>
          </section> */}
        </div>

        <WhyKardoon />

        <FooterCard />
      </div>
      <Footer activePage={2} />
      {/* اگر کاربر لاگین بود ، رول تکنسین داشت ، نام بانکی در حساب اش ثبت نشده بود مودال رو نشون بده */}
      {
        <div className={` modal ${auth && checkRole('TECHNICIAN') && userData?.accountInfo?.bankName == null && 'd-flex'}`}>
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

      {/* <LoginModal display={display} showModal={showModal} /> */}

      {/* <div className="page-content" style={{ paddingBottom: '0' }}>
          {!!advertise &&
            advertise.length > 0 &&
            advertise.map((items: IAdvertiseResultModel[], index: number) => {
              return (
                <div
                  style={{ marginTop: '30px' }}
                  className="splide double-slider visible-slider slider-no-arrows slider-no-dots"
                  id={`double-slider-${index}`}
                >
                  <div className="splide__track">
                    <div className="splide__list">
                      {!!items &&
                        items.map((item: IAdvertiseResultModel) => {
                          return (
                            <div className="splide__slide ps-3">
                              <div className="bg-theme pb-3 rounded-m shadow-l text-center overflow-hidden">
                                <div
                                  style={{ backgroundImage: `url(${item.imageUrl})` }}
                                  data-card-height="150"
                                  className="card mb-2"
                                >
                                  <h5 className="card-bottom color-white mb-2">{item.title}</h5>
                                  <div className="card-overlay bg-gradient"></div>
                                </div>
                                <p className="mb-3 ps-2 pe-2 pt-2 font-12">{item.summary}</p>
                                <a
                                  //  href={`${BASE_URL}${item.addressUrl}`}
                                  href={item.hrefUrl}
                                  target={item.targetUrl}
                                  className="btn btn-xs bg-highlight btn-center-xs rounded-s shadow-s text-uppercase font-700"
                                >
                                  {t('View')}
                                </a>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
              );
            })}
          {loading ? (
            <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-around' }}>
              <Spinner />
            </div>
          ) : (
            !!services &&
            services?.length > 0 &&
            services.map((item: IServicesResultModel, id: number) => {
              return (
                <div
                  style={{ marginTop: '30px' }}
                  className="card card-style card-blur pointer"
                  data-card-height="155"
                  onClick={(e) =>
                    navigate(URL_CATEGORIES, {
                      state: {
                        ServiceTypeId: item.id,
                      },
                    })
                  }
                >
                  <img key={id} src={item.backgroundUrl} className="card-image" alt={item.title} />
                  <div className="card-top">
                    <img width={100} src={item.icon} alt="logo" />
                  </div>
                  <div className="card-bottom">
                    <div className="float-end me-3">
                      <h1 className="color-white font-700 text-end mb-n1">{item.title}</h1>
                      <p className="color-white text-end opacity-50 mb-2">{item.shortDescription}</p>
                    </div>
                  </div>
                  <div className="card-overlay bg-black opacity-30" />
                </div>
              );
            })
          )}
          

          <div className="card card-style  me-0 ms-0 rounded-0 gradient-blue">
            <div className="content pt-5 pb-5">
              <h1 className="mb-1 color-white font-700 text-center">گارانتی کاردون</h1>
              <p className="boxed-text-xl color-white opacity-80">
                کاردون برای تمامی برندهای معتبر ایرانی و خارجی گارانتی ارائه می‌دهد. از لوازم خانگی‌تان با هزینه‌ای به صرفه در
                برابر خرابی‌ها و حوادث احتمالی حفاظت کنید. برندهای سامسونگ، ال جی، سونی، بوش، دوو، AEG، کنوود و هر برند معتبر
                ایرانی و خارجی دیگری را می‌توانید با کاردون گارانتی کنید.
              </p>
              <a style={{ cursor: 'pointer' }} className="btn btn-s bg-white color-black font-700 btn-center-m">
                ثبت گارانتی محصول
              </a>
            </div>
          </div>
          <FooterCard footerMenuVisible={true} />
        </div> */}
    </>
  );
};

export default Main;
