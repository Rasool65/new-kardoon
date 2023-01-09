import { APIURL_GET_INVOICE, APIURL_GET_SERVICES } from '@src/configs/apiConfig/apiUrls';
import useHttpRequest from '@src/hooks/useHttpRequest';
import { IFactorResultModel, IInvoiceOrderDetail } from '@src/models/output/factor/IFactorResultModel';
import { IOutputResult } from '@src/models/output/IOutputResult';
import { UtilsHelper } from '@src/utils/GeneralHelpers';
import { FunctionComponent, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootStateType } from '@src/redux/Store';
import { useRef } from 'react';
import ReactToPrint from 'react-to-print';
import { IPageProps } from '@src/configs/routerConfig/IPageProps';
import { RWebShare } from 'react-web-share';
import { DateHelper } from '@src/utils/dateHelper';
import PrevHeader from '@src/layout/Headers/PrevHeader';

const Invoice: FunctionComponent<IPageProps> = ({ title }) => {
  const userData = useSelector((state: RootStateType) => state.authentication.userData);
  const navigate = useNavigate();
  const search = useLocation().search;
  const { id } = useParams();
  const httpRequest = useHttpRequest();

  const [factor, setFactor] = useState<IFactorResultModel>();
  const [loading, setLoading] = useState<boolean>(false);
  const factorRef = useRef(null);

  const GetFactor = () => {
    setLoading(true);
    httpRequest.getRequest<IOutputResult<IFactorResultModel>>(`${APIURL_GET_INVOICE}?InvliceId=${id}`).then((result) => {
      setFactor(result.data.data);
      setLoading(false);
    });
  };

  const checkRole = (normalizedName: string) => {
    return userData?.roles ? userData?.roles.some((roleName) => roleName.normalizedName === normalizedName) : false;
  };

  useEffect(() => {
    document.title = title;
  }, [title]);

  useEffect(() => {
    GetFactor();
  }, []);
  return (
    <>
      <PrevHeader />
      <div className="receipt-page">
        <div className="container">
          <div ref={factorRef} style={{ direction: 'rtl' }}>
            <div className="customer-data">
              <div className="factor-paper">
                <div className="technition-receipt-box">
                  <div className="factor-header">
                    <p className="item-subject">
                      شماره درخواست: <span className="item-label">{factor?.requestNumber}</span>
                    </p>
                    <p className="item-label">{DateHelper.isoDateTopersian(factor?.presenceTime)}</p>
                  </div>
                  <div className="factor-body">
                    <p className="item-name">
                      نام مشتری: <span className="item-label">{factor?.consumerFullName}</span>
                    </p>
                    <p className="item-name">
                      کد ملی : <span className="item-label">{factor?.nationalCode}</span>
                    </p>
                    <p className="item-name">
                      نام تکنسین: <span className="item-label">{factor?.technicianFullName}</span>
                    </p>
                    <div className="dashed-divider"></div>
                    <p className="item-name">
                      آدرس:
                      <span className="item-label">{factor?.address}</span>
                    </p>
                    <p className="item-name">
                      کدپستی: <span className="item-label">{factor?.zipCode}</span>
                    </p>
                  </div>
                  <div className="receipt-points">
                    <img src={require(`@src/scss/images/icons/darkPoints.svg`)} />
                  </div>
                </div>
              </div>
            </div>
            <div className="activities-data">
              <div className="w-100">
                <div className="technition-activities-box">
                  <div className="factor-paper">
                    <div className="factor-header">
                      <h5 className="receipt-title">شرح اقدامات</h5>
                    </div>
                    <div className="factor-body">
                      {factor?.orderDetails &&
                        factor.orderDetails.length > 0 &&
                        factor.orderDetails.map((item: IInvoiceOrderDetail, index: number) => {
                          return (
                            <>
                              <div className="receipt-part">
                                {index + 1}-{item.actionName}
                              </div>
                              <div className="activity-item">
                                <p className="activity-name">تعداد:</p>
                                <p className="activity-amout">{item.count}</p>
                              </div>

                              <div className="activity-item">
                                <p className="activity-name">قیمت:</p>
                                <p className="activity-amout">{UtilsHelper.threeDigitSeparator(item.price)}</p>
                              </div>

                              <div className="activity-item">
                                <p className="activity-name">جمع کل:</p>
                                <p className="activity-amout">{UtilsHelper.threeDigitSeparator(item.totalPrice)}</p>
                              </div>
                              {checkRole('TECHNICIAN') && (
                                <>
                                  <div className="activity-item">
                                    <p className="activity-name">سهم تکنسین:</p>
                                    <p className="activity-amout">{UtilsHelper.threeDigitSeparator(item.technicianAmount)}</p>
                                  </div>

                                  <div className="activity-item">
                                    <p className="activity-name">سهم نماینده:</p>
                                    <p className="activity-amout">{UtilsHelper.threeDigitSeparator(item.agentAmount)}</p>
                                  </div>

                                  <div className="activity-item">
                                    <p className="activity-name">سهم کاردون:</p>
                                    <p className="activity-amout">{UtilsHelper.threeDigitSeparator(item.kardoonAmount)}</p>
                                  </div>
                                </>
                              )}

                              <div className="dashed-divider mb-3"></div>
                            </>
                          );
                        })}

                      <div className="activity-item">
                        <p className="activity-name dark"> جمع کل اقدامات:</p>
                        <p className="activity-overall">{UtilsHelper.threeDigitSeparator(factor?.totalAmount)}</p>
                      </div>

                      {checkRole('TECHNICIAN') && (
                        <>
                          <div className="activity-item">
                            <p className="activity-name dark"> سهم تکنسین:</p>
                            <p className="activity-overall">{UtilsHelper.threeDigitSeparator(factor?.totalTechnicianAmount)}</p>
                          </div>
                          <div className="activity-item">
                            <p className="activity-name dark"> سهم نماینده :</p>
                            <p className="activity-overall">{UtilsHelper.threeDigitSeparator(factor?.totalAgentAmount)}</p>
                          </div>
                          <div className="activity-item">
                            <p className="activity-name dark"> سهم کاردون:</p>
                            <p className="activity-overall">{UtilsHelper.threeDigitSeparator(factor?.totalKardoonAmount)}</p>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="receipt-points">
                      <img src={require(`@src/scss/images/icons/darkPoints.svg`)} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="">
            <ReactToPrint
              pageStyle={'@page {size: 90mm 200mm;}'}
              trigger={() => <button className="primary-btn">دانلود فاکتور</button>}
              content={() => factorRef.current}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Invoice;
