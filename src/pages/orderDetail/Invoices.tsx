import { RootStateType } from '@src/redux/Store';
import { FunctionComponent, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { IInvoices, IRequestDetailInfo } from '@src/models/output/orderDetail/IOrderDetailListResultModel';
import { UtilsHelper } from '@src/utils/GeneralHelpers';
import { ECostSource } from '@src/models/output/missionDetail/IInvoiceActionResultModel';
import useHttpRequest from '@src/hooks/useHttpRequest';
import { IOutputResult } from '@src/models/output/IOutputResult';
import { useToast } from '@src/hooks/useToast';
import LoadingComponent from '@src/components/spinner/LoadingComponent';
import ShowModalCheckout from './ShowModalCheckout';

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
  const toast = useToast();

  const handleShowModal = () => {
    setPayTypeModalVisible(!payTypeModalVisible);
  };

  //todo const InvoiceIssuance = () => {
  //   setIssuanceLoading(true);
  //   const body = {
  //     requestDetailId,
  //     consumerPaymentAmount: 0,
  //   };
  //   !issuanceLoading &&
  //     httpRequest
  //       .postRequest<IOutputResult<any>>(`${'APIURL_POST_INVOICE_CHECKOUT_ALL'}`, body)
  //       .then((result) => {
  //         toast.showSuccess(result.data.message);
  //         getOrder();
  //         setIssuanceLoading(false);
  //       })
  //       .finally(() => {
  //         setIssuanceLoading(false);
  //       });
  // };

  const CheckOut = (peymentId: number) => {};
  return (
    <>
      <div className="container mt-3">
        <table className="order-details-table2">
          <thead>
            <tr>
              <th scope="col">اقدامات</th>
              <th scope="col">
                مبلغ <span>(ریال)</span>
              </th>
              <th scope="col">تسویه</th>
              <th scope="col">نوع پرداخت</th>
            </tr>
          </thead>
          {loading ? (
            <div className="invoice-table-loading">
              <LoadingComponent />
            </div>
          ) : (
            <tbody>
              {invoices &&
                invoices.length > 0 &&
                invoices.map((invoice: IInvoices, index: number) => {
                  return (
                    <>
                      <tr className={`${!invoice.settlementStatus && 'unpaid'}`}>
                        <td className="od-name">
                          {invoice.serviceTypeTitle}/{invoice.productName}
                        </td>
                        <td className="od-price">
                          <div>{UtilsHelper.threeDigitSeparator(invoice.priceAfterDiscount)}</div>
                          {invoice.discount && <span>{UtilsHelper.threeDigitSeparator(invoice.price)}</span>}
                        </td>
                        <td className="od-icon">
                          {invoice.settlementStatus ? (
                            <img src={require(`@src/scss/images/icons/${color}-checked.svg`)} alt="" />
                          ) : (
                            <img src={require(`@src/scss/images/icons/hourglass.svg`)} alt="" />
                          )}
                        </td>
                        {invoice.settlementStatus ? (
                          <td className="od-status">{`${invoice.paymentType || 'نامشخص'}`}</td>
                        ) : invoice.costSource == 1 ? (
                          <td className="od-status">{ECostSource[invoice.costSource]}</td>
                        ) : (
                          <td className="od-status">
                            <button
                              onClick={() => {
                                handleShowModal();
                                CheckOut(invoice.paymentId);
                              }}
                              className="cash-btn green-btn"
                            >
                              <img src={require(`@src/scss/images/icons/${color}-cash.svg`)} className="cash-icon" />
                              پرداخت
                            </button>
                          </td>
                        )}
                      </tr>
                    </>
                  );
                })}
              {/* <tr>
                <td className="od-name">تعمیر/شارژ گاز</td>
                <td className="od-price">
                  <div>8.000.000</div>
                  <span>10.000.000</span>
                </td>
                <td className="od-icon">
                  <img src={require(`@src/scss/images/icons/${color}-checked.svg`)} alt="" />
                </td>
                <td className="od-status">نقدی</td>
              </tr>
              <tr>
                <td className="od-name">تعمیر/شارژ گاز</td>
                <td className="od-price">
                  <div>8.000.000</div>
                  <span>10.000.000</span>
                </td>
                <td className="od-icon">
                  <img src={require(`@src/scss/images/icons/hourglass.svg`)} alt="" />
                </td>
                <td className="od-status">گارانتی</td>
              </tr>
              <tr>
                <td className="od-name">تعمیر/شارژ گاز</td>
                <td className="od-price">
                  <div>8.000.000</div>
                  <span>10.000.000</span>
                </td>
                <td className="od-icon">
                  <img src={require(`@src/scss/images/icons/hourglass.svg`)} alt="" />
                </td>
                <td className="od-status">
                  <button
                    onClick={() => {
                      handleShowModal();
                    }}
                    className="cash-btn green-btn"
                  >
                    <img src={require(`@src/scss/images/icons/${color}-cash.svg`)} className="cash-icon" />
                    پرداخت
                  </button>
                </td>
              </tr>
              <tr className="unpaid">
                <td className="od-name">تعمیر/شارژ گاز</td>
                <td className="od-price">
                  <span>10.000.000</span>
                </td>
                <td className="od-icon">
                  <img src={require(`@src/scss/images/icons/${color}-close.svg`)} alt="" />
                </td>
                <td className="od-status">برگشت از خرید</td>
              </tr> */}
            </tbody>
          )}
        </table>
        <button
          onClick={() => {
            handleShowModal();
          }}
          className="green-btn btn  w-100"
        >
          پرداخت صورتحساب{' '}
        </button>
        <ShowModalCheckout checkout={undefined} payTypeModalVisible={payTypeModalVisible} closeModal={handleShowModal} />
      </div>
    </>
  );
};

export default Invoices;
