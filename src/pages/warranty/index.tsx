import useHttpRequest, { RequestDataType } from '@src/hooks/useHttpRequest';
import Header from '@src/layout/Headers/Header';
import { IGetHomeWarrantyResultModel } from '@src/models/output/warranty/IGetHomeWarrantyResultModel';
import { RootStateType } from '@src/redux/Store';
import { UtilsHelper } from '@src/utils/GeneralHelpers';
import { FunctionComponent, useEffect, useReducer, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Spinner, UncontrolledTooltip } from 'reactstrap';
import { IPageProps } from '@src/configs/routerConfig/IPageProps';
import { IOutputResult } from '@src/models/output/IOutputResult';
import { useToast } from '@src/hooks/useToast';
import type { JSONSchema7 } from 'json-schema';
import Form, { ISubmitEvent } from '@rjsf/core';
import { generatePath, useLocation, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import {
  APIURL_DELETE_ACTION,
  APIURL_GET_HOMEWARRANTY_PRODUCT,
  APIURL_GET_MISSION_DETAILS,
  APIURL_GET_REQUEST_STATUS_LIST,
  APIURL_GET_TECHNICIAN_INVOICE,
  APIURL_GET_TRACKING_LIST,
  APIURL_POST_ADD_CONTROL_HOME_WARRANTY,
  APIURL_POST_CALC_WARRANTY_ORDER_INFO,
  APIURL_POST_ORDER_INVOICE_ISSUANCE,
  APIURL_POST_TECHNICIAN_INVOICE_CHECKOUT_LIST,
  APIURL_POST_TRACKING,
  APIURL_POST_VALIDATION_CARD_CODE,
  APIURL_UPDATE_REQUEST_DETAIL_STATUS,
} from '@src/configs/apiConfig/apiUrls';
import { IHomeWarrantyProduct } from '@src/models/output/warranty/IHomeWarrantyProduct';
import * as uuid from 'uuid';
import {
  ICalculationsHomeWarrantyOrderPrice,
  IGetHomeWarrantyOrderInfoResultModel,
  IHomeWarrantyOrdersModelResult,
} from '@src/models/output/warranty/IHomeWarrantyOrdersModelResult';
import {
  ECostSource,
  IFiles,
  IInvoiceActionList,
  IInvoiceActionResultModel,
} from '@src/models/output/missionDetail/IInvoiceActionResultModel';
import { RWebShare } from 'react-web-share';
import { BASE_URL } from '@src/configs/apiConfig/baseUrl';
import { URL_HOME_WARRANTY_INVOICE_SHARE, URL_INVOICE_SHARE, URL_TECHNICIAN_REQUEST } from '@src/configs/urls';
import LoadingComponent from '@src/components/spinner/LoadingComponent';
import RemoveConfirmModal from '../technicianMissionDetail/technicianAction/RemoveConfirmModal';
import ShowImageModal from '@src/components/showImageModal/ShowImageModal';
import ConfirmModale from '../technicianMissionDetail/technicianAction/ConfirmModal';
import {
  IMissionDetailResultModel,
  IProblemList,
  IStatusMission,
} from '@src/models/output/missionDetail/IMissionDetailListResultModel';
import { DateHelper } from '@src/utils/dateHelper';
import CallModal from '../technicianMissionDetail/CallModal';
import { IFollowUpList } from '@src/models/output/missionDetail/IFollowUpList';
import FollowUpModal from '../technicianMissionDetail/FollowUpModal';
import DescribeModal from './DescribeModal';
import ConfirmCheckoutModal from './ConfirmCheckoutModal';
import SuspendCauseModal from '../technicianMissionDetail/SuspendCauseModal';
import ConfirmModal from '../technicianMissionDetail/ConfirmModal';
import ProgressCauseModal from '../technicianMissionDetail/ProgressCauseModal';
import { EventState } from './EventState';

interface IPayment {
  paymentId: number;
  consumerPaymentAmount: number;
}

const Warranty: FunctionComponent<IPageProps> = ({ title }) => {
  const toast = useToast();
  const navigate = useNavigate();
  const color = useSelector((state: RootStateType) => state.theme.color);
  const userData = useSelector((state: RootStateType) => state.authentication.userData);
  const httpRequest = useHttpRequest();
  const { state }: any = useLocation();
  const [payments] = useState<IPayment[]>([]);
  const buttonRef = useRef<any>([]);
  const formsRef = useRef<any>([]);
  const [addDisabled, setAddDisabled] = useState<boolean>(false);
  const [followUpList, setFollowUpList] = useState<IFollowUpList[]>();

  const [event, updateEvent] = useReducer(
    (prev: EventState, next: EventState) => {
      return { ...prev, ...next };
    },
    {
      loading: false,
      btnLoading: false,
      requestLoading: false,
      btnDisabled: true,
      agreementDisabled: false,
      homeWarranties: [],
      selectDisabled: false,
      followUpDescription: '',
      calcResult: {
        calculatePrice: 0,
        totalPrice: 0,
        totalReductionValue: 0,
        totalTax: 0,
        totalPaymentableAmount: 0,
        prePaymentAmount: 0,
      },
      statusValue: undefined,
      statusList: [],
      followUpModalVisible: false,
      describeModalVisible: false,
      paymentId: undefined,
      checkoutLoading: false,
      progress: undefined,
      calcSum: undefined,
      showConfirmModal: false,
      showCheckOutConfirmModal: false,
      displayImage: false,
      products: [],
      productBeforCalc: [],
      nextTrackingDateTime: '',
      invoice: undefined,
      btnIssuance: false,
      suspendCauseList: [],
      displayCallModal: false,
      confirmRemoveModalVisible: false,
      totalConsumerPayment: 0,
      orderId: undefined,
      confirmModalVisible: false,
      suspendReasonModalVisible: false,
      progressReasonModalVisible: false,
      progressCauseList: [],
      missionDetail: undefined,
      imageSrc: '',
      cardCode: '',
      btnValidationLoading: undefined,
      disabledValidationCode: false,
    }
  );

  const config = {
    onUploadProgress: (progressEvent: any) =>
      updateEvent({ progress: Math.round((100 * progressEvent.loaded) / progressEvent.total) }),
  };
  const handleShowModal = () => {
    updateEvent({ showConfirmModal: !event.showConfirmModal });
  };
  const handleCheckoutShowModal = () => {
    updateEvent({ showCheckOutConfirmModal: !event.showCheckOutConfirmModal });
  };
  const GetStatusList = () => {
    updateEvent({ loading: true });
    httpRequest.getRequest<IOutputResult<IStatusMission[]>>(`${APIURL_GET_REQUEST_STATUS_LIST}`).then((result) => {
      updateEvent({ statusList: result.data.data, loading: false });
    });
  };
  const GetFormSchema = () => {
    updateEvent({ loading: true });
    httpRequest
      .getRequest<IOutputResult<IGetHomeWarrantyResultModel[]>>(
        `${APIURL_GET_HOMEWARRANTY_PRODUCT}?requestDetailId=${state.requestDetailId}`
      )
      .then((result) => {
        let sumCalc = 0;
        result.data.data.forEach((item) => {
          sumCalc += item.order_PaymentValue ? item.order_PaymentValue : 0;
        });

        updateEvent({ calcSum: sumCalc });
        updateEvent({ homeWarranties: result.data.data });

        !result.data.isSuccess && toast.showError(result.data.message);
        updateEvent({ loading: false });
      });
  };

  const handleRemove = (id: string) => {
    const updateProduct = event.products?.filter((value) => value.id !== id);
    const updateProductBeforCalc = event.productBeforCalc!.filter((value) => value.id !== id);
    updateEvent({ products: updateProduct, productBeforCalc: updateProductBeforCalc });
    getCalculation(updateProductBeforCalc);
  };

  const getCalculation = (updateProductBeforCalc: any) => {
    updateEvent({ loading: true });
    const body = {
      productItems: updateProductBeforCalc,
      requestDetailId: state.requestDetailId,
    };
    httpRequest
      .postRequest<IOutputResult<IGetHomeWarrantyOrderInfoResultModel>>(APIURL_POST_CALC_WARRANTY_ORDER_INFO, body)
      .then((result) => {
        updateEvent({ loading: false });
        if (!result.data.isSuccess) return toast.showError(result.data.message);
        let amount = 0;
        let discount = 0;
        let tax = 0;
        let payment = 0;

        result.data.data.products &&
          result.data.data.products.length > 0 &&
          result.data.data.products.map((item: IHomeWarrantyOrdersModelResult, index: number) => {
            amount += item.price + item.addition;
            discount += item.reductionValue;
            tax += item.tax;
            payment += item.paymentableAmount;
          });
        let calculations = {
          calculatePrice: payment,
          totalPrice: amount,
          totalReductionValue: discount,
          totalTax: tax,
          totalPaymentableAmount: payment,
          prePaymentAmount: result.data.data.prePaymentAmount,
        };
        updateEvent({ calcResult: calculations });
        // setCalcResult(calculations);
        // setCalcResult(result.data.data.calculations);
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
    updateEvent({ loading: true });
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
    updateEvent({ productBeforCalc: [...event.productBeforCalc!, newProductBeforCalc] });

    const body = {
      productItems: event.productBeforCalc!.concat(newProductBeforCalc),
      requestDetailId: state.requestDetailId,
    };
    httpRequest
      .postRequest<IOutputResult<IGetHomeWarrantyOrderInfoResultModel>>(APIURL_POST_CALC_WARRANTY_ORDER_INFO, body)
      .then((result) => {
        updateEvent({ loading: false });
        if (!result.data.isSuccess) return toast.showError(result.data.message);
        const body: IHomeWarrantyProduct = {
          price: result.data.data.products[result.data.data.products.length - 1].price,
          priceAfterReduction_Addition:
            result.data.data.products[result.data.data.products.length - 1].priceAfterReduction_Addition,
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
        updateEvent({ products: [...event.products!, body] });
        let amount = 0;
        let discount = 0;
        let tax = 0;
        let payment = 0;

        result.data.data.products &&
          result.data.data.products.length > 0 &&
          result.data.data.products.map((item: IHomeWarrantyOrdersModelResult, index: number) => {
            amount += item.price + item.addition;
            discount += item.reductionValue;
            tax += item.tax;
            payment += item.paymentableAmount;
          });
        let calculations = {
          calculatePrice: payment,
          totalPrice: amount,
          totalReductionValue: discount,
          totalTax: tax,
          totalPaymentableAmount: payment,
          prePaymentAmount: result.data.data.prePaymentAmount,
        };
        updateEvent({ calcResult: calculations });
        // setCalcResult(calculations);
        // setCalcResult(result.data.data.calculations);
      });
  };

  const AddHomeWarranty = () => {
    // if (products.length < 3) return toast.showWarning('انتخاب حداقل 3 مورد اجباریست');
    updateEvent({ btnDisabled: true, btnLoading: true });
    const body = {
      requestDetailId: state.requestDetailId,
      actionList: event.products,
      goldCardNo: event.cardCode,
    };
    !event.disabledValidationCode && delete body.goldCardNo;
    httpRequest
      .postRequest<IOutputResult<any>>(APIURL_POST_ADD_CONTROL_HOME_WARRANTY, body, () => {}, config)
      .then((result) => {
        updateEvent({ agreementDisabled: true, btnLoading: false });
        if (!result.data.isSuccess) return toast.showError(result.data.message);
        result.data.isSuccess
          ? (GetInvoiceAction(), toast.showSuccess(result.data.message), updateEvent({ btnDisabled: false }))
          : '';
      })
      .catch(() => {
        updateEvent({ btnLoading: false, btnDisabled: false });
      });
  };

  const Checkouts = () => {
    updateEvent({ checkoutLoading: true });

    handleCheckoutShowModal();
    !event.loading &&
      httpRequest
        .postRequest<IOutputResult<any>>(`${APIURL_POST_TECHNICIAN_INVOICE_CHECKOUT_LIST}`, payments)
        .then((result) => {
          result.data.isSuccess ? toast.showSuccess(result.data.message) : toast.showError(result.data.message);
          GetInvoiceAction();
          updateEvent({ checkoutLoading: false });
        })
        .finally(() => {
          updateEvent({ checkoutLoading: false });
        });
  };

  const GetInvoiceAction = () => {
    state.requestDetailId &&
      (updateEvent({ loading: true }),
      httpRequest
        .getRequest<IOutputResult<IInvoiceActionResultModel>>(
          `${APIURL_GET_TECHNICIAN_INVOICE}?TechnicianId=${userData?.userId}&RequestDetailId=${state.requestDetailId}`
        )
        .then((result) => {
          var totalPrice = 0;
          result.data.data.invoiceList.forEach((e) => {
            !e.settlementStatus ? (totalPrice += e.priceAfterDiscount) : (totalPrice += 0);
          });
          updateEvent({ totalConsumerPayment: totalPrice });

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
            updateEvent({ agreementDisabled: true });
            return e.hasInvoice; // اگر فاکتور صاده شده بود دکمه افزودن نمایش داد نشود
          });
          setAddDisabled(disabledButton);
          updateEvent({ btnIssuance: showButton, invoice: result.data.data, loading: false });
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
            updateEvent({ orderId: result.data.data.invoiceList[0].orderId });
        }));
  };
  const RemoveAction = (id: number) => {
    const body = {
      technicianId: userData?.userId,
      id: id,
      actorUserId: userData?.userId,
    };
    updateEvent({ loading: true });
    httpRequest.deleteRequest<IOutputResult<any>>(`${APIURL_DELETE_ACTION}`, body).then((result) => {
      result.data.isSuccess ? toast.showSuccess(result.data.message) : toast.showError(result.data.message);
      updateEvent({ loading: false });
      GetInvoiceAction();
    });
  };
  const handleDisplay = () => {
    updateEvent({ displayImage: !event.displayImage });
  };
  const InvoiceIssue = () => {
    const body = {
      invoiceId: event.orderId,
      basePaymentLink: `${BASE_URL}/invoice-share/invoice/${event.orderId}/link/`,
      consumerPaymentAmount: event.totalConsumerPayment,
    };
    updateEvent({ checkoutLoading: true });
    !event.loading &&
      httpRequest
        .postRequest<IOutputResult<any>>(`${APIURL_POST_ORDER_INVOICE_ISSUANCE}`, body)
        .then((result) => {
          result.data.isSuccess ? toast.showSuccess(result.data.message) : toast.showError(result.data.message);
          updateEvent({ showConfirmModal: false, checkoutLoading: false });
          GetInvoiceAction();
        })
        .catch((result) => {
          toast.showError(result.data.message);
          updateEvent({ checkoutLoading: false });
        });
  };

  const GetMissionDetail = () => {
    updateEvent({ requestLoading: true });
    httpRequest
      .getRequest<IOutputResult<IMissionDetailResultModel>>(
        `${APIURL_GET_MISSION_DETAILS}?TechnicianId=${userData?.userId}&RequestDetailId=${state.requestDetailId}`
      )
      .then((result) => {
        updateEvent({ missionDetail: result.data.data });
        result.data.data.statusId == 3 || result.data.data.statusId == 4
          ? updateEvent({ selectDisabled: true })
          : updateEvent({ selectDisabled: false });
        updateEvent({ requestLoading: false });
      });
  };

  const handleCallModal = () => {
    updateEvent({ displayCallModal: !event.displayCallModal });
  };

  useEffect(() => {
    GetStatusList();
    GetInvoiceAction();
    GetFormSchema();
    GetMissionDetail();
  }, []);

  const AddFollowUp = () => {
    if (event.followUpDescription == '') return toast.showError('توضیحات نمی تواند خالی باشد'), updateEvent({ loading: false });
    const body = {
      technicianId: userData?.userId,
      requestDetailId: state.requestDetailId,
      description: event.followUpDescription,
      nextTrackingDateTime: event.nextTrackingDateTime,
    };
    updateEvent({ loading: true });
    httpRequest
      .postRequest<IOutputResult<any>>(`${APIURL_POST_TRACKING}`, body)
      .then((result) => {
        toast.showSuccess(result.data.message);
        updateEvent({ followUpModalVisible: false, describeModalVisible: false, loading: false });
        // GetFollowUp();
      })
      .finally(() => {
        updateEvent({ loading: false });
      });
  };
  const closeModal = () => {
    updateEvent({
      progressReasonModalVisible: false,
      describeModalVisible: false,
      suspendReasonModalVisible: false,
      followUpModalVisible: false,
      confirmModalVisible: false,
    });
  };
  // const GetFollowUp = () => {
  //   updateEvent({ loading: true });
  //   httpRequest
  //     .getRequest<IOutputResult<IFollowUpList[]>>(
  //       `${APIURL_GET_TRACKING_LIST}?TechnicianId=${userData?.userId}&RequestDetailId=${state.requestDetailId}`
  //     )
  //     .then((result) => {
  //       setFollowUpList(result.data.data);
  //       updateEvent({ loading: false})
  //     });
  // };
  const UpdateStatus = (statusValue: number, causeIdList?: number[]) => {
    const body = {
      technicianId: userData?.userId,
      requestDetailId: state.requestDetailId,
      status: statusValue,
      causeIdList: causeIdList,
    };
    updateEvent({ loading: true });
    httpRequest.updateRequest<IOutputResult<any>>(`${APIURL_UPDATE_REQUEST_DETAIL_STATUS}`, body).then((result) => {
      result.data.isSuccess ? toast.showSuccess(result.data.message) : toast.showError(result.data.message);
      updateEvent({ loading: false });
      closeModal();
    });
  };
  const transformErrors = (errors: any) => {
    return errors.map((error: any) => {
      if (error.name === 'required') {
        error.message = 'انتخاب این مورد الزامیست';
      }
      return error;
    });
  };

  const getValidationCardCode = (code: string) => {
    updateEvent({ btnValidationLoading: true });
    const body = {
      cardCode: code,
    };
    httpRequest
      .postRequest<IOutputResult<any>>(`${APIURL_POST_VALIDATION_CARD_CODE}`, body)
      .then((result) => {
        updateEvent({ btnValidationLoading: false });
        result.data.data.result
          ? (toast.showSuccess('کد وارد شده تایید و اعمال شد'), updateEvent({ disabledValidationCode: true }))
          : toast.showError('کد وارد شده مورد تایید نیست');
      })
      .catch(() => {
        updateEvent({ btnValidationLoading: false });
      });
  };
  return (
    <>
      <Header />
      <div className="container home-warranty-selector">
        {event.requestLoading ? (
          <div className="d-flex justify-content-center">در حال بارگذاری اطلاعات مشتری ...</div>
        ) : (
          <div className="mission-details mb-1">
            <div className="section-1">
              <div className="details-bar mt--1 mb--1 ">
                <p>شماره درخواست:</p>
                <p>{event.missionDetail?.requestNumber}</p>
              </div>
              <div className="details-bar mt--1 mb--1">
                <p>زمان مراجعه:</p>
                <p>
                  {DateHelper.isoDateTopersian(event.missionDetail?.presenceDateTime)}-{event.missionDetail?.presenceShift}
                </p>
              </div>
              <div className="details-bar mt--1 mb--1">
                <p>نام مشتری:</p>
                <p>
                  {' '}
                  {event.missionDetail?.consumerFirstName} {event.missionDetail?.consumerLastName}
                  <span className="upload-icons home-warranty" style={{ marginBottom: '-12px' }}>
                    <img
                      className="pointer"
                      onClick={() => handleCallModal()}
                      src={require(`@src/scss/images/icons/${color}-call2.svg`)}
                      alt="VectorI344"
                    />
                  </span>
                </p>
              </div>
              <div className="details-bar mt--1 mb--1">
                <p>آدرس:</p>
                <p className="m-1">{event.missionDetail?.address}</p>
              </div>
            </div>
          </div>
        )}
        {event.missionDetail?.serviceTypeTitle}-{event.missionDetail?.productTypeTitle}
        <div className="w-100">
          <div className="">
            {event.missionDetail?.statusTitle && (
              <Select
                isSearchable={false}
                isDisabled={event.selectDisabled}
                isLoading={event.loading}
                className="select-city"
                options={event.statusList?.filter((x) => x.label !== 'ابطال')}
                placeholder={event.missionDetail?.statusTitle}
                onChange={(e) => {
                  if (e?.value == 2) updateEvent({ suspendReasonModalVisible: true });
                  else if (e?.value == 5) updateEvent({ progressReasonModalVisible: true });
                  else updateEvent({ confirmModalVisible: true }), updateEvent({ statusValue: e?.value! });
                  //  setStatusValue(e?.value!),
                }}
              />
            )}
          </div>
        </div>
        <div>
          <p style={{ marginBottom: '0px' }}>ایرادات</p>
          <ul>
            {event.missionDetail?.problemList &&
              event.missionDetail?.problemList.length > 0 &&
              event.missionDetail.problemList.map((problems: IProblemList, index: number) => {
                return <li>{problems.label}</li>;
              })}
          </ul>
          {event.missionDetail?.description && (
            <div>
              <p> توضیحات :</p>
              <div className="description">{event.missionDetail?.description}</div>
            </div>
          )}
        </div>
        <div className="account-box insurance-tabs">
          {event.homeWarranties &&
            event.homeWarranties.length > 0 &&
            event.homeWarranties.map((homeWarranty: IGetHomeWarrantyResultModel, index: number) => {
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
        {event.homeWarranties ? (
          <div className="initial-request-table">
            موارد درخواست اولیه
            <table>
              <thead>
                <tr>
                  <th>شماره کالا</th>
                  <th>نام محصول</th>
                  <th>قیمت</th>
                  <th>گارانتی</th>
                </tr>
              </thead>
              {event.homeWarranties.length > 0 &&
                event.homeWarranties.map((item, index: number) => {
                  return (
                    <>
                      {item.required && (
                        <tr>
                          <td>{index + 1}</td>
                          <td>{item.title}</td>
                          <td>{UtilsHelper.threeDigitSeparator(item.order_EstimatedValue)}</td>
                          <td>
                            {item.order_ActiveWarranty ? (
                              <img src={require(`@src/scss/images/icons/blue-checked.svg`)} alt="" />
                            ) : (
                              <img src={require(`@src/scss/images/icons/blue-close.svg`)} alt="" />
                            )}
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
            </table>
            <div className="w-100 d-flex justify-content-end p-2">
              مبلغ پرداختی : {UtilsHelper.threeDigitSeparator(event.calcSum)}
            </div>
          </div>
        ) : (
          <LoadingComponent />
        )}
        <div className="insurance-forms">
          {event.homeWarranties &&
            event.homeWarranties.length > 0 &&
            event.homeWarranties.map((homeWarranty: IGetHomeWarrantyResultModel, index: number) => {
              return (
                <>
                  <div ref={(e) => (formsRef.current[index] = e)} className="insurance-form">
                    {homeWarranty.propValues && homeWarranty.propsUISchema && (
                      <Form
                        schema={homeWarranty.propValues}
                        uiSchema={homeWarranty.propsUISchema}
                        onChange={() => {
                          var danger = document.querySelector('.panel-danger');
                          //@ts-ignore
                          danger ? (danger.style.display = 'none') : '';
                        }}
                        onSubmit={(e: any) => {
                          formsRef.current[index]?.classList.remove('active');
                          onSubmit(
                            e.formData,
                            homeWarranty.actionId,
                            homeWarranty.title,
                            homeWarranty.id,
                            homeWarranty.productCode
                          );
                        }}
                        liveValidate
                        transformErrors={transformErrors}
                      >
                        <Button className="btn btn-info w-100" type="submit">
                          + افزودن
                        </Button>
                      </Form>
                    )}
                  </div>
                </>
              );
            })}
        </div>
        {event.products && event.products.length > 0 && (
          <div className="col-12 col-lg-6 dashed">
            <div className="warranty-selector-card insurance-products-details">
              <div className="warranty-selector-header">
                <div className="card-title ">
                  <div>محصولات </div>
                  <div> قیمت (ریال)</div>
                  <div> ارزش تخمینی </div>
                </div>
              </div>

              <div className="warranty-selector-details">
                <ul>
                  {event.products.map((product: IHomeWarrantyProduct, index: number) => {
                    return (
                      <>
                        <li>
                          <span>
                            {index + 1}-{product.title}
                          </span>
                          <div>{UtilsHelper.threeDigitSeparator(product.priceAfterReduction_Addition) + ' ریال'}</div>
                          <div>{product.estimatedValue}</div>
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
                  <span>مبلغ</span>
                  <div>{UtilsHelper.threeDigitSeparator(event.calcResult?.totalPrice)}</div>
                </li>
                <li>
                  <span>مبلغ پیش پرداخت</span>
                  <div>{UtilsHelper.threeDigitSeparator(event.calcResult?.prePaymentAmount)}</div>
                </li>
                <li>
                  <span>تخفیف و کسورات</span>
                  <div>{UtilsHelper.threeDigitSeparator(event.calcResult?.totalReductionValue)}</div>
                </li>
                <li>
                  <span>مالیات و عوارض</span>
                  <div>{UtilsHelper.threeDigitSeparator(event.calcResult?.totalTax)}</div>
                </li>
                <li>
                  <span>مبلغ قابل پرداخت</span>
                  <div>
                    {UtilsHelper.threeDigitSeparator(
                      event.calcResult?.totalPaymentableAmount! - event.calcResult?.prePaymentAmount!
                    )}
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="col-12">
          <div className="payment-price">
            مبلغ :{' '}
            <span>
              {' '}
              {UtilsHelper.threeDigitSeparator(event.calcResult?.totalPaymentableAmount! - event.calcResult?.prePaymentAmount!)}
            </span>{' '}
            ریال
          </div>
          <div className="select-time mb-4">
            <div className="form-check ">
              <input
                disabled={event.agreementDisabled}
                className="form-check-input"
                type="checkbox"
                value=""
                id="check2"
                onClick={() => {
                  updateEvent({ btnDisabled: !event.btnDisabled });
                }}
              />
              <label className="form-check-label" htmlFor="check2">
                به اطلاع مشتری رسیده و مورد تایید است
              </label>
            </div>
            <div className="d-flex">
              <input
                disabled={event.disabledValidationCode}
                className="account-data-input form-control"
                placeholder="شماره کارت طلایی گارانتی را وارد کنید"
                type="text"
                onKeyDown={(e) => {
                  (e.code === 'Enter' || e.code === 'NumpadEnter') && getValidationCardCode(event.cardCode!);
                }}
                onChange={(e) => {
                  updateEvent({ cardCode: e.currentTarget.value });
                }}
              />
              <button
                disabled={event.disabledValidationCode}
                onClick={() => {
                  getValidationCardCode(event.cardCode!);
                }}
                className=" btn primary-btn green-btn p-2 mr-2"
                style={{ width: '100px' }}
              >
                {event.btnValidationLoading ? <LoadingComponent /> : 'استعلام'}
              </button>
            </div>
          </div>
          <Button
            disabled={event.btnDisabled}
            className={`add-action-btn green-btn w-100 progressbar ${event.btnLoading && 'active'}`}
            onClick={() => {
              AddHomeWarranty();
            }}
          >
            <span className="line" style={{ width: `${event.progress}%` }}></span>
            <span className="count-number">{event.progress}%</span>
            {event.loading ? <Spinner /> : 'ثبت درخواست'}
          </Button>
        </div>
        <div className="d-flex justify-content-evenly p-4">
          <div className="">
            شرح
            <span className="m-2">
              <img
                className="pointer"
                src={require(`@src/scss/images/icons/${color}-follow-up.svg`)}
                onClick={() => {
                  updateEvent({ describeModalVisible: true });
                }}
              />
            </span>
          </div>
          <div className="">
            پیگیری
            <span className="m-2">
              <img
                className="pointer"
                src={require(`@src/scss/images/icons/${color}-follow-up.svg`)}
                onClick={() => {
                  updateEvent({ followUpModalVisible: true });
                }}
              />
            </span>
          </div>
          <div className="">
            درخواست جدید
            <span className="m-2">
              <img
                width={25}
                height={25}
                className="pointer"
                src={require(`@src/scss/images/icons/${color}-addrequest3.svg`)}
                onClick={() => {
                  navigate(`${URL_TECHNICIAN_REQUEST}`, {
                    state: {
                      requestDetailId: event.missionDetail?.requestDetailId,
                      productCategoryId: event.missionDetail?.productCategoryId,
                      consumerFullName: event.missionDetail?.consumerFirstName + ' ' + event.missionDetail?.consumerLastName,
                      consumerAddress: event.missionDetail?.address,
                      requestNumber: event.missionDetail?.requestNumber,
                      consumerId: event.missionDetail?.consumerId,
                    },
                  });
                }}
              />
            </span>
          </div>
        </div>
        {/* invoice */}
        <div className="container action-description">
          <div className="d-flex align-items-center">
            <div className="w-100">
              <div className="d-flex align-items-center m-2" style={{ alignItems: 'inherit' }}>
                <img src={require(`@src/scss/images/icons/${color}-follow-up.svg`)}></img>
                <h4 className="m-1 mr-2">شرح اقدامات</h4>
              </div>
              <div className="running-items row">
                {event.invoice &&
                  event.invoice.invoiceList.length &&
                  event.invoice.invoiceList.map((invoiceItem: IInvoiceActionList, index: number) => {
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
                                      //  <img
                                      //   className="close"
                                      //   src={require(`@src/scss/images/icons/${color}-close.svg`)}
                                      //   onClick={() => {
                                      //     debugger;
                                      //     updateEvent({ paymentId: invoiceItem.paymentId });
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
                                      updateEvent({ displayImage: true, imageSrc: img.fileUrl });
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
              {event.invoice?.invoiceList && event.invoice?.invoiceList.length > 0 ? (
                event.btnIssuance ? (
                  <div className=" mb-4 ">
                    <Button
                      className="cash-btn w-100 success-btn green-btn btn-technician-action btn-info btn btn-secondary w-100 mt-3 btn btn-secondary"
                      onClick={() => {
                        handleCheckoutShowModal();
                        // Checkouts();
                      }}
                    >
                      <img
                        style={{ marginLeft: '10px' }}
                        width={25}
                        height={'auto'}
                        src={require(`@src/scss/images/icons/${color}-cash.svg`)}
                        className="cash-icon"
                      />
                      {event.checkoutLoading ? <Spinner /> : 'تسویه'}
                    </Button>

                    <Button
                      onClick={() => {
                        handleShowModal();
                      }}
                      className="btn-info btn btn-secondary w-100 mt-1"
                    >
                      {event.checkoutLoading ? (
                        <LoadingComponent />
                      ) : (
                        `صدور فاکتور به مبلغ ${UtilsHelper.threeDigitSeparator(event.totalConsumerPayment)} ریال`
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="d-flex justify-content-between mb-4">
                    {event.invoice.invoiceList[0].hasInvoice ? (
                      <Button
                        onClick={() => {
                          navigate(
                            generatePath(URL_INVOICE_SHARE, {
                              invoice: `${event.orderId}`,
                              link: `${event.invoice?.generalLinkId}`,
                            })
                          );
                        }}
                        className="btn-info btn btn-secondary mt-3 btn-technician-action"
                      >
                        مشاهده فاکتور
                      </Button>
                    ) : (
                      <Button
                        onClick={() => {
                          navigate(
                            generatePath(URL_HOME_WARRANTY_INVOICE_SHARE, {
                              InvliceId: `${event.invoice?.requestLinkId}`,
                              invoice: `${event.invoice?.generalLinkId}`,
                            })
                          );
                        }}
                        className="btn-info btn btn-secondary mt-3 btn-technician-action"
                      >
                        مشاهده فاکتور
                      </Button>
                    )}

                    <RWebShare
                      data={{
                        text: `لینک پرداخت فاکتور صادر شده `,
                        url: `${BASE_URL}/invoice-share/invoice/${event.orderId}/link/${event.invoice.generalLinkId}`,
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
      <ConfirmModale confirmModalVisible={event.showConfirmModal} accept={() => InvoiceIssue()} reject={handleShowModal} />
      <ConfirmCheckoutModal
        confirmModalVisible={event.showCheckOutConfirmModal}
        accept={() => Checkouts()}
        reject={handleCheckoutShowModal}
      />
      <ShowImageModal display={event.displayImage!} src={event.imageSrc} handleDisplay={handleDisplay} />
      <RemoveConfirmModal
        confirmModalVisible={event.confirmRemoveModalVisible}
        accept={() => {
          updateEvent({ confirmRemoveModalVisible: false }), RemoveAction(event.paymentId!);
        }}
        reject={() => {
          updateEvent({ confirmRemoveModalVisible: false });
        }}
      />
      <FollowUpModal
        closeModal={closeModal}
        followUpModalVisible={event.followUpModalVisible!}
        AddFollowUp={AddFollowUp}
        loading={event.loading}
        onChange={(e: any) => updateEvent({ followUpDescription: e.currentTarget.value })}
        nextTrackingDateTime={(date: any) => {
          const selectedDate = date.toDate();
          updateEvent({ nextTrackingDateTime: selectedDate.toISOString() });
        }}
      />
      <DescribeModal
        closeModal={closeModal}
        followUpModalVisible={event.describeModalVisible!}
        AddFollowUp={AddFollowUp}
        loading={event.loading}
        onChange={(e: any) => updateEvent({ followUpDescription: e.currentTarget.value })}
      />
      <ConfirmModal
        closeModal={closeModal}
        confirmModalVisible={event.confirmModalVisible}
        accept={() => {
          updateEvent({ confirmModalVisible: false }), UpdateStatus(event.statusValue!);
        }}
        reject={() => {
          updateEvent({ confirmModalVisible: false });
        }}
      />
      <SuspendCauseModal
        closeModal={closeModal}
        suspendReasonModalVisible={event.suspendReasonModalVisible!}
        missionDetail={event.missionDetail}
        statusList={event.statusList}
        onChange={(e: any) => {
          updateEvent({
            followUpDescription: (Array.isArray(e) ? e.map((x) => x.label) : []).toString(),
            suspendCauseList: Array.isArray(e) ? e.map((x) => x.value) : [],
          });
        }}
        onClick={() => {
          UpdateStatus(2, event.suspendCauseList), AddFollowUp();
        }}
        loading={event.loading!}
      />
      <CallModal
        callModalVisible={event.displayCallModal!}
        closeModal={handleCallModal}
        phoneNumbers={[event.missionDetail?.consumerPhoneNumber, event.missionDetail?.userName]}
      />
      <ProgressCauseModal
        closeModal={closeModal}
        missionDetail={event.missionDetail}
        statusList={event.statusList}
        progressReasonModalVisible={event.progressReasonModalVisible!}
        onChange={(e: any) => {
          updateEvent({
            followUpDescription: (Array.isArray(e) ? e.map((x) => x.label) : []).toString(),
            progressCauseList: Array.isArray(e) ? e.map((x) => x.value) : [],
          });
        }}
        onClick={() => {
          UpdateStatus(5, event.progressCauseList);
          AddFollowUp();
        }}
        loading={event.loading!}
      />
    </>
  );
};

export default Warranty;
