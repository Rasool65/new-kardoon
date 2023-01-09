import { yupResolver } from '@hookform/resolvers/yup';
import LoadingComponent from '@src/components/spinner/LoadingComponent';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import { useToast } from '@src/hooks/useToast';
import { RootStateType } from '@src/redux/Store';
import { FunctionComponent, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Button, Form, FormFeedback, Input } from 'reactstrap';
import Select from 'react-select';
import InputIcon from 'react-multi-date-picker/components/input_icon';
import DatePicker from 'react-multi-date-picker';
import { IOutputResult } from '@src/models/output/IOutputResult';
import { IProductsResultModel } from '@src/models/output/products/IProductsResultModel';
import {
  APIURL_GET_CATEGORIES,
  APIURL_GET_DEVICE_TYPE_WITH_PARENT_INFO,
  APIURL_GET_SERVICES,
  APIURL_POST_CREATE_REQUEST_BY_TECHNICIAN,
  APIURL_POST_REQUEST_TECHNICIAN_WITH_ADDRESS,
} from '@src/configs/apiConfig/apiUrls';
import useHttpRequest from '@src/hooks/useHttpRequest';
import { IServicesResultModel } from '@src/models/output/services/IServicesResultModel';
import {
  ITechnicianRequestConsumerModel,
  ITechnicianRequestConsumerModelSchema,
} from '@src/models/input/technicianRequestConsumer/ITechnicianRequestConsumerModel';

interface AddRequestProps {
  userName: string;
  refKey: number;
  id: number;
}

const AddRequest: FunctionComponent<AddRequestProps> = ({ userName, refKey, id }) => {
  let newCategory: any[];
  let newProducts: any[];
  const toast = useToast();
  const { t }: any = useTranslation();
  const httpRequest = useHttpRequest();
  const [loading, setLoading] = useState<boolean>(false);
  const [services, setServices] = useState<any>();
  const [categories, setCategories] = useState<any>();
  const [products, setProducts] = useState<any>();
  const [categoryId, setCategoryId] = useState<number>();
  const [isUrgent, setIsUrgent] = useState<boolean>();
  const userData = useSelector((state: RootStateType) => state.authentication.userData);
  const weekDays = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];
  const shifts: any[] = [
    { label: 'صبح', value: 1 },
    { label: 'ظهر', value: 2 },
    { label: 'عصر', value: 3 },
    { label: 'شب', value: 4 },
  ];

  const GetServices = () => {
    setLoading(true);
    httpRequest
      .getRequest<IOutputResult<IServicesResultModel>>(`${APIURL_GET_SERVICES}?CityId=${userData?.profile.residenceCityId}`)
      .then((result) => {
        setServices(result.data.data);
        setLoading(false);
      });
  };

  const GetCategoryList = (serviceTypeId: number) => {
    setLoading(true);
    httpRequest
      .getRequest<IOutputResult<any>>(
        `${APIURL_GET_CATEGORIES}?CityId=${userData?.profile.residenceCityId}&ServiceTypeId=${serviceTypeId}`
      )
      .then((result) => {
        if (result.data.data) {
          newCategory = [];
          for (var i = 0; i < result.data.data.length; i++) {
            newCategory.push({ value: result.data.data[i].id, label: result.data.data[i].name });
          }
        }
        setCategories(newCategory);
        setLoading(false);
      });
  };

  const GetProducts = (productCategoryId: number, serviceTypeId: number) => {
    setLoading(true),
      httpRequest
        .getRequest<IOutputResult<IProductsResultModel[]>>(
          `${APIURL_GET_DEVICE_TYPE_WITH_PARENT_INFO}?CityId=${userData?.profile.residenceCityId}&ProductCategoryId=${productCategoryId}&ServiceTypeId=${serviceTypeId}`
        )
        .then((result) => {
          if (result.data.data) {
            newProducts = [];
            for (var i = 0; i < result.data.data.length; i++) {
              newProducts.push({ value: result.data.data[i].id, label: result.data.data[i].title });
            }
          }

          setProducts(newProducts);
          setLoading(false);
        });
  };

  const {
    register,
    control,
    reset,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<ITechnicianRequestConsumerModel>({
    mode: 'onChange',
    resolver: yupResolver(ITechnicianRequestConsumerModelSchema),
  });
  const onSubmit = (data: ITechnicianRequestConsumerModel) => {
    if (!refKey) return toast.showError('لطفأ ابتدا آدرس را مشخص کنید');
    setLoading(true);
    const body = {
      consumerId: id,
      technicianId: userData?.userId,
      presenceDate: data.presenceDate,
      presenceShift: data.presenceShift?.value,
      isUrgent: isUrgent,
      consumerAddressId: refKey,
      requestDetail: {
        serviceTypeId: data.requestDetail.serviceTypeId.value,
        productCategoryId: data.requestDetail.productCategoryId.value,
        requestDescription: data.requestDetail.requestDescription,
      },
    };
    !loading &&
      httpRequest
        .postRequest<IOutputResult<any>>(`${APIURL_POST_CREATE_REQUEST_BY_TECHNICIAN}`, body)
        .then((result) => {
          result.data.isSuccess ? (toast.showSuccess(result.data.message), reset()) : toast.showError(result.data.message);
          setLoading(false);
        })
        .finally(() => {
          setLoading(false);
        });
  };
  useEffect(() => {
    GetServices();
  }, []);

  return (
    <>
      <div className="container">
        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className="card mt-4">
            <div className="section-1">
              {/* <div className="details-bar">
                  <p className="m-1">نام مشتری :</p>
                  <p className="m-1">{state.consumerFullName}</p>
                </div>

                <div className="details-bar">
                  <p className="m-1">آدرس جاری:</p>
                  <p className="m-1">{state.consumerAddress}</p>
                </div> */}
              {/* Controller haye new address here */}

              <div className="row">
                <div className={`col-12 col-lg-4 ${isUrgent && 'col-12 col-lg-12'}`}>
                  <div className="d-flex align-items-center my-15">
                    <Input
                      type="checkbox"
                      className="checkbox-form"
                      onChange={(e: any) => {
                        setIsUrgent(e.currentTarget.checked);
                      }}
                    />
                    <div className={`${isUrgent && 'd-none'} mr-2`}>
                      <label className={`sos-box mr-1`}>SOS</label>درخواست فوری
                    </div>
                    <span className={`text-space-wrap h-auto sos-text ${!isUrgent && 'd-none'}`}>
                      در حالت درخواست فوری امکان انتخاب تاریخ و زمان وجود ندارد
                    </span>
                  </div>
                </div>
                <div className={`col-12 col-md-6 col-lg-4 ${isUrgent && 'd-none'}`}>
                  <Controller
                    name="presenceDate"
                    control={control}
                    render={({ field: { onChange, name, value } }) => (
                      <>
                        <DatePicker
                          render={
                            <InputIcon
                              style={{ height: 'calc(2.4em + 0.75rem - 6px)', width: '100%' }}
                              className="form-control"
                              // style={darkMode ? darkStyle : lighStyle}
                            />
                          }
                          weekDays={weekDays}
                          placeholder="تاریخ مراجعه"
                          inputClass="form-control"
                          onChange={(date: any) => {
                            const selectedDate = date.toDate();
                            onChange(selectedDate.toISOString());
                          }}
                          value={value}
                          format="YYYY/MM/DD"
                          calendar={persian}
                          locale={persian_fa}
                          calendarPosition="bottom-right"
                        />
                        <FormFeedback className="d-block">{errors.presenceDate?.message}</FormFeedback>
                      </>
                    )}
                  />
                </div>
                <div className={`col-12 col-md-6 col-lg-4 ${isUrgent && 'd-none'}`}>
                  <Controller
                    name="presenceShift"
                    control={control}
                    render={({ field }) => (
                      <>
                        <Select
                          isClearable
                          isLoading={loading}
                          options={shifts}
                          className=""
                          placeholder={'انتخاب شیفت'}
                          {...field}
                          onChange={(e: any) => {
                            field.onChange(e);
                          }}
                        />
                        <FormFeedback className="d-block">{errors?.presenceShift?.value?.message}</FormFeedback>
                      </>
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-12 col-md-4">
                <Controller
                  name="requestDetail.serviceTypeId"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Select
                        isClearable
                        isLoading={loading}
                        options={services}
                        className=""
                        placeholder={'نوع خدمت'}
                        {...field}
                        onChange={(e: any) => {
                          setValue('requestDetail.productCategoryId', { value: 0, label: '' });
                          setValue('requestDetail.productGroup', { value: undefined, label: '' });
                          field.onChange(e);
                          setCategories(null);
                          e.value && GetCategoryList(e?.value), setCategoryId(e?.value);
                        }}
                      />
                      <FormFeedback className="d-block">{errors?.requestDetail?.serviceTypeId?.value?.message}</FormFeedback>
                    </>
                  )}
                />
              </div>

              <div className="col-12 col-md-4">
                <Controller
                  name="requestDetail.productGroup"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Select
                        isClearable
                        isLoading={loading}
                        options={categories}
                        className=""
                        placeholder={'گروه محصول'}
                        {...field}
                        onChange={(e: any) => {
                          setValue('requestDetail.productCategoryId', { value: 0, label: '' });
                          field.onChange(e);
                          GetProducts(e.value, categoryId!);
                        }}
                      />
                      <FormFeedback className="d-block">{errors?.requestDetail?.productCategoryId?.value?.message}</FormFeedback>
                    </>
                  )}
                />
              </div>

              <div className="col-12 col-md-4">
                <Controller
                  name="requestDetail.productCategoryId"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Select
                        isClearable
                        isLoading={loading}
                        options={products}
                        className=""
                        placeholder={'نوع محصول'}
                        {...field}
                        onChange={(e: any) => {
                          field.onChange(e);
                        }}
                      />
                      <FormFeedback className="d-block">{errors?.requestDetail?.productCategoryId?.value?.message}</FormFeedback>
                    </>
                  )}
                />
              </div>
              <div className="col-12">
                <Controller
                  name="requestDetail.requestDescription"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Input
                        type="textarea"
                        placeholder={'توضیحات درخواست'}
                        autoComplete="off"
                        invalid={errors?.requestDetail?.requestDescription && true}
                        {...field}
                      />
                      <FormFeedback>{errors?.requestDetail?.requestDescription?.message}</FormFeedback>
                    </>
                  )}
                />
              </div>
            </div>

            <Button type="submit" className="btn-info btn btn-secondary green-btn w-100 mt-4">
              {loading ? <LoadingComponent /> : 'ثبت درخواست '}
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
};

export default AddRequest;
