import { APIURL_GET_FACTOR, APIURL_GET_SERVICES } from '@src/configs/apiConfig/apiUrls';
import useHttpRequest from '@src/hooks/useHttpRequest';
import { IFactorResultModel } from '@src/models/output/factor/IFactorResultModel';
import { IOutputResult } from '@src/models/output/IOutputResult';
import { ECostSource } from '@src/models/output/missionDetail/IInvoiceActionResultModel';
import { ITechnicians } from '@src/models/output/orderDetail/IOrderDetailListResultModel';
import { UtilsHelper } from '@src/utils/GeneralHelpers';
import { FunctionComponent, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Card, Spinner, UncontrolledTooltip } from 'reactstrap';
import { IInvoiceFactor } from '../../models/output/factor/IFactorResultModel';
import { useSelector } from 'react-redux';
import { RootStateType } from '@src/redux/Store';
import { useRef } from 'react';
import ReactToPrint from 'react-to-print';
import { IPageProps } from '@src/configs/routerConfig/IPageProps';
import { RWebShare } from 'react-web-share';

const Factor: FunctionComponent<IPageProps> = ({ title }) => {
  const userData = useSelector((state: RootStateType) => state.authentication.userData);
  const navigate = useNavigate();
  const search = useLocation().search;
  const requestDetailId = new URLSearchParams(search).get('requestDetailId');
  const technicianId = new URLSearchParams(search).get('technicianId');
  const httpRequest = useHttpRequest();

  const [factor, setFactor] = useState<IFactorResultModel>();
  const [loading, setLoading] = useState<boolean>(false);
  const factorRef = useRef(null);

  const GetFactor = () => {
    setLoading(true);
    httpRequest
      .getRequest<IOutputResult<IFactorResultModel>>(
        // `${APIURL_GET_FACTOR}?requestDetailId=${requestDetailId}&technicianId=${technicianId}`
        'http://127.0.0.1:2500/getFactor'
      )
      .then((result) => {
        setFactor(result.data.data);
        setLoading(false);
      });
  };

  const checkRole = (normalizedName: string) => {
    return userData?.roles ? userData?.roles.some((roleName) => roleName.normalizedName !== normalizedName) : false;
    // return false;
  };
  useEffect(() => {
    document.title = title;
  }, [title]);

  useEffect(() => {
    GetFactor();
    // CustomFunctions();
  }, []);
  return (
    <>
      <div id="page">
        <div className="page-content">
          <div ref={factorRef} style={{ direction: 'rtl' }}>
            <div className="page-title page-title-small">
              <h2>
                <a>
                  <i className="fa-regular fa-pen-to-square mx-2"></i>
                  صدور فاکتور
                </a>
              </h2>
            </div>
            <div className="card header-card shape-rounded" data-card-height="150">
              <div className="card-overlay bg-highlight opacity-95"></div>
              <div className="card-overlay dark-mode-tint"></div>
              <div className="card-bg preload-img" data-src="images/pictures/20s.jpg"></div>
            </div>

            <div className="card card-style bg-red-light p-4" style={{ marginTop: '100px' }}>
              <div className="d-flex justify-content-between ">
                <div>شماره درخواست : {factor?.requestNumber}</div>
                <div>{factor?.currentDateTime}</div>
              </div>
            </div>
            <div className="card card-style p-4">
              <div className="d-flex m-1">
                <div> نام مشتری : </div>
                <div>
                  {' '}
                  {factor?.consumer.firstName} {factor?.consumer.lastName}
                </div>
              </div>
              <div className="d-flex m-1">
                <div> کد ملی : </div>
                <div> {factor?.consumer.nationalCode}</div>
              </div>
              <div className="d-flex m-1">
                <div> نام تکنسین : </div>
                <div>
                  {' '}
                  {factor?.technician.firstName} {factor?.technician.lastName}
                </div>
              </div>
              <hr className="dashed"></hr>
              <div className="d-flex m-1">
                <div> آدرس: </div>
                <div> {factor?.consumer.address}</div>
              </div>
              <div className="d-flex m-1">
                <div> کد پستی : </div>
                <div> {factor?.consumer.postalCode}</div>
              </div>
            </div>
            {/* invoice */}
            <div className="card card-style p-4 ">
              <div className="justify-content-center d-flex">
                <h3 className="color-blue-dark">شرح اقدامات</h3>
              </div>
              <div className="m-2">
                {factor?.invoice &&
                  factor?.invoice.length > 0 &&
                  factor?.invoice.map((items: IInvoiceFactor, index: number) => {
                    return (
                      <>
                        <h4 className="color-red-dark text-decoration-underline">
                          {`${index + 1}. ${items.productName} / ${items.actionTitle} / ${items.serviceTypeTitle}`}
                        </h4>
                        <div className="d-flex m-1 justify-content-between">
                          <div> تعداد : </div>
                          <div>{items.count}</div>
                        </div>
                        <div className="d-flex m-1 justify-content-between">
                          <div> قیمت : </div>
                          <div>{UtilsHelper.threeDigitSeparator(items.unitPrice)}</div>
                        </div>
                        <div className="d-flex m-1 justify-content-between">
                          <div> جمع کل : </div>
                          <div>{UtilsHelper.threeDigitSeparator(items.totalPrice)}</div>
                        </div>
                        {checkRole('TECHNICIAN' || 'CONSUMER') && (
                          <>
                            <div className="d-flex m-1 justify-content-between">
                              <div> سهم تکنسین : </div>
                              <div>{UtilsHelper.threeDigitSeparator(items.technicianShare)}</div>
                            </div>
                            <div className="d-flex m-1 justify-content-between">
                              <div> سهم نماینده : </div>
                              <div>{UtilsHelper.threeDigitSeparator(items.agentShare)}</div>
                            </div>
                            <div className="d-flex m-1 justify-content-between">
                              <div> سهم کاردون : </div>
                              <div>{UtilsHelper.threeDigitSeparator(items.kardoonShare)}</div>
                            </div>
                          </>
                        )}
                      </>
                    );
                  })}

                <hr className="dashed" />
                <div className="d-flex m-1 justify-content-between">
                  <div> جمع کل اقدامات: </div>
                  <div className="color-green-dark">{UtilsHelper.threeDigitSeparator(factor?.totalPrice)}</div>
                </div>
                {checkRole('TECHNICIAN' || 'CONSUMER') && (
                  <>
                    <div className="d-flex m-1 justify-content-between">
                      <div> سهم تکنسین: </div>
                      <div className="color-green-dark"> {UtilsHelper.threeDigitSeparator(factor?.totalTechnicianShare)}</div>
                    </div>
                    <div className="d-flex m-1 justify-content-between">
                      <div> سهم نماینده: </div>
                      <div className="color-green-dark"> {UtilsHelper.threeDigitSeparator(factor?.totalAgentShare)}</div>
                    </div>
                    <div className="d-flex m-1 justify-content-between">
                      <div> سهم کاردون: </div>
                      <div className="color-green-dark"> {UtilsHelper.threeDigitSeparator(factor?.totalKardoonShare)}</div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-center align-items-center" style={{ height: '20px', cursor: 'pointer' }}>
            <ReactToPrint
              pageStyle={'@page {size: 90mm 200mm;}'}
              trigger={() => (
                <a
                  className="btn btn-m mt-4 mb-4 btn-full bg-red-dark rounded-sm text-uppercase font-900"
                  style={{ width: '90%' }}
                >
                  دانلود فاکتور
                </a>
              )}
              content={() => factorRef.current}
            />
            <RWebShare
              data={{
                text: `فاکتور پرداخت به شماره درخواست ${factor?.requestNumber}`,
                url: window.location.href,
                title: 'کاردون',
              }}
            >
              <i className="fa-sharp fa-solid fa-share-nodes" style={{ marginRight: '10px' }} />
            </RWebShare>
          </div>
        </div>
      </div>
    </>
  );
};

export default Factor;
