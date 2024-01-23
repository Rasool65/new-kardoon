import Num2persian from 'num2persian';
import IPageProps from '@src/configs/routerConfig/IPageProps';
import { FunctionComponent, useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import useHttpRequest from '@src/hooks/useHttpRequest';
import { IOutputResult } from '@src/models/output/IOutputResult';
import {
  APIURL_GET_INVOICE,
  APIURL_GET_INVOICE_ISSUANCE,
  APIURL_POST_INVOICE_ONLINE_CHECKOUT,
} from '@src/configs/apiConfig/apiUrls';
import { BASE_URL } from '@src/configs/apiConfig/baseUrl';
import { URL_CALLBACK } from '@src/configs/urls';
import { useToast } from '@src/hooks/useToast';
import { UtilsHelper } from '@src/utils/GeneralHelpers';
import LoadingComponent from '@src/components/spinner/LoadingComponent';
import {
  IHomeWarrantyOrderDetail,
  IInvoiceHomeWarrantyResultModel,
} from '@src/models/output/warranty/IInvoiceHomeWarrantyResultModel';

const HomeWarrantyInfo: FunctionComponent<IPageProps> = () => {
  const { InvliceId, invoice } = useParams();
  const toast = useToast();
  const httpRequest = useHttpRequest();
  const [loading, setLoading] = useState<boolean>(false);
  const [invoiceIssuance, setInvoiceIssuance] = useState<IInvoiceHomeWarrantyResultModel>();
  let totalPrice: number = 0;

  const GetInvoiceIssuance = () => {
    setLoading(true);
    httpRequest
      .getRequest<IOutputResult<IInvoiceHomeWarrantyResultModel>>(`${APIURL_GET_INVOICE}?InvliceId=${InvliceId}`)
      .then((result) => {
        setInvoiceIssuance(result.data.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const Checkout = () => {
    setLoading(true);
    const body = {
      invoiceIds: [Number(invoice)],
      amount: totalPrice,
      callBackUrl: BASE_URL + URL_CALLBACK,
      destinationUrl: BASE_URL,
    };
    httpRequest
      .postRequest<IOutputResult<any>>(`${APIURL_POST_INVOICE_ONLINE_CHECKOUT}`, body)
      .then((result) => {
        window.open(result.data.data, '_self');
        result.data.isSuccess ? toast.showSuccess(result.data.message) : toast.showError(result.data.message);
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    GetInvoiceIssuance();
  }, []);

  return (
    <>
      <div className="container">
        <div className="card p-4 mt-4">
          <h4 className="srvice-title">اطلاعات فاکتور </h4>
          <div className="row">
            <div className="col-6">
              نام مشتری : <span>{invoiceIssuance?.consumerFullName}</span>
            </div>
            <div className="col-6 text-left">
              {/* شماره فاکتور : <span>{invoiceIssuance?.invoiceId}</span> */}
              شماره فاکتور : <span>پرداخت نقدی</span>
            </div>
            <div className="col-12 pb-4">
              <hr className="c-gray" />
              <div className="running-items row">
                {invoiceIssuance?.orderDetails &&
                  invoiceIssuance.orderDetails.length > 0 &&
                  invoiceIssuance.orderDetails.map((orderDetail: IHomeWarrantyOrderDetail, index: number) => {
                    totalPrice += orderDetail.price!;
                    return (
                      <>
                        <div className="col-12  col-lg-6 mb-2">
                          <div className="running-item">
                            <div className="d-flex align-items-center w-100">
                              <div className="space-nowrap">{index + 1}-</div>
                              <div className="description">{orderDetail.actionName}</div>
                              <img src={require(`@src/scss/images/icons/blue-message.svg`)} className="info-btn" />
                            </div>
                            <div className="d-flex align-items-center mt-2 w-100">
                              <img src={require(`@src/scss/images/icons/hourglass.svg`)} className="waiting-glass" />
                              مبلغ : {UtilsHelper.threeDigitSeparator(orderDetail.price)}{' '}
                              <span className="rial ml-auto">ریال</span>
                              <div className="">
                                {/* <div>{orderDetail.checkOutStatusTitle}</div> */}
                                <div>نقدی</div>
                              </div>
                            </div>
                            <div className="mr-l-auto align-content-center"></div>
                            <div className="d-flex flex-wrap justify-content-start"></div>
                          </div>
                        </div>
                      </>
                    );
                  })}
              </div>
            </div>
            <div className="col-12 text-center">
              <div className="total-price">
                <div>مجموع :</div>
                <div className="total-number wallet-amount debtor-text">{UtilsHelper.threeDigitSeparator(totalPrice)}</div>
                <div className="total-text">{Num2persian(totalPrice / 10)} تومان</div>
              </div>
            </div>
            <div className="col-12 text-center mt-3">
              {/* <button
                onClick={() => {
                  Checkout();
                }}
                className="btn-info btn btn-secondary mt-3 btn-technician-action btn btn-secondary"
              >
                {loading ? <LoadingComponent /> : 'پرداخت'}
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomeWarrantyInfo;
