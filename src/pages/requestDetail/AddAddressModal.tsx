import { AddAddressModelSchema, IAddAddressModel } from '@src/models/input/address/IAddAddressModel';
// import { CustomFunctions } from '@src/utils/custom';
import { FunctionComponent, useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button, Col, Container, Form, FormFeedback, Input, Row, Spinner } from 'reactstrap';
import Select from 'react-select';
import { yupResolver } from '@hookform/resolvers/yup';
import useHttpRequest from '@src/hooks/useHttpRequest';
import {
  APIURL_GET_ADDRESS_TITLE,
  APIURL_GET_CITIES,
  APIURL_GET_COUNTRIES,
  APIURL_GET_DISTRICTS,
  APIURL_GET_PROVINES,
  APIURL_GET_REGIONES,
  APIURL_POST_ADD_USER_ADDRESS,
} from '@src/configs/apiConfig/apiUrls';
import { IOutputResult } from '@src/models/output/IOutputResult';
import { ICountryResultModel } from '@src/models/output/countryDivision/ICountryResultModel';
import { IProvinceResultModel } from '@src/models/output/countryDivision/IProvinceResultModel';
import { IRegionResultModel } from '@src/models/output/countryDivision/IRegionResultModel';
import { ICitiesResultModel } from '../../models/output/countryDivision/ICitiesResultModel';
import { IDistrictsResultModel } from '../../models/output/countryDivision/IDistrictsResultModel';
import { useSelector } from 'react-redux';
import { RootStateType } from '@src/redux/Store';
import { useToast } from '../../hooks/useToast';
import { IAddAddressesResultModel } from '@src/models/output/address/IAddAddressesResultModel';
import { IAddAddressModal } from './IAddressModals';
import LoadingComponent from '@src/components/spinner/LoadingComponent';
import { ITitleResultModel } from '@src/models/output/missionDetail/ITitleResultModel';

const AddAddressModal: FunctionComponent<IAddAddressModal> = ({ GetAddresses, AddAddressModalVisible, reject }) => {
  const userName = useSelector((state: RootStateType) => state.authentication.userData?.userName);
  const [countries, setCountries] = useState<any>();
  const [titles, setTitles] = useState<ITitleResultModel[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const [provinces, setProvinces] = useState<any>();
  const [cities, setCities] = useState<any>();
  const [regiones, setRegion] = useState<any>();
  const [distritcs, setDistritcs] = useState<any>();
  const [countryId, setCountryId] = useState<number>();
  const [provinceId, setProvinceId] = useState<number>();
  const [cityId, setCityId] = useState<number>();
  const [regionId, setRegionId] = useState<number>();
  const [districtId, setDistrictId] = useState<number>();
  const toast = useToast();
  const messagesEndRef = useRef(null);
  const httpRequest = useHttpRequest();
  const [forMe, setForMe] = useState<Boolean>(true);
  const { t }: any = useTranslation();

  const scrollToBottom = () => {
    //@ts-ignore
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  const changeForMe = (forMe: boolean) => {
    setForMe(forMe);
    setTimeout(() => {
      scrollToBottom();
    }, 400);
  };

  const {
    register,
    control,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm<IAddAddressModel>({ mode: 'onChange', resolver: yupResolver(AddAddressModelSchema) });

  const GetTitles = () => {
    setLoading(true);
    httpRequest.getRequest<IOutputResult<ITitleResultModel[]>>(`${APIURL_GET_ADDRESS_TITLE}`).then((result) => {
      setTitles(result.data.data);
      setLoading(false);
    });
  };

  const GetCountryList = () => {
    httpRequest.getRequest<IOutputResult<ICountryResultModel>>(`${APIURL_GET_COUNTRIES}`).then((result) => {
      setCountries(result.data.data);
    });
  };
  const GetProvincesList = (countryId: number) => {
    httpRequest.getRequest<IOutputResult<IProvinceResultModel>>(`${APIURL_GET_PROVINES}?ParentId=${countryId}`).then((result) => {
      setProvinces(result.data.data);
    });
  };
  const GetCityList = (provinesId: number) => {
    httpRequest.getRequest<IOutputResult<ICitiesResultModel>>(`${APIURL_GET_CITIES}?ParentId=${provinesId}`).then((result) => {
      setCities(result.data.data);
    });
  };
  const GetRegionList = (citiesId: number) => {
    httpRequest.getRequest<IOutputResult<IRegionResultModel>>(`${APIURL_GET_REGIONES}?ParentId=${citiesId}`).then((result) => {
      setRegion(result.data.data);
    });
  };
  const GetDistrictList = (regionId: number) => {
    httpRequest
      .getRequest<IOutputResult<IDistrictsResultModel>>(`${APIURL_GET_DISTRICTS}?ParentId=${regionId}`)
      .then((result) => {
        setDistritcs(result.data.data);
      });
  };

  const onSubmit = (data: IAddAddressModel) => {
    setLoading(true);
    const body = {
      userName: userName,
      countryId: countryId,
      cityId: cityId,
      provinceId: provinceId,
      regionId: regionId,
      districtId: districtId,
      zipCode: data.zipCode,
      title: data.title.value,
      homeTel: data.homeTel,
      address: data.address,
      number: data.number,
      unit: data.unit,
      anotherAddressOwnerInformation: {
        firstName: data.anotherAddressOwnerInformation?.firstName,
        lastName: data.anotherAddressOwnerInformation?.lastName,
        mobileNumber: data.anotherAddressOwnerInformation?.mobileNumber,
        telNumber: data.anotherAddressOwnerInformation?.telNumber,
      },
    };
    if (data) {
      forMe && delete body.anotherAddressOwnerInformation.firstName;
      httpRequest
        .postRequest<IOutputResult<IAddAddressesResultModel>>(APIURL_POST_ADD_USER_ADDRESS, body)
        .then((result) => {
          toast.showSuccess(result.data.message);
          GetAddresses();
          setLoading(false);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    GetTitles();
    GetCountryList();
  }, []);
  return (
    <div className={`modal ${AddAddressModalVisible ? 'd-block' : ''}`}>
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="header pointer" onClick={reject}>
            X
          </h2>
          <h1 className="header">افزودن آدرس جدید</h1>
        </div>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className="card p-4" style={{ marginBottom: '0px' }}>
            <div style={{ height: '550px', overflow: 'scroll' }}>
              <Controller
                name="title"
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
                    <FormFeedback className="d-block">{errors.title?.value?.message}</FormFeedback>
                  </>
                )}
              />

              <Controller
                name="zipCode"
                control={control}
                render={({ field }: any) => (
                  <>
                    <Input
                      className="form-control"
                      type="number"
                      placeholder={t('EnterZipCode')}
                      autoComplete="off"
                      invalid={errors.zipCode && true}
                      {...field}
                    />
                    <FormFeedback>{errors.zipCode?.message}</FormFeedback>
                  </>
                )}
              />

              {/* کشور */}
              <Controller
                name="countryId"
                control={control}
                render={({ field }) => (
                  <>
                    <Select
                      noOptionsMessage={() => t('ListIsEmpty')}
                      isClearable
                      className=""
                      placeholder={t('SelectCountry')}
                      options={countries}
                      isSearchable={true}
                      {...field}
                      onChange={(e: any) => {
                        field.onChange(e);
                        e ? (setCountryId(e.value), GetProvincesList(e.value)) : setCountryId(undefined),
                          setProvinces([]),
                          GetCountryList();
                      }}
                    />
                    <FormFeedback className="d-block">{errors?.countryId?.value?.message}</FormFeedback>
                  </>
                )}
              />
              {/* استان */}

              <Controller
                name="provinceId"
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
                    <FormFeedback className="d-block">{errors?.provinceId?.value?.message}</FormFeedback>
                  </>
                )}
              />
              {/* شهر */}
              <Controller
                name="cityId"
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
                    <FormFeedback className="d-block">{errors?.cityId?.value?.message}</FormFeedback>
                  </>
                )}
              />
              {/* منطقه */}
              <Controller
                name="regionId"
                control={control}
                render={({ field }) => (
                  <>
                    <Select
                      isClearable
                      isLoading={loading}
                      noOptionsMessage={() => t('ListIsEmpty')}
                      placeholder={t('SelectRegion')}
                      options={regiones}
                      isSearchable={true}
                      className=""
                      {...field}
                      onChange={(e: any) => {
                        field.onChange(e);
                        e ? (setRegionId(e.value), setDistrictId(e.value), GetDistrictList(e.value)) : setDistrictId(undefined),
                          setDistritcs([]);
                        //   GetRegionList(cityId!);
                      }}
                    />
                    <FormFeedback className="d-block">{errors?.regionId?.value?.message}</FormFeedback>
                  </>
                )}
              />
              {/* محله */}
              <Controller
                name="districtId"
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
                    <FormFeedback className="d-block">{errors?.districtId?.value?.message}</FormFeedback>
                  </>
                )}
              />

              <Controller
                name="address"
                control={control}
                render={({ field }: any) => (
                  <>
                    <Input
                      className="form-control"
                      type="text"
                      placeholder={t('EnterAddress')}
                      autoComplete="off"
                      invalid={errors.address && true}
                      {...field}
                    />
                    <FormFeedback>{errors.address?.message}</FormFeedback>
                  </>
                )}
              />
              <Controller
                name="homeTel"
                control={control}
                render={({ field }: any) => (
                  <>
                    <Input
                      className="form-control"
                      type="number"
                      placeholder={t('EnterHomeTel')}
                      autoComplete="off"
                      invalid={errors.homeTel && true}
                      {...field}
                    />
                    <FormFeedback>{errors.homeTel?.message}</FormFeedback>
                  </>
                )}
              />
              <Container>
                <Row>
                  <Col>
                    <Controller
                      name="number"
                      control={control}
                      render={({ field }: any) => (
                        <>
                          <Input
                            className="form-control"
                            type="number"
                            placeholder={t('EnterNumber')}
                            autoComplete="off"
                            invalid={errors.number && true}
                            {...field}
                          />
                          <FormFeedback>{errors.number?.message}</FormFeedback>
                        </>
                      )}
                    />
                  </Col>
                  <Col>
                    <Controller
                      name="unit"
                      control={control}
                      render={({ field }: any) => (
                        <>
                          <Input
                            className="form-control"
                            type="number"
                            placeholder={t('EnterUnit')}
                            autoComplete="off"
                            invalid={errors.unit && true}
                            {...field}
                          />
                          <FormFeedback>{errors.unit?.message}</FormFeedback>
                        </>
                      )}
                    />
                  </Col>
                </Row>
              </Container>

              <b>
                <Button onClick={(e) => changeForMe(true)}>{t('ForMe')}</Button>
                <Button onClick={(e) => changeForMe(false)}>{t('ForOther')}</Button>
              </b>

              {forMe ? null : (
                <div>
                  <div style={{ marginTop: '25px' }} ref={messagesEndRef}>
                    <Controller
                      name="anotherAddressOwnerInformation.firstName"
                      control={control}
                      render={({ field }: any) => (
                        <>
                          <Input
                            className="form-control"
                            type="text"
                            placeholder={t('EnterFirstName')}
                            autoComplete="off"
                            invalid={errors.anotherAddressOwnerInformation?.firstName?.message && true}
                            {...field}
                          />
                          <FormFeedback>{errors.anotherAddressOwnerInformation?.firstName?.message}</FormFeedback>
                        </>
                      )}
                    />
                  </div>

                  <Controller
                    name="anotherAddressOwnerInformation.lastName"
                    control={control}
                    render={({ field }: any) => (
                      <>
                        <Input
                          className="form-control"
                          type="text"
                          placeholder={t('EnterLastName')}
                          autoComplete="off"
                          invalid={errors.anotherAddressOwnerInformation?.lastName?.message && true}
                          {...field}
                        />
                        <FormFeedback>{errors.anotherAddressOwnerInformation?.lastName?.message}</FormFeedback>
                      </>
                    )}
                  />
                  <Controller
                    name="anotherAddressOwnerInformation.mobileNumber"
                    control={control}
                    render={({ field }: any) => (
                      <>
                        <Input
                          className="form-control"
                          type="number"
                          placeholder={t('شماره تلفن همراه گیرنده خدمات را وارد نمایید')}
                          autoComplete="off"
                          invalid={errors.anotherAddressOwnerInformation?.mobileNumber?.message && true}
                          {...field}
                        />
                        <FormFeedback>{errors.anotherAddressOwnerInformation?.mobileNumber?.message}</FormFeedback>
                      </>
                    )}
                  />

                  <Controller
                    name="anotherAddressOwnerInformation.telNumber"
                    control={control}
                    render={({ field }: any) => (
                      <>
                        <Input
                          className="form-control"
                          type="number"
                          placeholder={t('شماره تلفن ثابت گیرنده خدمات را وارد نمایید')}
                          autoComplete="off"
                          invalid={errors.anotherAddressOwnerInformation?.telNumber?.message && true}
                          {...field}
                        />
                        <FormFeedback>{errors.anotherAddressOwnerInformation?.telNumber?.message}</FormFeedback>
                      </>
                    )}
                  />
                </div>
              )}
            </div>
            <Button type="submit" className="">
              {loading ? <LoadingComponent /> : 'ذخیره آدرس'}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};
export default AddAddressModal;