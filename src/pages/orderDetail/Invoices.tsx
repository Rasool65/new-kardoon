import { RootStateType } from '@src/redux/Store';
import { FunctionComponent, useRef, useState, useEffect, useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';
import { IDetailInvoiceList, IInvoices, IRequestDetailInfo } from '@src/models/output/orderDetail/IOrderDetailListResultModel';
import { UtilsHelper } from '@src/utils/GeneralHelpers';
import useHttpRequest from '@src/hooks/useHttpRequest';
import { IOutputResult } from '@src/models/output/IOutputResult';
import { useToast } from '@src/hooks/useToast';
import LoadingComponent from '@src/components/spinner/LoadingComponent';
import ShowModalCheckout from './ShowModalCheckout';
import { Input } from 'reactstrap';
import { APIURL_POST_INVOICE_ONLINE_CHECKOUT, APIURL_POST_INVOICE_WALLET_CHECKOUT } from '@src/configs/apiConfig/apiUrls';
import { BASE_URL } from '@src/configs/apiConfig/baseUrl';
import { URL_CALLBACK } from '@src/configs/urls';

interface OrderDetailProps {
  invoices: IInvoices[];
  getOrder: any;
  requestDetailId: string;
  loading: boolean;
}

const Invoices: FunctionComponent<OrderDetailProps> = ({ invoices, requestDetailId, getOrder, loading }) => {
  const color = useSelector((state: RootStateType) => state.theme.color);
  const httpRequest = useHttpRequest();
  const [issuanceLoading, setIssuanceLoading] = useState<boolean>(false);
  const [payTypeModalVisible, setPayTypeModalVisible] = useState<boolean>(false);
  const [invoiceId, setInvoiceId] = useState<number[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const inputRef = useRef<any>(null);
  const toast = useToast();

  const handleShowModal = () => {
    setPayTypeModalVisible(!payTypeModalVisible);
  };

  const HandleCheckedInvoice = (factorId: number, price: number) => {
    invoiceId.includes(factorId)
      ? (setInvoiceId([...invoiceId.slice(0, invoiceId.indexOf(factorId)), ...invoiceId.slice(invoiceId.indexOf(factorId) + 1)]),
        setTotalAmount(totalAmount - price))
      : (setInvoiceId([...invoiceId, factorId]), setTotalAmount(totalAmount + price));
  };

  const ReduceFromWallet = () => {
    setIssuanceLoading(true);
    const body = {
      invoiceIds: invoiceId,
      amount: totalAmount,
    };
    !issuanceLoading &&
      httpRequest
        .postRequest<IOutputResult<any>>(`${APIURL_POST_INVOICE_WALLET_CHECKOUT}`, body)
        .then((result) => {
          result.data.isSuccess ? toast.showSuccess(result.data.message) : toast.showError(result.data.message);
          handleShowModal();
          getOrder();
          setIssuanceLoading(false);
        })
        .finally(() => {
          setIssuanceLoading(false);
        });
  };

  const ReduceFromBank = (amount: number) => {
    setIssuanceLoading(true);
    const body = {
      invoiceIds: invoiceId,
      amount,
      callBackUrl: BASE_URL + URL_CALLBACK,
      destinationUrl: window.location.href,
    };
    !issuanceLoading &&
      httpRequest
        .postRequest<IOutputResult<any>>(`${APIURL_POST_INVOICE_ONLINE_CHECKOUT}`, body)
        .then((result) => {
          window.open(result.data.data, '_self');
          result.data.isSuccess ? toast.showSuccess(result.data.message) : toast.showError(result.data.message);
          handleShowModal();
          getOrder();
          setIssuanceLoading(false);
        })
        .finally(() => {
          setIssuanceLoading(false);
        });
  };

  const InvoiceIssuance = (amount: number) => {
    // اگر منفی بود مبلغ قابل پرداخت رو بفرست به ای پی آی جدید
    amount <= 0 ? ReduceFromWallet() : ReduceFromBank(amount);
  };

  useLayoutEffect(() => {
    inputRef?.current?.props.onClick();
  }, []);

  return (
    <>
      <div className="container mb-5">
        <div className="order-details-factor p-4 mx-8 page-tabs-body">
          <table className="order-details-table2">
            <thead>
              <tr>
                <th scope="col">اقدامات</th>
                <th scope="col">
                  مبلغ <span>(ریال)</span>
                </th>
                <th scope="col">تسویه</th>
                <th scope="col">وضعیت</th>
              </tr>
            </thead>
            {loading ? (
              <div className="invoice-table-loading">
                <LoadingComponent />
              </div>
            ) : (
              invoices &&
              invoices.length > 0 &&
              invoices.map((invoice: IInvoices, index: number) => {
                return (
                  <>
                    <tbody>
                      {invoice.detailList &&
                        invoice.detailList.length > 0 &&
                        invoice.detailList.map((action: IDetailInvoiceList, index: number) => {
                          return (
                            <>
                              <tr className={`${!action.settlementStatus && 'unpaid'}`}>
                                <td className="od-name">{action.actionTitle}</td>
                                {/* {action.serviceTypeTitle}/{action.productName} */}
                                <td className="od-price">
                                  <div>{action.priceAfterDiscount}</div>
                                  {action.discount && <span>{action.price}</span>}
                                </td>
                                <td className="od-icon">
                                  {action.settlementStatus ? (
                                    <img src={require(`@src/scss/images/icons/${color}-checked.svg`)} alt="" />
                                  ) : (
                                    <img src={require(`@src/scss/images/icons/hourglass.svg`)} alt="" />
                                  )}
                                </td>
                                <td className="od-status ">{action.status}</td>
                              </tr>
                            </>
                          );
                        })}

                      <tr>
                        <td className="total-price-td" colSpan={4}>
                          <div className="total-prices select-time">
                            <Input
                              defaultChecked
                              ref={inputRef}
                              type="checkbox"
                              className="table-chacked form-check-input ml-2"
                              onClick={() => {
                                HandleCheckedInvoice(invoice.invoiceId!, invoice.totalPaymentAmountAfterDiscount!);
                              }}
                            />
                            <div className="total-title">جمع مبلغ فاکتور</div>
                            <div className="mr-auto od-price">
                              {UtilsHelper.threeDigitSeparator(invoice.totalPaymentAmountAfterDiscount)}
                              {invoice.discount && <span>{UtilsHelper.threeDigitSeparator(invoice.totalPaymentAmount)}</span>}
                            </div>
                            <span className="rial">ریال</span>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                    <br />
                  </>
                );
              })
            )}
          </table>
          {totalAmount > 0 && (
            <button
              onClick={() => {
                handleShowModal();
              }}
              className="green-btn btn  w-100 mb-5"
            >
              پرداخت صورتحساب به مبلغ {UtilsHelper.threeDigitSeparator(totalAmount)}
            </button>
          )}
          <ShowModalCheckout
            loading={issuanceLoading}
            totalAmount={totalAmount}
            checkout={(amount: number) => InvoiceIssuance(amount)}
            payTypeModalVisible={payTypeModalVisible}
            closeModal={handleShowModal}
          />
        </div>
      </div>
    </>
  );
};

export default Invoices;
