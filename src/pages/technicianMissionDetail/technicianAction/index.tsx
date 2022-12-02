import { FunctionComponent, useEffect, useLayoutEffect, useState } from 'react';
import Resizer from 'react-image-file-resizer';
import Num2persian from 'num2persian';
import { IPageProps } from '@src/configs/routerConfig/IPageProps';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Button,
  ButtonDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Form,
  FormFeedback,
  Input,
  Spinner,
  UncontrolledDropdown,
} from 'reactstrap';
import DatePicker from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import { yupResolver } from '@hookform/resolvers/yup';
import Select from 'react-select';
import useHttpRequest, { RequestDataType } from '@src/hooks/useHttpRequest';
import { IOutputResult } from '@src/models/output/IOutputResult';
import { RWebShare } from 'react-web-share';
import { UncontrolledTooltip } from 'reactstrap';
import {
  APIURL_DELETE_ACTION,
  APIURL_GET_SERVICES_TITLE,
  APIURL_GET_SERVICES_TYPES,
  APIURL_GET_SOURCE_OF_COST,
  APIURL_GET_TECHNICIAN_INVOICE,
  APIURL_POST_REQUEST_DETAIL_ACTION,
  APIURL_POST_REQUEST_DETAIL_ACTION_FORMDATA,
  APIURL_POST_TECHNICIAN_INVOICE_CHECKOUT,
} from '@src/configs/apiConfig/apiUrls';
import { UtilsHelper } from '@src/utils/GeneralHelpers';
import { Controller, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { RootStateType } from '@src/redux/Store';
import { ECostSource, IInvoiceActionResultModel } from '@src/models/output/missionDetail/IInvoiceActionResultModel';
import {
  AddTechnicianActionModelSchema,
  ISourceCost,
  ITechnicianActionModel,
} from '@src/models/input/technicianMission/ITechnicianActionModel';
import { useToast } from '@src/hooks/useToast';
import { useTranslation } from 'react-i18next';
import { APIURL_POST_TECHNICIAN_INVOICE_CHECKOUT_ONLINE } from './../../../configs/apiConfig/apiUrls';
import RemoveConfirmModal from './RemoveConfirmModal';
import PrevHeader from '@src/layout/Headers/PrevHeader';
import { IFiles } from './../../../models/output/missionDetail/IInvoiceActionResultModel';
import ShowImageModal from './ShowImageModal';
import { resizeFile } from '@src/utils/ResizerImage';
import InputIcon from 'react-multi-date-picker/components/input_icon';
import LoadingComponent from '@src/components/spinner/LoadingComponent';
import ConfirmModal from './ConfirmModal';

const Action: FunctionComponent<IPageProps> = (props) => {
  const toast = useToast();
  const weekDays = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];
  const { t }: any = useTranslation();
  const { state }: any = useLocation();
  const [imageSrc, setImageSrc] = useState<string>();
  const [displayImage, setDisplayImage] = useState<boolean>(false);
  const httpRequest = useHttpRequest();
  const httpRequestForm = useHttpRequest(RequestDataType.formData);
  const [loading, setLoading] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [serviceTypes, setServiceTypes] = useState<any>();
  const [warrantyStartDate, setWarrantyStartDate] = useState<string>();

  const [guarantee, setGuarantee] = useState<boolean>(false);

  const [imgSrcList, setImgSrcList] = useState<any[]>([]);
  const [imageFile, setImageFile] = useState<any[]>([]);

  const [behindFile, setBehindFiles] = useState<any>();
  const [behindSrc, setBehindSrc] = useState<any>();

  const [frontLeftFile, setFrontLeftFiles] = useState<any>();
  const [frontLeftSrc, setFrontLeftSrc] = useState<any>();

  const [frontRightFile, setFrontRightFiles] = useState<any>();
  const [frontRightSrc, setFrontRightSrc] = useState<any>();

  const [purchaseInvoiceFile, setPurchaseInvoiceFile] = useState<any>();
  const [purchaseInvoiceSrc, setPurchaseInvoiceSrc] = useState<any>();

  const [identityCardFile, setIdentityCardFile] = useState<any>();
  const [identityCardSrc, setIdentityCardSrc] = useState<any>();

  const [lableWarrantyFile, setLableWarrantyFile] = useState<any>();
  const [lableWarrantySrc, setLableWarrantySrc] = useState<any>();

  const [serviceTitle, setServiceTitle] = useState<any>();
  const [sourceCost, setSourceCost] = useState<any>();
  const [invoice, setInvoice] = useState<IInvoiceActionResultModel[]>();
  const [price, setPrice] = useState<any>();
  const [count, setCount] = useState<number>(0);
  const [paymentId, setPaymentId] = useState<number>();
  const [totalPrice, setTotalPrice] = useState<Number>(0);
  const [checkoutLoading, setCheckoutLoading] = useState<boolean>(false);
  const [confirmRemoveModalVisible, setConfirmRemoveModalVisible] = useState<boolean>(false);
  const technicianId = useSelector((state: RootStateType) => state.authentication.userData?.userId);
  const color = useSelector((state: RootStateType) => state.theme.color);
  const RemoveAction = (id: number) => {
    const body = {
      technicianId: technicianId,
      id: id,
      actorUserId: technicianId,
    };
    setLoading(true);
    httpRequest.deleteRequest<IOutputResult<any>>(`${APIURL_DELETE_ACTION}`, body).then((result) => {
      toast.showSuccess(result.data.message);
      setLoading(false);
      GetInvoiceAction();
    });
  };
  const GetServiceType = () => {
    setLoading(true);
    httpRequest.getRequest<IOutputResult<any>>(`${APIURL_GET_SERVICES_TYPES}`).then((result) => {
      setServiceTypes(result.data.data);
      setLoading(false);
    });
  };
  const GetServiceTitle = (serviceTypeId: number) => {
    setLoading(true);
    httpRequest
      .getRequest<IOutputResult<any>>(
        `${APIURL_GET_SERVICES_TITLE}?ProductCategoryId=${state.productCategoryId}&ServiceTypeId=${serviceTypeId}`
      )
      .then((result) => {
        setServiceTitle(result.data.data);
        setLoading(false);
      });
  };
  const GetSourceCost = () => {
    setLoading(true);
    httpRequest.getRequest<IOutputResult<any>>(`${APIURL_GET_SOURCE_OF_COST}`).then((result) => {
      setSourceCost(result.data.data);
      setLoading(false);
    });
  };
  const GetInvoiceAction = () => {
    state.requestDetailId &&
      (setLoading(true),
      httpRequest
        .getRequest<IOutputResult<IInvoiceActionResultModel[]>>(
          `${APIURL_GET_TECHNICIAN_INVOICE}?TechnicianId=${technicianId}&RequestDetailId=${state.requestDetailId}`
        )
        .then((result) => {
          setInvoice(result.data.data);
          setLoading(false);
        }));
  };
  const Checkout = (paymentId: number, consumerPaymentAmount: number) => {
    const body = {
      paymentId: paymentId,
      technicianId: technicianId,
      consumerPaymentAmount: consumerPaymentAmount,
      userId: technicianId,
    };
    setCheckoutLoading(true);
    !loading &&
      httpRequest
        .postRequest<IOutputResult<any>>(`${APIURL_POST_TECHNICIAN_INVOICE_CHECKOUT}`, body)
        .then((result) => {
          toast.showSuccess(result.data.message);
          GetInvoiceAction();
          setCheckoutLoading(false);
        })
        .finally(() => {
          setCheckoutLoading(false);
        });
  };
  const handleDisplay = () => {
    setDisplayImage(!displayImage);
  };
  const CheckoutOnline = (paymentId: number, consumerPaymentAmount: number) => {
    const body = {
      paymentId: paymentId,
      consumerPaymentAmount: consumerPaymentAmount,
      userId: technicianId,
    };
    setCheckoutLoading(true);
    !loading &&
      httpRequest
        .postRequest<IOutputResult<any>>(`${APIURL_POST_TECHNICIAN_INVOICE_CHECKOUT_ONLINE}`, body)
        .then((result) => {
          window.open(result.data.data, '_self');
          setCheckoutLoading(false);
        })
        .finally(() => {
          setCheckoutLoading(false);
        });
  };
  const InvoiceIssue = () => {
    const body = {
      requestDetailId: state.requestDetailId,
    };
    setCheckoutLoading(true);
    !loading &&
      httpRequest
        .postRequest<IOutputResult<any>>(`${'APIURL_POST_TECHNICIAN_INVOICE_CHECKOUT_ONLINE'}`, body)
        .then((result) => {
          setShowConfirmModal(false);
          setCheckoutLoading(false);
        })
        .catch(() => {
          setCheckoutLoading(false);
        });
  };
  const handleShowModal = () => {
    setShowConfirmModal(!showConfirmModal);
  };
  const {
    register,
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<ITechnicianActionModel>({ mode: 'onChange', resolver: yupResolver(AddTechnicianActionModelSchema) });

  const onImageFileChange = (e: any) => {
    const showfiles = e.target.files;
    ResizeAndSave(e, 'location');
    const reader = new FileReader();
    reader.onload = function () {
      setImgSrcList([...imgSrcList, reader.result]);
    };
    reader.readAsDataURL(showfiles[0]);
    // setImageDisplay('flex');
  };
  const resetFiles = () => {
    setBehindFiles(undefined);
    setBehindSrc(undefined);
    setFrontLeftFiles(undefined);
    setFrontLeftSrc(undefined);
    setFrontRightFiles(undefined);
    setFrontRightSrc(undefined);
    setIdentityCardFile(undefined);
    setIdentityCardSrc(undefined);
    setImageFile([]);
    setImgSrcList([]);
    setLableWarrantyFile(undefined);
    setLableWarrantySrc(undefined);
    setPurchaseInvoiceFile(undefined);
    setPurchaseInvoiceSrc(undefined);
  };
  const resetForm = () => {
    setCount(0);
    setTotalPrice(0);
    reset({
      action: { label: '', value: 0 },
      sourceCost: { label: '', value: 0 },
      count: 0,
      serviceTypeId: { label: '', value: 0 },
      description: '',
    });
    setPrice(undefined);
  };
  const onSubmit = (data: ITechnicianActionModel) => {
    if (guarantee) {
      setLoading(true);
      const formData = new FormData();
      if (state.requestDetailId) formData.append('id', state.requestDetailId);
      formData.append('technicianId', technicianId!.toString());
      formData.append('price', data.price.toString());
      formData.append('action', data.action?.value.toString());
      formData.append('sourceCost', data.sourceCost.value.toString());
      formData.append('count', data.count.toString());
      formData.append('serviceTypeId', data.serviceTypeId.value.toString());
      formData.append('userId', technicianId!.toString());
      formData.append('description', data.description);
      formData.append('discountAmount', '0');
      if (warrantyStartDate) formData.append('warrantyStartDate', warrantyStartDate);
      if (frontRightFile) formData.append('frontRight', frontRightFile);
      if (frontLeftFile) formData.append('frontLeft', frontLeftFile);
      if (behindFile) formData.append('behind', behindFile);
      if (identityCardFile) formData.append('identityCard', identityCardFile);
      imageFile?.forEach((image) => {
        formData.append(`locationImages`, image);
      });
      if (purchaseInvoiceFile) formData.append('purchaseInvoice', purchaseInvoiceFile);
      if (lableWarrantyFile) formData.append('lableWarranty', lableWarrantyFile);

      !loading &&
        httpRequestForm
          .postRequest<IOutputResult<any>>(`${APIURL_POST_REQUEST_DETAIL_ACTION_FORMDATA}`, formData)
          .then((result) => {
            resetForm();
            resetFiles();
            toast.showSuccess(result.data.message);
            GetInvoiceAction();
            setLoading(false);
          })
          .finally(() => {
            setLoading(false);
          });
    } else {
      setLoading(true);
      const body = {
        id: state.requestDetailId,
        technicianId: technicianId,
        price: data.price,
        action: data.action?.value,
        sourceCost: data.sourceCost.value,
        count: data.count,
        serviceTypeId: data.serviceTypeId.value,
        userId: technicianId,
        // discountAmount: data.discountAmount,
        description: data.description,
      };

      !loading &&
        httpRequest
          .postRequest<IOutputResult<any>>(`${APIURL_POST_REQUEST_DETAIL_ACTION}`, body)
          .then((result) => {
            resetForm();
            toast.showSuccess(result.data.message);
            GetInvoiceAction();
            setLoading(false);
          })
          .finally(() => {
            setLoading(false);
          });
    }
  };

  useEffect(() => {
    GetInvoiceAction();
    GetSourceCost();
    GetServiceType();
  }, []);

  useEffect(() => {
    document.title = props.title;
  }, [props.title]);

  const ResizeAndSave = async (e: any, side: string) => {
    const file = e.target.files[0];
    await resizeFile(file).then((result: any) => {
      switch (side) {
        case 'location':
          setImageFile([...imageFile, result]);
          break;
        case 'behind':
          setBehindFiles(result);
          break;
        case 'frontLeft':
          setFrontLeftFiles(result);
          break;
        case 'frontRight':
          setFrontRightFiles(result);
          break;
        case 'purchaseInvoice':
          setPurchaseInvoiceFile(result);
          break;
        case 'identityCard':
          setIdentityCardFile(result);
          break;
        case 'lableWarranty':
          setLableWarrantyFile(result);
          break;
        default:
          '';
      }
    });
  };
  return (
    <>
      <PrevHeader />
      <div className="container action-description">
        <div className="">
          <Form onSubmit={handleSubmit(onSubmit)}>
            <div className="row">
              <div className="col-12 col-lg-6">
                <Controller
                  name="serviceTypeId"
                  control={control}
                  render={({ field }) => (
                    <>
                      <div className="d-flex align-items-center">
                        <label htmlFor="form1a" className="ml-2 space-nowrap">
                          نوع خدمات
                        </label>
                        <Select
                          isClearable
                          isLoading={loading}
                          id="form1a"
                          options={serviceTypes}
                          className="w-100"
                          placeholder={'نوع خدمت'}
                          {...field}
                          onChange={(e: any) => {
                            e.label == 'گارانتی' ? setGuarantee(true) : setGuarantee(false);
                            field.onChange(e);
                            setServiceTitle(null);
                            e.value && GetServiceTitle(e?.value);
                          }}
                        />
                      </div>
                      <FormFeedback className="d-block">{errors?.serviceTypeId?.value?.message}</FormFeedback>
                    </>
                  )}
                />
              </div>

              <div className="col-12 col-lg-6">
                <Controller
                  name="action"
                  control={control}
                  render={({ field }) => (
                    <>
                      <div className="d-flex align-items-center">
                        <label htmlFor="form1a" className="ml-2 space-nowrap">
                          گروه خدمات
                        </label>
                        <Select
                          isClearable
                          isLoading={loading}
                          id="form1a"
                          options={serviceTitle}
                          className="w-100"
                          placeholder={'گروه خدمات'}
                          {...field}
                          onChange={(e: any) => {
                            field.onChange(e);
                            setPrice(e.price);
                          }}
                        />
                      </div>
                      <FormFeedback className="d-block">{errors?.action?.value?.message}</FormFeedback>
                    </>
                  )}
                />
              </div>

              <div className="col-12 mt-2">
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <>
                      <div className="action-description-label mt-2">
                        <Input
                          id="form1a"
                          className="form-control pt-3"
                          type="textarea"
                          placeholder={'شرح اقدام'}
                          autoComplete="off"
                          invalid={errors?.description && true}
                          {...field}
                        />
                      </div>
                      <FormFeedback>{errors?.description?.message}</FormFeedback>
                    </>
                  )}
                />
              </div>
            </div>
            <div className="" style={{ display: `${guarantee ? 'flex' : 'none'}` }}>
              <div className="upload-service-images">
                <div className="row">
                  <div className="col-12 col-md-6 col-lg-4 mt-2">
                    {' '}
                    تاریخ شروع گارانتی{' '}
                    <DatePicker
                      render={<InputIcon style={{ height: 'calc(2.4em + 0.75rem - 6px)', width: '100%' }} />}
                      weekDays={weekDays}
                      inputClass="form-control"
                      onChange={(date: any) => {
                        const selectedDate = date.toDate();
                        setWarrantyStartDate(selectedDate.toISOString());
                        console.info(warrantyStartDate);
                      }}
                      format="YYYY/MM/DD"
                      calendar={persian}
                      locale={persian_fa}
                      calendarPosition="bottom-right"
                    />
                  </div>
                  <div className="col-12 col-md-6 col-lg-4">
                    <div className="service-image-item">
                      <img src={require(`@src/scss/images/icons/${color}-behind-product.svg`)} alt="" className="icon" />
                      <p className="title">تصویر پشت دستگاه</p>
                      <div className="imagebox" style={{ backgroundImage: `url(${behindSrc})` }}>
                        <label htmlFor="behindd" className="upload-btn">
                          <a className="upload-btn">{!behindSrc && <img src={require(`@src/scss/images/icons/upload.svg`)} />}</a>
                        </label>
                        <Input
                          onChange={(e) => {
                            // setBehindFiles(e.target.files);
                            ResizeAndSave(e, 'behind');
                            const reader = new FileReader();
                            reader.onload = function () {
                              setBehindSrc(reader.result);
                            };
                            reader.readAsDataURL(e.target.files![0]);
                          }}
                          style={{ display: 'none' }}
                          id="behindd"
                          type="file"
                          accept="image/*"
                        />
                        <a>
                          {behindSrc && (
                            <img
                              src={require(`@src/scss/images/icons/delete.svg`)}
                              onClick={() => {
                                setBehindSrc(undefined), setBehindFiles(undefined);
                              }}
                            />
                          )}
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-md-6 col-lg-4">
                    <div className="service-image-item">
                      <img src={require(`@src/scss/images/icons/${color}-frontright-product.svg`)} alt="" className="icon" />
                      <p className="title">تصویر جلو سمت راست دستگاه</p>
                      <div className="imagebox" style={{ backgroundImage: `url(${frontRightSrc})` }}>
                        <label htmlFor="frontRightt" className="upload-btn">
                          <a className="upload-btn">
                            {' '}
                            {!frontRightSrc && <img src={require(`@src/scss/images/icons/upload.svg`)} />}
                          </a>
                        </label>
                        <Input
                          onChange={(e) => {
                            // setFrontRightFiles(e.target.files);
                            ResizeAndSave(e, 'frontRight');
                            const reader = new FileReader();
                            reader.onload = function () {
                              setFrontRightSrc(reader.result);
                            };
                            reader.readAsDataURL(e.target.files![0]);
                          }}
                          style={{ display: 'none' }}
                          id="frontRightt"
                          type="file"
                          accept="image/*"
                        />
                        <a>
                          {frontRightSrc && (
                            <img
                              src={require(`@src/scss/images/icons/delete.svg`)}
                              onClick={() => {
                                setFrontRightFiles(undefined), setFrontRightSrc(undefined);
                              }}
                            />
                          )}
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-md-6 col-lg-4">
                    <div className="service-image-item">
                      <img src={require(`@src/scss/images/icons/${color}-frontleft-product.svg`)} alt="" className="icon" />
                      <p className="title">تصویر جلو سمت چپ دستگاه</p>
                      <div className="imagebox" style={{ backgroundImage: `url(${frontLeftSrc})` }}>
                        <label htmlFor="frontLeftt" className="upload-btn">
                          <a className="upload-btn">
                            {' '}
                            {!frontLeftSrc && <img src={require(`@src/scss/images/icons/upload.svg`)} />}
                          </a>
                        </label>
                        <Input
                          onChange={(e) => {
                            // setFrontLeftFiles(e.target.files);
                            ResizeAndSave(e, 'frontLeft');
                            const reader = new FileReader();
                            reader.onload = function () {
                              setFrontLeftSrc(reader.result);
                            };
                            reader.readAsDataURL(e.target.files![0]);
                          }}
                          style={{ display: 'none' }}
                          id="frontLeftt"
                          type="file"
                          accept="image/*"
                        />
                        <a>
                          {frontLeftSrc && (
                            <img
                              src={require(`@src/scss/images/icons/delete.svg`)}
                              onClick={() => {
                                setFrontLeftFiles(undefined), setFrontLeftSrc(undefined);
                              }}
                            />
                          )}
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-md-6 col-lg-4">
                    <div className="service-image-item">
                      <img src={require(`@src/scss/images/icons/${color}-purchase-invoice.svg`)} alt="" className="icon" />
                      <p className="title">تصویر فاکتور خرید دستگاه</p>
                      <div className="imagebox" style={{ backgroundImage: `url(${purchaseInvoiceSrc})` }}>
                        <label htmlFor="purchaseInvoice" className="upload-btn">
                          <a className="upload-btn">
                            {' '}
                            {!purchaseInvoiceSrc && <img src={require(`@src/scss/images/icons/upload.svg`)} />}
                          </a>
                        </label>
                        <Input
                          onChange={(e) => {
                            // setPurchaseInvoiceFile(e.target.files);
                            ResizeAndSave(e, 'purchaseInvoice');
                            const reader = new FileReader();
                            reader.onload = function () {
                              setPurchaseInvoiceSrc(reader.result);
                            };
                            reader.readAsDataURL(e.target.files![0]);
                          }}
                          style={{ display: 'none' }}
                          id="purchaseInvoice"
                          type="file"
                          accept="image/*"
                        />
                        <a>
                          {purchaseInvoiceSrc && (
                            <img
                              src={require(`@src/scss/images/icons/delete.svg`)}
                              onClick={() => {
                                setPurchaseInvoiceFile(undefined), setPurchaseInvoiceSrc(undefined);
                              }}
                            />
                          )}
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-md-6 col-lg-4">
                    <div className="service-image-item">
                      <img src={require(`@src/scss/images/icons/${color}-idcard.svg`)} alt="" className="icon" />
                      <p className="title">تصویر برچسب گارانتی</p>
                      <div className="imagebox" style={{ backgroundImage: `url(${lableWarrantySrc})` }}>
                        <label htmlFor="warranty" className="upload-btn">
                          <a className="upload-btn">
                            {' '}
                            {!lableWarrantySrc && <img src={require(`@src/scss/images/icons/upload.svg`)} />}
                          </a>
                        </label>
                        <Input
                          onChange={(e) => {
                            // setLableWarrantyFile(e.target.files);
                            ResizeAndSave(e, 'lableWarranty');
                            const reader = new FileReader();
                            reader.onload = function () {
                              setLableWarrantySrc(reader.result);
                            };
                            reader.readAsDataURL(e.target.files![0]);
                          }}
                          style={{ display: 'none' }}
                          id="warranty"
                          type="file"
                          accept="image/*"
                        />
                        <a>
                          {lableWarrantySrc && (
                            <img
                              src={require(`@src/scss/images/icons/delete.svg`)}
                              onClick={() => {
                                setLableWarrantyFile(undefined), setLableWarrantySrc(undefined);
                              }}
                            />
                          )}
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-md-6 col-lg-4">
                    <div className="service-image-item">
                      <img src={require(`@src/scss/images/icons/${color}-idcard.svg`)} alt="" className="icon" />
                      <p className="title">تصویر کارت شناسایی خریدار</p>
                      <div className="imagebox" style={{ backgroundImage: `url(${identityCardSrc})` }}>
                        <label htmlFor="id-card" className="upload-btn">
                          <a className="upload-btn">
                            {' '}
                            {!identityCardSrc && <img src={require(`@src/scss/images/icons/upload.svg`)} />}
                          </a>
                        </label>
                        <Input
                          onChange={(e) => {
                            // setIdentityCardFile(e.target.files);
                            ResizeAndSave(e, 'identityCard');
                            const reader = new FileReader();
                            reader.onload = function () {
                              setIdentityCardSrc(reader.result);
                            };
                            reader.readAsDataURL(e.target.files![0]);
                          }}
                          style={{ display: 'none' }}
                          id="id-card"
                          type="file"
                          accept="image/*"
                        />
                        <a>
                          {identityCardSrc && (
                            <img
                              src={require(`@src/scss/images/icons/delete.svg`)}
                              onClick={() => {
                                setIdentityCardFile(undefined), setIdentityCardSrc(undefined);
                              }}
                            />
                          )}
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-md-6 col-lg-4">
                    <div className="service-image-item column-item">
                      <div className="d-flex justify-content-between w-100">
                        <img src={require(`@src/scss/images/icons/${color}-location.svg`)} alt="" className="icon" />
                        <p className="title ml-auto">تصاویر موقعیت مکانی دستگاه </p>
                        <div className="imagebox" style={{ backgroundImage: "url('src/scss/images/4.jpg')" }}>
                          <label htmlFor="imgList" className="upload-btn">
                            <a className="upload-btn">
                              <img src={require(`@src/scss/images/icons/upload.svg`)} />
                            </a>
                          </label>
                          <Input
                            onChange={onImageFileChange}
                            style={{ display: 'none' }}
                            id="imgList"
                            type="file"
                            accept="image/*"
                          />
                        </div>
                      </div>
                      <div className="image-gallery">
                        {imgSrcList &&
                          imgSrcList.length > 0 &&
                          imgSrcList.map((img: any, index: number) => {
                            return (
                              <>
                                <div className="imagebox" style={{ backgroundImage: `url(${img})` }}>
                                  <label htmlFor="" className="upload-btn">
                                    <a className="upload-btn"></a>
                                  </label>
                                  <a>
                                    {/* remove from array */}
                                    <img
                                      src={require(`@src/scss/images/icons/delete.svg`)}
                                      onClick={(e) => {
                                        setImgSrcList([...imgSrcList.slice(0, index), ...imgSrcList.slice(index + 1)]);
                                        setImageFile([...imageFile.slice(0, index), ...imageFile.slice(index + 1)]);
                                      }}
                                    />
                                  </a>
                                </div>
                              </>
                            );
                          })}

                        {/* <div className="imagebox" style={{ backgroundImage: "url('src/scss/images/4.jpg')" }}>
                          <label htmlFor="behind" className="upload-btn">
                            <a className="upload-btn">
                              <img src={require(`@src/scss/images/icons/upload.svg`)} />
                            </a>
                          </label>
                          <a>
                            <img src={require(`@src/scss/images/icons/delete.svg`)} />
                          </a>
                        </div> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-12 col-md-4">
                <div className="d-flex align-items-center">
                  <label htmlFor="form1b" className="ml-2 space-nowrap">
                    منبع هزینه
                  </label>
                  <div className="w-100">
                    <Controller
                      name="sourceCost"
                      control={control}
                      defaultValue={{ label: 'مشتری', value: 0 }}
                      render={({ field }) => (
                        <>
                          <Select
                            isClearable
                            isLoading={loading}
                            id="form1b"
                            options={sourceCost}
                            className=""
                            placeholder={'منبع هزینه'}
                            {...field}
                          />
                          <FormFeedback className="d-block">{errors?.sourceCost?.value?.message}</FormFeedback>
                        </>
                      )}
                    />
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-4">
                <Controller
                  name="count"
                  control={control}
                  // defaultValue={1}
                  render={({ field }) => (
                    <>
                      <div className="d-flex align-items-center">
                        <label htmlFor="count-input" className="ml-2 space-nowrap">
                          تعداد
                        </label>
                        <Input
                          id="count-input"
                          className="form-control"
                          type="number"
                          autoComplete="off"
                          invalid={errors?.count && true}
                          {...field}
                          onChange={(e: any) => {
                            e.target.value
                              ? (field.onChange(e), setTotalPrice(e.target.value * price), setCount(e.target.value))
                              : setCount(0);
                          }}
                        />
                      </div>
                      <FormFeedback>{errors?.count?.message}</FormFeedback>
                    </>
                  )}
                />
              </div>

              <div className="col-12 col-md-4">
                <Controller
                  name="price"
                  control={control}
                  render={({ field }) => (
                    <>
                      <FormFeedback>{errors?.price?.message}</FormFeedback>
                      <div className="d-flex align-items-center">
                        <label htmlFor="price-input" className="ml-2 space-nowrap">
                          قیمت
                        </label>
                        <Input
                          id="price-input"
                          className="form-control"
                          type="number"
                          placeholder={UtilsHelper.threeDigitSeparator(price)}
                          autoComplete="off"
                          invalid={errors?.price && true}
                          {...field}
                          onChange={(e: any) => {
                            e.target.value
                              ? (field.onChange(e), setTotalPrice(e.target.value * count), setPrice(e.target.value))
                              : setPrice(0);
                          }}
                        />
                      </div>
                    </>
                  )}
                />
              </div>

              <div className="col-12">
                <div className="d-flex align-items-center flex-wrap mt-3 mb-3">
                  <div className="ml-auto" style={{ justifyContent: 'space-evenly', alignItems: 'baseline' }}>
                    <div>
                      <label className="fit-content" style={{ width: '30x' }}>
                        مبلغ :{' '}
                      </label>
                      <label className="fit-content">{UtilsHelper.threeDigitSeparator(totalPrice)} ریال</label>
                    </div>

                    <div>
                      <label className="fit-content space-nowrap">مبلغ به حروف : </label>
                      <label className="fit-content">{Num2persian(Number(totalPrice) / 10)} تومان</label>
                    </div>
                    {/* <div>
                      <label>کد تخفیف</label>
                      <Input
                        style={{ width: '150px' }}
                        className="m-2 p-3"
                        name="discount"
                        type="text"
                        readOnly
                        defaultValue={0}
                        placeholder="تخفیف"
                      />
                    </div> */}
                    {/* <div>
                      <label className="m-2 select-width-action">مالیات</label>
                      <label className="m-2 select-width-action">
                        {UtilsHelper.threeDigitSeparator((parseInt(totalPrice.toString()) * 9) / 100)}
                      </label>
                    </div> */}
                  </div>
                  <Button type="submit" className="add-action-btn">
                    {loading ? <Spinner /> : '+ افزودن'}
                  </Button>
                </div>
              </div>
            </div>
          </Form>
        </div>
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
                invoice.length &&
                invoice.map((invoice: IInvoiceActionResultModel, index: number) => {
                  return (
                    <div className="col-12  col-lg-6 mb-2">
                      <div className="running-item">
                        <div className="d-flex align-items-center w-100">
                          <div className="space-nowrap">
                            {index + 1}- {invoice.serviceTypeTitle} :
                          </div>

                          <div className="description">{invoice.actionTitle}</div>
                          <UncontrolledTooltip placement="top" target={`registerTip${index}`}>
                            {invoice.description}
                          </UncontrolledTooltip>
                          <img
                            src={require(`@src/scss/images/icons/${color}-message.svg`)}
                            className="info-btn"
                            id={`registerTip${index}`}
                          ></img>
                        </div>
                        <div className="d-flex align-items-center mt-2 w-100">
                          {invoice.settlementStatus ? (
                            <img src={require(`@src/scss/images/icons/${color}-checked.svg`)} className="waiting-glass" />
                          ) : (
                            <img src={require(`@src/scss/images/icons/hourglass.svg`)} className="waiting-glass" />
                          )}
                          مبلغ : {UtilsHelper.threeDigitSeparator(invoice.price)} <span className="rial ml-auto">ریال</span>
                          <div className="">
                            {invoice.settlementStatus ? (
                              <div>{invoice.paymentType}</div>
                            ) : invoice.costSource == 1 ? (
                              <div>{ECostSource[invoice.costSource]}</div>
                            ) : (
                              <>
                                {/* <img
                                  onClick={() => {
                                    Checkout(invoice.paymentId, invoice.priceAfterDiscount);
                                  }}
                                  src={require(`@src/scss/images/icons/${color}-cash.svg`)}
                                  className="cash-btn"
                                /> */}
                                <Button
                                  className="cash-btn success-btn green-btn"
                                  onClick={() => {
                                    Checkout(invoice.paymentId, invoice.priceAfterDiscount);
                                  }}
                                >
                                  <img src={require(`@src/scss/images/icons/${color}-cash.svg`)} className="cash-icon" />
                                  {checkoutLoading ? <Spinner /> : 'پرداخت '}
                                </Button>

                                {/* <UncontrolledDropdown>
                                  <DropdownToggle caret>پرداخت</DropdownToggle>
                                  <DropdownMenu>
                                    <DropdownItem
                                      onClick={() => {
                                        Checkout(invoice.paymentId, invoice.priceAfterDiscount);
                                      }}
                                    >
                                      {checkoutLoading ? <Spinner /> : 'نقدی'}
                                    </DropdownItem>
                                    <DropdownItem
                                      onClick={() => {
                                        CheckoutOnline(invoice.paymentId, invoice.priceAfterDiscount);
                                      }}
                                    >
                                      {checkoutLoading ? <Spinner /> : 'آنلاین'}
                                    </DropdownItem>
                                  </DropdownMenu>
                                </UncontrolledDropdown> */}
                                {/* <RWebShare
                                  data={{
                                    text: `لینک پرداخت هزینه بابت ${invoice.actionTitle} `,
                                    url: `${invoice.paymentUrl}`,
                                    title: 'کاردون',
                                  }}
                                > */}
                                {/* <img src={require(`@src/scss/images/icons/${color}-share.svg`)} className="share-btn" /> */}
                                {/* </RWebShare> */}
                              </>
                            )}
                            <div>
                              {invoice.settlementStatus ? (
                                ''
                              ) : (
                                <img
                                  className="close"
                                  src={require(`@src/scss/images/icons/${color}-close.svg`)}
                                  onClick={() => {
                                    setPaymentId(invoice.paymentId);
                                    setConfirmRemoveModalVisible(true);
                                  }}
                                />
                                // <div
                                //   style={{ marginLeft: '10px', cursor: 'pointer', marginRight: '5px' }}

                                //   className="fa fa-times color-red-dark"
                                // />
                              )}
                            </div>
                          </div>
                        </div>

                        <div style={{ textAlign: 'center' }} className={invoice.discount ? 'discount' : 'mr-l-auto'}>
                          <div></div>
                        </div>
                        {invoice.discount ? (
                          <div className="p-1">{UtilsHelper.threeDigitSeparator(invoice.priceAfterDiscount)}</div>
                        ) : (
                          ''
                        )}

                        <div className="d-flex flex-wrap justify-content-start">
                          {invoice.files &&
                            invoice.files.length > 0 &&
                            invoice.files.map((img: IFiles, index: number) => {
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
              {/* <Button
                onClick={() => navigate(URL_TECHNICIAN_FACTOR)}
                className="btn btn-m btn-full mb-3 rounded-xs text-uppercase font-700 shadow-s border-blue-dark bg-blue-light"
              >
                {checkoutLoading ? (
                  <Spinner />
                ) : (
                  <>
                    مشاهده فاکتور<span className="fa-fw select-all fas"></span>
                  </>
                )}
              </Button> */}
            </div>
            <Button
              onClick={() => {
                handleShowModal();
              }}
              className="btn-info btn btn-secondary w-100 mt-3"
            >
              {checkoutLoading ? <LoadingComponent /> : 'صدور فاکتور'}
            </Button>
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

export default Action;