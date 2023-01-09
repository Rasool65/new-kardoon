import { APIURL_GET_CURRENT_CONSUMER_REQUEST, APIURL_GET_PREVIOUS_CONSUMER_REQUEST } from '@src/configs/apiConfig/apiUrls';
import useHttpRequest from '@src/hooks/useHttpRequest';
import Footer from '@src/layout/Footer';
import PrevHeader from '@src/layout/Headers/PrevHeader';
import { IOutputResult } from '@src/models/output/IOutputResult';
import { IEStatusId, IOrderListResultModel } from '@src/models/output/order/IOrderListResultModel';
import { RootStateType } from '@src/redux/Store';
import { DateHelper } from '@src/utils/dateHelper';
import { FunctionComponent, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Spinner } from 'reactstrap';
import { IPageProps } from '../../configs/routerConfig/IPageProps';
import { URL_ORDER_DETAIL } from '../../configs/urls';
import OrderLoading from './../../loading/orderLoading';

const Order: FunctionComponent<IPageProps> = (props) => {
  const color = useSelector((state: RootStateType) => state.theme.color);
  const navigate = useNavigate();
  const httpRequest = useHttpRequest();
  const [orderList, setOrderList] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [active, setActive] = useState<boolean>(false);

  const GetCurrentOrders = () => {
    setActive(true);
    setLoading(true);
    httpRequest.getRequest<IOutputResult<IOrderListResultModel[]>>(`${APIURL_GET_CURRENT_CONSUMER_REQUEST}`).then((result) => {
      setOrderList(result.data.data);
      setLoading(false);
    });
  };
  const GetPreviousOrders = () => {
    setActive(false);
    setLoading(true);
    httpRequest.getRequest<IOutputResult<IOrderListResultModel[]>>(`${APIURL_GET_PREVIOUS_CONSUMER_REQUEST}`).then((result) => {
      setOrderList(result.data.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    GetCurrentOrders();
  }, []);
  useEffect(() => {
    document.title = props.title;
  }, [props.title]);
  return (
    <>
      {loading ? (
        <OrderLoading />
      ) : (
        <div className="page-content order-page mb-5">
          <PrevHeader />
          <Footer activePage={1} />
          <div className="container">
            <div className="page-tabs">
              <button className={`primary-btn m-3 w-50 ${active && 'active'}`} onClick={GetCurrentOrders}>
                سفارشات جاری
              </button>
              <button className={`primary-btn m-3 w-50 float-end ${!active && 'active'}`} onClick={GetPreviousOrders}>
                سفارشات قبلی
              </button>
            </div>

            <div className="row page-tabs-body">
              {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '120px' }}>
                  <Spinner style={{ width: '5rem', height: '5rem' }} />
                </div>
              ) : (
                orderList &&
                orderList.length > 0 &&
                orderList.map((requests: IOrderListResultModel, index: number) => {
                  return (
                    <>
                      <div className="col-md-6">
                        <div
                          className="mission-card pointer"
                          onClick={() => navigate(`${URL_ORDER_DETAIL}?id=${requests.requestDetailId}`)}
                        >
                          <div className="mission-item ">
                            <p className="mission-title">{requests.productCategoryTitle + '-' + requests.serviceTypeTitle}</p>
                            <p className="mission-amount">
                              {requests.presenceShift?.slice(0, 3)} {DateHelper.isoDateTopersian(requests.presenceDateTime)}
                            </p>
                            {requests.isUrgent ? <span className="sos-box">SOS</span> : ''}
                            <img
                              className="seemore-btn"
                              src={require(`@src/scss/images/icons/${color}-info.svg`)}
                              alt="VectorI344"
                            />
                          </div>
                          <div className="mission-item">
                            <p className="mission-info">
                              تکنسین:{' '}
                              {requests.technicianInfoList &&
                                requests.technicianInfoList.length > 0 &&
                                requests.technicianInfoList.map((techFullName: string, index: number) => {
                                  return (
                                    <>
                                      <span>
                                        {index + 1}-{techFullName}
                                      </span>
                                    </>
                                  );
                                })}
                            </p>
                            <div className="mission-status-box">
                              {/* <p className="mission-amount">وضعیت:</p> */}
                              <span className={IEStatusId[requests.statusId!]}>{requests.statusTitle}</span>
                            </div>
                          </div>
                          <div className="d-flex justify-content-between">
                            <p className="mission-info">
                              شماره درخواست: <span>{requests.requestNumber}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Order;
