import useHttpRequest, { RequestDataType } from '@src/hooks/useHttpRequest';
import Header from '@src/layout/Headers/Header';
import { IGetHomeWarrantyResultModel } from '@src/models/output/warranty/IGetHomeWarrantyResultModel';
import { RootStateType } from '@src/redux/Store';
import { UtilsHelper } from '@src/utils/GeneralHelpers';
import { FunctionComponent, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Spinner, UncontrolledTooltip } from 'reactstrap';
import { IPageProps } from '@src/configs/routerConfig/IPageProps';
import { IOutputResult } from '@src/models/output/IOutputResult';
import { useToast } from '@src/hooks/useToast';
import type { JSONSchema7 } from 'json-schema';
import Form, { ISubmitEvent } from '@rjsf/core';
import { generatePath, useLocation, useNavigate } from 'react-router-dom';
import {
  APIURL_DELETE_ACTION,
  APIURL_GET_HOMEWARRANTY_PRODUCT,
  APIURL_GET_TECHNICIAN_INVOICE,
  APIURL_POST_ADD_CONTROL_HOME_WARRANTY,
  APIURL_POST_CALC_WARRANTY_ORDER_INFO,
  APIURL_POST_ORDER_INVOICE_ISSUANCE,
  APIURL_POST_TECHNICIAN_INVOICE_CHECKOUT_LIST,
} from '@src/configs/apiConfig/apiUrls';
import { IHomeWarrantyProduct } from '@src/models/output/warranty/IHomeWarrantyProduct';
import * as uuid from 'uuid';
import {
  ICalculationsHomeWarrantyOrderPrice,
  IGetHomeWarrantyOrderInfoResultModel,
} from '@src/models/output/warranty/IHomeWarrantyOrdersModelResult';
import {
  ECostSource,
  IFiles,
  IInvoiceActionList,
  IInvoiceActionResultModel,
} from '@src/models/output/missionDetail/IInvoiceActionResultModel';
import { RWebShare } from 'react-web-share';
import { BASE_URL } from '@src/configs/apiConfig/baseUrl';
import { URL_INVOICE_SHARE } from '@src/configs/urls';
import LoadingComponent from '@src/components/spinner/LoadingComponent';
import RemoveConfirmModal from '../technicianMissionDetail/technicianAction/RemoveConfirmModal';
import ShowImageModal from '@src/components/showImageModal/ShowImageModal';
import ConfirmModal from '../technicianMissionDetail/technicianAction/ConfirmModal';

interface IPayment {
  paymentId: number;
  consumerPaymentAmount: number;
}

const Warranty: FunctionComponent<IPageProps> = ({ title }) => {
  const toast = useToast();
  const navigate = useNavigate();
  const color = useSelector((state: RootStateType) => state.theme.color);
  const userData = useSelector((state: RootStateType) => state.authentication.userData);
  const [loading, setLoading] = useState<boolean>(false);
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const [btnDisabled, setBtnDisabled] = useState<boolean>(true);
  const [homeWarranties, setHomeWarranties] = useState<IGetHomeWarrantyResultModel[]>();
  const { state }: any = useLocation();
  const [calcResult, setCalcResult] = useState<ICalculationsHomeWarrantyOrderPrice>();
  const httpRequest = useHttpRequest();
  const [payments] = useState<IPayment[]>([]);
  const [paymentId, setPaymentId] = useState<number>();
  const [checkoutLoading, setCheckoutLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>();
  const buttonRef = useRef<any>([]);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const formsRef = useRef<any>([]);
  const [displayImage, setDisplayImage] = useState<boolean>(false);
  const [products, setProducts] = useState<IHomeWarrantyProduct[]>([]);
  const [productBeforCalc, setProductBeforCalc] = useState<IProductCalc[]>([]);
  const [invoice, setInvoice] = useState<IInvoiceActionResultModel>();
  const [btnIssuance, setBtnIssuance] = useState<boolean>(false);
  const [addDisabled, setAddDisabled] = useState<boolean>(false);
  const [confirmRemoveModalVisible, setConfirmRemoveModalVisible] = useState<boolean>(false);
  const [totalConsumerPayment, setTotalConsumerPayment] = useState<number>(0);
  const [orderId, setOrderId] = useState<number>();
  const [imageSrc, setImageSrc] = useState<string>();

  interface IProductCalc {
    id: string;
    productId: number;
    activeWarranty: boolean;
    estimatedValue: number;
    count: number;
  }

  const config = {
    onUploadProgress: (progressEvent: any) => setProgress(Math.round((100 * progressEvent.loaded) / progressEvent.total)),
  };
  const handleShowModal = () => {
    setShowConfirmModal(!showConfirmModal);
  };
  const GetFormSchema = () => {
    setLoading(true);
    httpRequest
      .getRequest<IOutputResult<IGetHomeWarrantyResultModel[]>>(
        // 'http://127.0.0.1:2500/getData'
        `${APIURL_GET_HOMEWARRANTY_PRODUCT}?requestDetailId=${state.requestDetailId}`
      )
      .then((result) => {
        setHomeWarranties(result.data.data);
        setLoading(false);
      });
  };

  const handleRemove = (id: string) => {
    const updateProduct = products.filter((value) => value.id !== id);
    const updateProductBeforCalc = productBeforCalc.filter((value) => value.id !== id);
    setProducts(updateProduct);
    setProductBeforCalc(updateProductBeforCalc);

    getCalculation(updateProductBeforCalc);
  };

  const getCalculation = (updateProductBeforCalc: any) => {
    setLoading(true);
    httpRequest
      .postRequest<IOutputResult<IGetHomeWarrantyOrderInfoResultModel>>(
        APIURL_POST_CALC_WARRANTY_ORDER_INFO,
        updateProductBeforCalc
      )
      .then((result) => {
        setLoading(false);
        if (!result.data.isSuccess) return toast.showError(result.data.message);
        setCalcResult(result.data.data.calculations);
      });
  };

  useEffect(() => {
    document.title = title;
  }, [title]);

  const onSubmit = (
    data: ISubmitEvent<unknown>,
    actionId: number,
    productName: string,
    productId: number,
    productCode: string
  ) => {
    const guid = uuid.v4();
    setLoading(true);
    const newProductBeforCalc = {
      id: guid,
      productId,
      productCode,
      //@ts-ignore
      estimatedValue: data.estimatedValue,
      //@ts-ignore
      activeWarranty: data.activeWarranty ?? false,
      count: 1,
    };
    setProductBeforCalc([...productBeforCalc, newProductBeforCalc]);
    httpRequest
      .postRequest<IOutputResult<IGetHomeWarrantyOrderInfoResultModel>>(
        APIURL_POST_CALC_WARRANTY_ORDER_INFO,
        productBeforCalc.concat(newProductBeforCalc)
      )
      .then((result) => {
        setLoading(false);
        if (!result.data.isSuccess) return toast.showError(result.data.message);
        const body: IHomeWarrantyProduct = {
          price: result.data.data.products[result.data.data.products.length - 1].price,
          actionId,
          id: guid,
          productId,
          productCode,
          //@ts-ignore
          estimatedValue: data.estimatedValue,
          //@ts-ignore
          activeWarranty: data.activeWarranty,
          title: productName,
          formGen: JSON.stringify(data),
          discountAmount: 0, //priceAfterReduction_Addition
          costSource: 0,
          count: 1,
        };
        setProducts([...products, body]);
        setCalcResult(result.data.data.calculations);
      });
  };

  const AddHomeWarranty = () => {
    if (products.length < 3) return toast.showWarning('انتخاب حداقل 3 مورد اجباریست');
    setBtnLoading(true);
    const body = {
      requestDetailId: state.requestDetailId,
      actionList: products,
    };
    httpRequest
      .postRequest<IOutputResult<any>>(APIURL_POST_ADD_CONTROL_HOME_WARRANTY, body, () => {}, config)
      .then((result) => {
        setBtnLoading(false);
        if (!result.data.isSuccess) return toast.showError(result.data.message);
        result.data.isSuccess ? (GetInvoiceAction(), toast.showSuccess(result.data.message)) : '';
      })
      .catch(() => {
        setBtnLoading(false);
      });
  };

  const Checkouts = () => {
    setCheckoutLoading(true);
    !loading &&
      httpRequest
        .postRequest<IOutputResult<any>>(`${APIURL_POST_TECHNICIAN_INVOICE_CHECKOUT_LIST}`, payments)
        .then((result) => {
          result.data.isSuccess ? toast.showSuccess(result.data.message) : toast.showError(result.data.message);
          GetInvoiceAction();
          setCheckoutLoading(false);
        })
        .finally(() => {
          setCheckoutLoading(false);
        });
  };

  const GetInvoiceAction = () => {
    state.requestDetailId &&
      (setLoading(true),
      httpRequest
        .getRequest<IOutputResult<IInvoiceActionResultModel>>(
          `${APIURL_GET_TECHNICIAN_INVOICE}?TechnicianId=${userData?.userId}&RequestDetailId=${state.requestDetailId}`
        )
        .then((result) => {
          var totalPrice = 0;
          result.data.data.invoiceList.forEach((e) => {
            !e.settlementStatus ? (totalPrice += e.priceAfterDiscount) : (totalPrice += 0);
          });
          setTotalConsumerPayment(totalPrice);

          var showButton = result.data.data.invoiceList.some((e) => {
            return e.serviceTypeTitle == 'گارانتی'
              ? !e.settlementStatus
              : e.costSource == 0 && e.settlementStatus
              ? false
              : e.hasInvoice
              ? false // منتظر تایید
              : true;
          });
          var disabledButton = result.data.data.invoiceList.some((e) => {
            return e.hasInvoice; // اگر فاکتور صاده شده بود دکمه افزودن نمایش داد نشود
          });
          setAddDisabled(disabledButton);
          setBtnIssuance(showButton);
          setInvoice(result.data.data);
          setLoading(false);
          result.data.data.invoiceList &&
            result.data.data.invoiceList.length > 0 &&
            result.data.data.invoiceList.forEach((item) => {
              payments?.push({
                paymentId: item.paymentId,
                consumerPaymentAmount: item.priceAfterDiscount,
              });
            });
          result.data.data.invoiceList &&
            result.data.data.invoiceList.length > 0 &&
            setOrderId(result.data.data.invoiceList[0].orderId);
        }));
  };
  const RemoveAction = (id: number) => {
    const body = {
      technicianId: userData?.userId,
      id: id,
      actorUserId: userData?.userId,
    };
    setLoading(true);
    httpRequest.deleteRequest<IOutputResult<any>>(`${APIURL_DELETE_ACTION}`, body).then((result) => {
      result.data.isSuccess ? toast.showSuccess(result.data.message) : toast.showError(result.data.message);
      setLoading(false);
      GetInvoiceAction();
    });
  };
  const handleDisplay = () => {
    setDisplayImage(!displayImage);
  };
  const InvoiceIssue = () => {
    const body = {
      invoiceId: orderId,
      basePaymentLink: `${BASE_URL}/invoice-share/invoice/${orderId}/link/`,
      consumerPaymentAmount: totalConsumerPayment,
    };
    setCheckoutLoading(true);
    !loading &&
      httpRequest
        .postRequest<IOutputResult<any>>(`${APIURL_POST_ORDER_INVOICE_ISSUANCE}`, body)
        .then((result) => {
          result.data.isSuccess ? toast.showSuccess(result.data.message) : toast.showError(result.data.message);
          setShowConfirmModal(false);
          setCheckoutLoading(false);
          GetInvoiceAction();
        })
        .catch((result) => {
          toast.showError(result.data.message);
          setCheckoutLoading(false);
        });
  };

  useEffect(() => {
    GetInvoiceAction();
    GetFormSchema();
  }, []);
  return (
    <>
      <Header />
      <div className="container home-warranty-selector">
        <div className="account-box insurance-tabs">
          {homeWarranties &&
            homeWarranties.length > 0 &&
            homeWarranties.map((homeWarranty: IGetHomeWarrantyResultModel, index: number) => {
              return (
                <>
                  <h4
                    ref={(e) => (buttonRef.current[index] = e)}
                    className="account-item"
                    onClick={(e) => {
                      buttonRef.current.map((div: any) => {
                        div?.classList?.remove('active');
                      });
                      e.currentTarget.classList.add('active');
                      //* Forms
                      formsRef.current.map((div: any) => {
                        div?.classList?.remove('active');
                      });
                      formsRef.current[index]?.classList.add('active');
                    }}
                  >
                    <a style={{ cursor: 'pointer' }}>{homeWarranty.title}</a>
                  </h4>
                </>
              );
            })}
        </div>

        <div className="insurance-forms">
          {homeWarranties &&
            homeWarranties.length > 0 &&
            homeWarranties.map((homeWarranty: IGetHomeWarrantyResultModel, index: number) => {
              return (
                <>
                  <div ref={(e) => (formsRef.current[index] = e)} className="insurance-form">
                    {homeWarranty.propValues && homeWarranty.propsUISchema && (
                      <Form
                        schema={homeWarranty.propValues}
                        uiSchema={homeWarranty.propsUISchema}
                        onSubmit={(e: any) =>
                          onSubmit(
                            e.formData,
                            homeWarranty.actionId,
                            homeWarranty.title,
                            homeWarranty.id,
                            homeWarranty.productCode
                          )
                        }
                      >
                        <Button
                          className="btn btn-info w-100"
                          type="submit"
                          onClick={() => {
                            formsRef.current[index]?.classList.remove('active');
                          }}
                        >
                          + افزودن
                        </Button>
                      </Form>
                    )}
                  </div>
                </>
              );
            })}
        </div>
        {products && products.length > 0 && (
          <div className="col-12 col-lg-6 dashed">
            <div className="warranty-selector-card insurance-products-details">
              <div className="warranty-selector-header">
                <div className="card-title ">
                  <div>محصولات </div>
                  <div> قیمت (ریال)</div>
                </div>
              </div>

              <div className="warranty-selector-details">
                <ul>
                  {products.map((product: IHomeWarrantyProduct, index: number) => {
                    return (
                      <>
                        <li>
                          <span>
                            {index + 1}-{product.title}
                          </span>
                          <div>{UtilsHelper.threeDigitSeparator(product.price) + ' ریال'}</div>
                          <img
                            onClick={() => handleRemove(product.id)}
                            className="pointer linked-device-removable "
                            width={50}
                            height={50}
                            src={require(`@src/scss/images/icons/${color}-delete.svg`)}
                            alt=""
                          />
                        </li>
                      </>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="col-12 col-lg-6 dashed">
          <div className="warranty-selector-card total-price">
            <div className="warranty-selector-header">
              <div className="card-title">
                <div>محاسبه قیمت</div>
              </div>
            </div>

            <div className="warranty-selector-details">
              <ul>
                <li>
                  <span>تخفیف و کسورات</span>
                  <div>{UtilsHelper.threeDigitSeparator(calcResult?.totalReductionValue)}</div>
                </li>
                <li>
                  <span>مبلغ</span>
                  <div>{UtilsHelper.threeDigitSeparator(calcResult?.totalPrice)}</div>
                </li>
                <li>
                  <span>مالیات و عوارض</span>
                  <div>{UtilsHelper.threeDigitSeparator(calcResult?.totalTax)}</div>
                </li>
                <li>
                  <span>مبلغ قابل پرداخت</span>
                  <div>{UtilsHelper.threeDigitSeparator(calcResult?.calculatePrice)}</div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="col-12">
          <div className="payment-price">
            مبلغ : <span>{UtilsHelper.threeDigitSeparator(calcResult?.calculatePrice)}</span> ریال
          </div>
          <div className="select-time mb-4">
            <div className="form-check ">
              <input
                className="form-check-input"
                type="checkbox"
                value=""
                id="check2"
                onClick={() => {
                  setBtnDisabled(!btnDisabled);
                }}
              />
              <label className="form-check-label" htmlFor="check2">
                به اطلاع مشتری رسیده و مورد تایید است
              </label>
            </div>
          </div>
          <Button
            disabled={btnDisabled}
            className={`add-action-btn green-btn w-100 progressbar ${btnLoading && 'active'}`}
            onClick={() => {
              AddHomeWarranty();
            }}
          >
            <span className="line" style={{ width: `${progress}%` }}></span>
            <span className="count-number">{progress}%</span>
            {loading ? <Spinner /> : 'ثبت درخواست'}
          </Button>
        </div>
        {/* invoice */}
        <div className="container action-description">
          <div
            className=""
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <div className="w-100">
              <div className="d-flex align-items-center m-2" style={{ alignItems: 'inherit' }}>
                <img src={require(`@src/scss/images/icons/${color}-follow-up.svg`)}></img>
                <h4 className="m-1 mr-2">شرح اقدامات</h4>
              </div>

              <div className="running-items row">
                {invoice &&
                  invoice.invoiceList.length &&
                  invoice.invoiceList.map((invoiceItem: IInvoiceActionList, index: number) => {
                    return (
                      <div className="col-12  col-lg-6 mb-2">
                        <div className={`running-item ${invoiceItem.settlementStatus && 'issuance-invoice-item'}`}>
                          <div className="d-flex align-items-center w-100">
                            <div className="space-nowrap">
                              {index + 1}- {invoiceItem.serviceTypeTitle} :
                            </div>

                            <div className="description">{invoiceItem.actionTitle}</div>
                            <UncontrolledTooltip placement="top" target={`registerTip${index}`}>
                              {invoiceItem.description}
                            </UncontrolledTooltip>
                            <img
                              src={require(`@src/scss/images/icons/${color}-message.svg`)}
                              className="info-btn"
                              id={`registerTip${index}`}
                            />
                          </div>
                          <div className="d-flex align-items-center mt-2 w-100">
                            {invoiceItem.settlementStatus ? (
                              <img src={require(`@src/scss/images/icons/${color}-checked.svg`)} className="waiting-glass" />
                            ) : (
                              <img src={require(`@src/scss/images/icons/hourglass.svg`)} className="waiting-glass" />
                            )}
                            مبلغ : {UtilsHelper.threeDigitSeparator(invoiceItem.price)} <span className="rial ml-auto">ریال</span>
                            <div className="">
                              {invoiceItem.settlementStatus ? (
                                <>
                                  {invoiceItem.hasInvoice ? (
                                    <div>{invoiceItem.status}</div>
                                  ) : (
                                    <div>{invoiceItem.paymentType}</div>
                                  )}
                                </> // نقدی
                              ) : invoiceItem.costSource == 1 ? (
                                <div>{ECostSource[invoiceItem.costSource]}</div>
                              ) : (
                                <>
                                  {!invoiceItem.hasInvoice ? (
                                    <>{/* //! Cash Button */}</>
                                  ) : (
                                    // <Button
                                    //   className="cash-btn success-btn green-btn"
                                    //   onClick={() => {
                                    //     Checkout(invoiceItem.paymentId, invoiceItem.priceAfterDiscount);
                                    //   }}
                                    // >
                                    //   <img src={require(`@src/scss/images/icons/${color}-cash.svg`)} className="cash-icon" />
                                    //   {checkoutLoading ? <Spinner /> : 'پرداخت '}
                                    // </Button>
                                    <div>{invoiceItem.status}</div>
                                  )}
                                </>
                              )}
                              <div>
                                {invoiceItem.settlementStatus
                                  ? ''
                                  : !invoiceItem.hasInvoice && (
                                      //!close image
                                      <></>
                                      // <img
                                      //   className="close"
                                      //   src={require(`@src/scss/images/icons/${color}-close.svg`)}
                                      //   onClick={() => {
                                      //     debugger;
                                      //     setPaymentId(invoiceItem.paymentId);
                                      //     setConfirmRemoveModalVisible(true);
                                      //   }}
                                      // />
                                    )}
                              </div>
                            </div>
                          </div>

                          <div style={{ textAlign: 'center' }} className={invoiceItem.discount ? 'discount' : 'mr-l-auto'} />
                          {invoiceItem.discount ? (
                            <div className="p-1">{UtilsHelper.threeDigitSeparator(invoiceItem.priceAfterDiscount)}</div>
                          ) : (
                            ''
                          )}

                          <div className="d-flex flex-wrap justify-content-start">
                            {invoiceItem.files &&
                              invoiceItem.files.length > 0 &&
                              invoiceItem.files.map((img: IFiles, index: number) => {
                                return (
                                  <div
                                    className="pointer image-gallery"
                                    onClick={() => {
                                      setImageSrc(img.fileUrl), setDisplayImage(true);
                                    }}
                                    style={{ backgroundImage: `url(${img.fileUrl})`, width: '50px', height: '50px' }}
                                  />
                                );
                              })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
              {invoice?.invoiceList && invoice?.invoiceList.length > 0 ? (
                btnIssuance ? (
                  <div className=" mb-4 ">
                    <Button
                      className="cash-btn w-100 success-btn green-btn btn-technician-action btn-info btn btn-secondary w-100 mt-3 btn btn-secondary"
                      onClick={() => {
                        Checkouts();
                      }}
                    >
                      <img
                        style={{ marginLeft: '10px' }}
                        width={25}
                        height={'auto'}
                        src={require(`@src/scss/images/icons/${color}-cash.svg`)}
                        className="cash-icon"
                      />
                      {checkoutLoading ? <Spinner /> : 'تسویه'}
                    </Button>

                    <Button
                      onClick={() => {
                        handleShowModal();
                      }}
                      className="btn-info btn btn-secondary w-100 mt-1"
                    >
                      {checkoutLoading ? (
                        <LoadingComponent />
                      ) : (
                        `صدور فاکتور به مبلغ ${UtilsHelper.threeDigitSeparator(totalConsumerPayment)} ریال`
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="d-flex justify-content-between mb-4">
                    <Button
                      onClick={() => {
                        navigate(generatePath(URL_INVOICE_SHARE, { invoice: `${orderId}`, link: `${invoice.generalLinkId}` }));
                      }}
                      className="btn-info btn btn-secondary mt-3 btn-technician-action"
                    >
                      مشاهده فاکتور
                    </Button>
                    <RWebShare
                      data={{
                        text: `لینک پرداخت فاکتور صادر شده `,
                        url: `${BASE_URL}/invoice-share/invoice/${orderId}/link/${invoice.generalLinkId}`,
                        title: 'کاردون',
                      }}
                    >
                      <Button className="btn-info btn btn-secondary mt-3 btn-technician-action">اشتراک گذاری</Button>
                    </RWebShare>
                  </div>
                )
              ) : (
                ''
              )}
            </div>
          </div>
        </div>
      </div>
      <ConfirmModal confirmModalVisible={showConfirmModal} accept={() => InvoiceIssue()} reject={handleShowModal} />
      <ShowImageModal display={displayImage} src={imageSrc} handleDisplay={handleDisplay} />
      <RemoveConfirmModal
        confirmModalVisible={confirmRemoveModalVisible}
        accept={() => {
          setConfirmRemoveModalVisible(false), RemoveAction(paymentId!);
        }}
        reject={() => {
          setConfirmRemoveModalVisible(false);
        }}
      />
    </>
  );
};

export default Warranty;
