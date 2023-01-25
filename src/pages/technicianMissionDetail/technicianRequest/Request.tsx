import { yupResolver } from '@hookform/resolvers/yup';
import LoadingComponent from '@src/components/spinner/LoadingComponent';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import {
  APIURL_GET_ADDRESS_TITLE,
  APIURL_GET_CATEGORIES,
  APIURL_GET_CITIES,
  APIURL_GET_COUNTRIES,
  APIURL_GET_DEVICE_TYPE_WITH_PARENT_INFO,
  APIURL_GET_DISTRICTS,
  APIURL_GET_PROVINES,
  APIURL_GET_REGIONES,
  APIURL_GET_SERVICES,
  APIURL_POST_REQUEST_TECHNICIAN_WITH_ADDRESS,
} from '@src/configs/apiConfig/apiUrls';
import useHttpRequest from '@src/hooks/useHttpRequest';
import { useToast } from '@src/hooks/useToast';
import { IOutputResult } from '@src/models/output/IOutputResult';
import { IProductsResultModel } from '@src/models/output/products/IProductsResultModel';
import { RootStateType } from '@src/redux/Store';
import { FunctionComponent, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Button, Form, FormFeedback, Input } from 'reactstrap';
import Select from 'react-select';
import { IServicesResultModel } from '@src/models/output/services/IServicesResultModel';
import {
  AddTechnicianRequestModelSchema,
  ITechnicianRequestModel,
} from '@src/models/input/technicianRequest/ITechnicianRequestModel';
import { ICountryResultModel } from '@src/models/output/countryDivision/ICountryResultModel';
import { IProvinceResultModel } from '@src/models/output/countryDivision/IProvinceResultModel';
import { ICitiesResultModel } from '@src/models/output/countryDivision/ICitiesResultModel';
import { IRegionResultModel } from '@src/models/output/countryDivision/IRegionResultModel';
import { IDistrictsResultModel } from '@src/models/output/countryDivision/IDistrictsResultModel';
import { useTranslation } from 'react-i18next';
import DatePicker from 'react-multi-date-picker';
import InputIcon from 'react-multi-date-picker/components/input_icon';
import { ITitleResultModel } from '@src/models/output/missionDetail/ITitleResultModel';

interface RequestProps {}

const Request: FunctionComponent<RequestProps> = () => {
  let newCategory: any[];
  let newProducts: any[];
  const toast = useToast();
  const { t }: any = useTranslation();
  const { state }: any = useLocation();
  const httpRequest = useHttpRequest();
  const [countries, setCountries] = useState<ICountryResultModel[]>();
  const [titles, setTitles] = useState<ITitleResultModel[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const [provinces, setProvinces] = useState<IProvinceResultModel[]>();
  const [cities, setCities] = useState<ICitiesResultModel[]>();
  const [regiones, setRegion] = useState<IRegionResultModel[]>();
  const [distritcs, setDistritcs] = useState<IDistrictsResultModel[]>();
  const [countryId, setCountryId] = useState<number>();
  const [provinceId, setProvinceId] = useState<number>();
  const [cityId, setCityId] = useState<number>();
  const [regionId, setRegionId] = useState<number>();
  const [districtId, setDistrictId] = useState<number>();
  const [services, setServices] = useState<any>();
  const [categories, setCategories] = useState<any>();
  const [products, setProducts] = useState<any>();
  const [categoryId, setCategoryId] = useState<number>();
  const [regionShow, setRegionShow] = useState<boolean>(false);
  const [isUrgent, setIsUrgent] = useState<boolean>();
  const userData = useSelector((state: RootStateType) => state.authentication.userData);
  const weekDays = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];

  const GetProvincesList = (countryId: number) => {
    setLoading(true);
    httpRequest
      .getRequest<IOutputResult<IProvinceResultModel[]>>(`${APIURL_GET_PROVINES}?ParentId=${countryId}`)
      .then((result) => {
        setProvinces(result.data.data);
        setLoading(false);
      });
  };
  const GetCityList = (provinesId: number) => {
    setLoading(true);
    httpRequest.getRequest<IOutputResult<ICitiesResultModel[]>>(`${APIURL_GET_CITIES}?ParentId=${provinesId}`).then((result) => {
      setCities(result.data.data);
      setLoading(false);
    });
  };

  const GetRegionList = (citiesId: number) => {
    setLoading(true);
    httpRequest.getRequest<IOutputResult<IRegionResultModel[]>>(`${APIURL_GET_REGIONES}?ParentId=${citiesId}`).then((result) => {
      result.data.data.length > 0
        ? (setRegion(result.data.data), setRegionShow(false))
        : (GetDistrictList(citiesId), setRegionShow(true)),
        setLoading(false);
    });
  };

  const GetDistrictList = (regionId: number) => {
    setLoading(true);
    httpRequest
      .getRequest<IOutputResult<IDistrictsResultModel[]>>(`${APIURL_GET_DISTRICTS}?ParentId=${regionId}`)
      .then((result) => {
        setDistritcs(result.data.data);
        setLoading(false);
      });
  };

  const GetCountryList = () => {
    setLoading(true);
    httpRequest.getRequest<IOutputResult<ICountryResultModel[]>>(`${APIURL_GET_COUNTRIES}`).then((result) => {
      setCountries(result.data.data);
      setLoading(false);
    });
  };
  const GetTitles = () => {
    setLoading(true);
    httpRequest.getRequest<IOutputResult<ITitleResultModel[]>>(`${APIURL_GET_ADDRESS_TITLE}`).then((result) => {
      setTitles(result.data.data);
      setLoading(false);
    });
  };

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
  } = useForm<ITechnicianRequestModel>({ mode: 'onChange', resolver: yupResolver(AddTechnicianRequestModelSchema) });

  const resetForm = () => {
    reset();
    //     {
    //   productGroup: { label: '', value: 0 },
    //   serviceTypeId: { label: '', value: 0 },
    //   productCategoryId: { label: '', value: 0 },
    //   requestDescription: '',
    // }
  };
  const onSubmit = (data: ITechnicianRequestModel) => {
    setLoading(true);
    const body = {
      consumerId: state.consumerId,
      presenceDate: data.presenceDate,
      presenceShift: data.presenceShift?.value,
      isUrgent: isUrgent,
      requestDetail: {
        serviceTypeId: data.requestDetail.serviceTypeId.value,
        productCategoryId: data.requestDetail.productCategoryId.value,
        requestDescription: data.requestDetail.requestDescription,
      },
      consumerAddress: {
        provinceId: data.consumerAddress.provinceId.value,
        cityId: data.consumerAddress.cityId.value,
        districtId: data.consumerAddress.districtId.value,
        regionId: data.consumerAddress.regionId.value,
        countryId: data.consumerAddress.countryId?.value,
        latitude: 0,
        longitude: 0,
        title: data.consumerAddress.title.value,
        homeTel: data.consumerAddress.homeTel,
        address: data.consumerAddress.address,
        number: data.consumerAddress.number,
        unit: data.consumerAddress.unit,
        zipCode: data.consumerAddress.zipCode,
      },
    };
    !loading &&
      httpRequest
        .postRequest<IOutputResult<any>>(`${APIURL_POST_REQUEST_TECHNICIAN_WITH_ADDRESS}`, body)
        .then((result) => {
          result.data.isSuccess ? (toast.showSuccess(result.data.message), resetForm()) : toast.showError(result.data.message);
          setLoading(false);
        })
        .finally(() => {
          setLoading(false);
        });
  };

  useEffect(() => {
    GetTitles();
    GetServices();
    GetCountryList();
  }, []);

  return (
    <>
      <div className="mission-details new-request">
        <div className="container">
          <Form onSubmit={handleSubmit(onSubmit)}>
            <div className="card mt-4">
              <div className="section-1">
                <div className="details-bar">
                  <p className="m-1">نام مشتری :</p>
                  <p className="m-1">{state.consumerFullName}</p>
                </div>

                <div className="details-bar">
                  <p className="m-1">آدرس جاری:</p>
                  <p className="m-1">{state.consumerAddress}</p>
                </div>
                <div className="details-bar">
                  <p className="m-1">انتخاب آدرس جدید </p>
                </div>
                {/* Controller haye new address here */}
                <div className="row">
                  <div className="col-12 col-md-6 col-lg-3">
                    <Controller
                      name="consumerAddress.title"
                      control={control}
                      render={({ field }) => (
                        <>
                          <Select
                            isClearable
                            isLoading={loading}
                            options={titles}
                            className=""
                            placeholder={'نوع آدرس را انتخاب نمایید'}
                            {...field}
                            onChange={(e: any) => {
                              field.onChange(e);
                            }}
                          />
                          <FormFeedback className="d-block">{errors?.consumerAddress?.title?.value?.message}</FormFeedback>
                        </>
                      )}
                    />
                  </div>
                  <div className="col-12 col-md-6 col-lg-3">
                    <Controller
                      name="consumerAddress.zipCode"
                      control={control}
                      render={({ field }: any) => (
                        <>
                          <Input
                            className=""
                            type="number"
                            placeholder={t('EnterZipCode')}
                            autoComplete="off"
                            invalid={errors.consumerAddress?.zipCode && true}
                            {...field}
                          />
                          <FormFeedback>{errors.consumerAddress?.zipCode?.message}</FormFeedback>
                        </>
                      )}
                    />
                  </div>
                  <div className="col-12 col-md-6 col-lg-3">
                    {/* کشور */}
                    <Controller
                      name="consumerAddress.countryId"
                      control={control}
                      render={({ field }) => (
                        <>
                          <Select
                            isClearable
                            isLoading={loading}
                            options={countries}
                            className=""
                            placeholder={t('SelectCountry')}
                            {...field}
                            onChange={(e: any) => {
                              field.onChange(e);
                              e ? (setCountryId(e.value), GetProvincesList(e.value)) : setCountryId(undefined),
                                setProvinces([]),
                                GetCountryList();
                            }}
                          />
                          <FormFeedback className="d-block">{errors?.consumerAddress?.countryId?.value?.message}</FormFeedback>
                        </>
                      )}
                    />
                  </div>
                  <div className="col-12 col-md-6 col-lg-3">
                    <Controller
                      name="consumerAddress.provinceId"
                      control={control}
                      render={({ field }) => (
                        <>
                          <Select
                            isClearable
                            isLoading={loading}
                            noOptionsMessage={() => t('ListIsEmpty')}
                            placeholder={t('SelectProvince')}
                            options={provinces}
                            isSearchable={true}
                            className=""
                            {...field}
                            onChange={(e: any) => {
                              field.onChange(e);
                              e ? (setProvinceId(e.value), GetCityList(e.value)) : setProvinceId(undefined),
                                setCities([]),
                                GetProvincesList(countryId!);
                            }}
                          />
                          <FormFeedback className="d-block">{errors?.consumerAddress?.provinceId?.value?.message}</FormFeedback>
                        </>
                      )}
                    />
                  </div>
                  <div className="col-12 col-md-6 col-lg-3">
                    {/* شهر */}
                    <Controller
                      name="consumerAddress.cityId"
                      control={control}
                      render={({ field }) => (
                        <>
                          <Select
                            isClearable
                            isLoading={loading}
                            noOptionsMessage={() => t('ListIsEmpty')}
                            placeholder={t('SelectCity')}
                            options={cities}
                            isSearchable={true}
                            className=""
                            {...field}
                            onChange={(e: any) => {
                              field.onChange(e);
                              e ? (setCityId(e.value), setRegionId(e.value), GetRegionList(e.value)) : setRegion([]),
                                GetCityList(provinceId!);
                            }}
                          />
                          <FormFeedback className="d-block">{errors?.consumerAddress?.cityId?.value?.message}</FormFeedback>
                        </>
                      )}
                    />
                  </div>
                  <div className="col-12 col-md-6 col-lg-3">
                    {/* منطقه */}
                    <Controller
                      name="consumerAddress.regionId"
                      control={control}
                      render={({ field }) => (
                        <>
                          <Select
                            isClearable
                            isDisabled={regionShow}
                            isLoading={loading}
                            noOptionsMessage={() => t('ListIsEmpty')}
                            placeholder={t('SelectRegion')}
                            options={regiones}
                            isSearchable={true}
                            className=""
                            {...field}
                            onChange={(e: any) => {
                              field.onChange(e);
                              e
                                ? (setRegionId(e.value), setDistrictId(e.value), GetDistrictList(e.value))
                                : setDistrictId(undefined),
                                setDistritcs([]);
                              //   GetRegionList(cityId!);
                            }}
                          />
                          <FormFeedback className="d-block">{errors?.consumerAddress?.regionId?.value?.message}</FormFeedback>
                        </>
                      )}
                    />
                  </div>
                  <div className="col-12 col-md-6 col-lg-3">
                    {/* محله */}
                    <Controller
                      name="consumerAddress.districtId"
                      control={control}
                      render={({ field }) => (
                        <>
                          <Select
                            isClearable
                            isLoading={loading}
                            noOptionsMessage={() => t('ListIsEmpty')}
                            placeholder={t('SelectDistrict')}
                            options={distritcs}
                            isSearchable={true}
                            className=""
                            {...field}
                            onChange={(e: any) => {
                              field.onChange(e);
                              setDistrictId(e.value);
                            }}
                          />
                          <FormFeedback className="d-block">{errors?.consumerAddress?.districtId?.value?.message}</FormFeedback>
                        </>
                      )}
                    />
                  </div>

                  <div className="col-12 col-md-6 col-lg-3">
                    <Controller
                      name="consumerAddress.homeTel"
                      control={control}
                      render={({ field }: any) => (
                        <>
                          <Input
                            className=""
                            type="number"
                            placeholder={t('EnterHomeTel')}
                            autoComplete="off"
                            invalid={errors.consumerAddress?.homeTel && true}
                            {...field}
                          />
                          <FormFeedback>{errors.consumerAddress?.homeTel?.message}</FormFeedback>
                        </>
                      )}
                    />
                  </div>

                  <div className="col-12">
                    <Controller
                      name="consumerAddress.address"
                      control={control}
                      render={({ field }: any) => (
                        <>
                          <Input
                            className=""
                            type="text"
                            placeholder={t('EnterAddress')}
                            autoComplete="off"
                            invalid={errors.consumerAddress?.address && true}
                            {...field}
                          />
                          <FormFeedback>{errors.consumerAddress?.address?.message}</FormFeedback>
                        </>
                      )}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-6">
                    <Controller
                      name="consumerAddress.number"
                      control={control}
                      render={({ field }: any) => (
                        <>
                          <Input
                            className=""
                            type="number"
                            placeholder={t('EnterNumber')}
                            autoComplete="off"
                            invalid={errors.consumerAddress?.number && true}
                            {...field}
                          />
                          <FormFeedback>{errors.consumerAddress?.number?.message}</FormFeedback>
                        </>
                      )}
                    />
                  </div>

                  <div className="col-6">
                    <Controller
                      name="consumerAddress.unit"
                      control={control}
                      render={({ field }: any) => (
                        <>
                          <Input
                            className=""
                            type="number"
                            placeholder={t('EnterUnit')}
                            autoComplete="off"
                            invalid={errors.consumerAddress?.unit && true}
                            {...field}
                          />
                          <FormFeedback>{errors.consumerAddress?.unit?.message}</FormFeedback>
                        </>
                      )}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className={`col-12 col-lg-4 ${isUrgent && 'col-12 col-lg-12'}`}>
                    <div className="d-flex align-items-center my-15">
                      <Input
                        type="checkbox"
                        className="form-control"
                        onChange={(e: any) => {
                          setIsUrgent(e.currentTarget.checked);
                        }}
                      />
                      <div className={`${isUrgent && 'd-none'} mr-2`}>
                        <label className={`sos-box `}>SOS</label>درخواست فوری
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
                        <FormFeedback className="d-block">
                          {errors?.requestDetail?.productCategoryId?.value?.message}
                        </FormFeedback>
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
                        <FormFeedback className="d-block">
                          {errors?.requestDetail?.productCategoryId?.value?.message}
                        </FormFeedback>
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
                {loading ? <LoadingComponent /> : 'ثبت درخواست جدید'}
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};

export default Request;
