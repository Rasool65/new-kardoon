import LoadingComponent from '@src/components/spinner/LoadingComponent';
import {
  APIURL_GET_CURRENT_CONSUMER_REQUEST,
  APIURL_GET_PREVIOUS_CONSUMER_REQUEST,
  APIURL_GET_SERVICES,
} from '@src/configs/apiConfig/apiUrls';
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
import { Button, Spinner } from 'reactstrap';
import { IPageProps } from '../../configs/routerConfig/IPageProps';
import { URL_ORDER_DETAIL, URL_REQUEST_DETAIL } from '../../configs/urls';

const Order: FunctionComponent<IPageProps> = (props) => {
  const color = useSelector((state: RootStateType) => state.theme.color);
  const navigate = useNavigate();
  const httpRequest = useHttpRequest();
  const [orderList, setOrderList] = useState<any>([]);
  const userId = useSelector((state: RootStateType) => state.authentication.userData?.userId);
  const [loading, setLoading] = useState<boolean>(false);

  const GetCurrentOrders = () => {
    setLoading(true);
    httpRequest.getRequest<IOutputResult<IOrderListResultModel[]>>(`${APIURL_GET_CURRENT_CONSUMER_REQUEST}`).then((result) => {
      setOrderList(result.data.data);
      setLoading(false);
    });
  };
  const GetPreviousOrders = () => {
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
      <div className="page-content order-page">
        <PrevHeader />
        <Footer activePage={1} />
        <div className="container">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-around',
            }}
          >
            <button className="primary-btn m-3 w-50" onClick={GetCurrentOrders}>
              سفارشات جاری
            </button>
            <button className="primary-btn m-3 w-50 float-end" onClick={GetPreviousOrders}>
              سفارشات قبلی
            </button>
          </div>

          <div className="row">
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
                          <p className="mission-title">{requests.requestDescription}</p>
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
    </>
  );
};

export default Order;

{
  /* <div className="col-12 col-md-6 col-lg-4 p-2">
<div className="card h-100">
  <button className="btn" data-bs-toggle="collapse" data-bs-target={`#collapse${index}`}>
    <div style={{ marginBottom: '20px' }}>
      شماره درخواست : <div>{requests.requestNumber}</div>
      <div style={{ marginRight: 'auto' }}>{DateHelper.isoDateTopersian(requests.presenceTime)}</div>
      {requests.isUrgent ? (
        <div style={{ border: '2px solid red', color: 'red', marginRight: '10px' }}>مراجعه فوری</div>
      ) : (
        ''
      )}
    </div>

    {requests.requestDetail &&
      requests.requestDetail.length > 0 &&
      requests.requestDetail.map((requestDetail: IOrderRequestDetail, index: number) => {
        return (
          <div style={{ marginBottom: '5px' }}>
            <div className="col-6">
              <div>{index + 1}-</div>
              {requestDetail.requestDescription}
            </div>
            <div className="col-5">
              {/* <span className="bg-success">{requestDetail.statusTitle}</span> 
              <span className={IEStatusId[requestDetail.statusId!]}>{requestDetail.statusTitle}</span>
            </div>
          </div>
        );
      })}

    <i className="fa fa-chevron-down font-10 accordion-icon"></i>
  </button>
  <div
    style={{ backgroundColor: 'white' }}
    id={`collapse${index}`}
    className="collapse bg-theme custom-accordion-open"
    data-bs-parent="#accordion-2"
  >
    <Button
      onClick={() => navigate(`${URL_ORDER_DETAIL}?id=${requests.requestNumber}`)}
      style={{ width: 'inherit' }}
    >
      جزئیات بیشتر
    </Button>
  </div>
</div>
</div> */
}
