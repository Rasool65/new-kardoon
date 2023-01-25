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
  APIURL_PUT_UPDATE_USER_ADDRESS,
} from '@src/configs/apiConfig/apiUrls';
import { IOutputResult } from '@src/models/output/IOutputResult';
import { ICountryResultModel } from '@src/models/output/countryDivision/ICountryResultModel';
import { IProvinceResultModel } from '@src/models/output/countryDivision/IProvinceResultModel';
import { ICitiesResultModel } from '../../models/output/countryDivision/ICitiesResultModel';
import { IRegionResultModel } from '@src/models/output/countryDivision/IRegionResultModel';
import { IDistrictsResultModel } from '../../models/output/countryDivision/IDistrictsResultModel';
import { useSelector } from 'react-redux';
import { RootStateType } from '@src/redux/Store';
import { useToast } from '../../hooks/useToast';
import { IEditAddressModal } from './IAddressModals';
import { IUpdateAddressModel, UpdateAddressModelSchema } from '@src/models/input/address/IUpdateAddressModel';
import { IUpdateAddressesResultModel } from '@src/models/output/address/IUpdateAddressResultModel';
import { ITitleResultModel } from '@src/models/output/missionDetail/ITitleResultModel';

const EditAddressModal: FunctionComponent<IEditAddressModal> = ({
  GetAddresses,
  EditAddressModalVisible,
  CurrentAddress,
  reject,
}) => {
  const userName = useSelector((state: RootStateType) => state.authentication.userData?.userName);
  const [countries, setCountries] = useState<any>();
  const [titles, setTitles] = useState<ITitleResultModel[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const [provinces, setProvinces] = useState<any>();
  const [cities, setCities] = useState<any>();
  const [regiones, setRegion] = useState<any>();
  const [distritcs, setDistritcs] = useState<any>();
  const [countryId, setCountryId] = useState<number>(3);
  const [provinceId, setProvinceId] = useState<number>();
  const [cityId, setCityId] = useState<number>();
  const [regionId, setRegionId] = useState<number>();
  const [districtId, setDistrictId] = useState<number>();
  const toast = useToast();
  const messagesEndRef = useRef(null);
  const httpRequest = useHttpRequest();
  const [forMe, setForMe] = useState<boolean>(true);
  const { t }: any = useTranslation();
  const [regionShow, setRegionShow] = useState<boolean>(false);

  const scrollToBottom = () => {
    // @ts-ignore
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  const changeForMe = (forMe: boolean) => {
    setForMe(forMe);
    setTimeout(() => {
      scrollToBottom();
    }, 400);
  };
  const GetTitles = () => {
    setLoading(true);
    httpRequest.getRequest<IOutputResult<ITitleResultModel[]>>(`${APIURL_GET_ADDRESS_TITLE}`).then((result) => {
      setTitles(result.data.data);
      setLoading(false);
    });
  };

  const GetCountryList = () => {
    httpRequest.getRequest<IOutputResult<ICountryResultModel[]>>(`${APIURL_GET_COUNTRIES}`).then((result) => {
      setCountries(result.data.data);
    });
  };

  const GetProvincesList = (countryId: number) => {
    httpRequest
      .getRequest<IOutputResult<IProvinceResultModel[]>>(`${APIURL_GET_PROVINES}?ParentId=${countryId}`)
      .then((result) => {
        setProvinces(result.data.data);
      });
  };

  const GetCityList = (provinesId: number) => {
    httpRequest.getRequest<IOutputResult<ICitiesResultModel[]>>(`${APIURL_GET_CITIES}?ParentId=${provinesId}`).then((result) => {
      setCities(result.data.data);
    });
  };

  const GetRegionList = (citiesId: number) => {
    httpRequest.getRequest<IOutputResult<IRegionResultModel[]>>(`${APIURL_GET_REGIONES}?ParentId=${citiesId}`).then((result) => {
      result.data.data.length > 0
        ? (setRegion(result.data.data), setRegionShow(false))
        : (GetDistrictList(citiesId), setRegionShow(true));
    });
  };

  const GetDistrictList = (regionId: number) => {
    httpRequest
      .getRequest<IOutputResult<IDistrictsResultModel[]>>(`${APIURL_GET_DISTRICTS}?ParentId=${regionId}`)
      .then((result) => {
        setDistritcs(result.data.data);
      });
  };

  const onSubmit = (data: IUpdateAddressModel) => {
    setLoading(true);
    const body = {
      refkey: CurrentAddress?.refkey,
      userName: userName,
      countryId: data.countryId?.value,
      cityId: data.cityId?.value,
      provinceId: data.provinceId?.value,
      regionId: data.regionId?.value,
      districtId: data.districtId?.value,
      zipCode: data.zipCode,
      title: data.title?.value,
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
        .updateRequest<IOutputResult<IUpdateAddressesResultModel>>(APIURL_PUT_UPDATE_USER_ADDRESS, body)
        .then((result) => {
          result.data.isSuccess ? toast.showSuccess(result.data.message) : toast.showError(result.data.message);
          reject();
          GetAddresses();
          setLoading(false);
        })
        .finally(() => {});
    }
  };

  useEffect(() => {
    GetCountryList();
    GetProvincesList(1);
    GetTitles();
  }, []);
  useEffect(() => {
    reset();
  }, [CurrentAddress]);
  const {
    register,
    control,
    setError,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<IUpdateAddressModel>({ mode: 'onChange', resolver: yupResolver(UpdateAddressModelSchema) });
  return (
    <>
      <div className={`modal select-address-modal ${EditAddressModalVisible ? 'd-block' : ''}`}>
        <div className="modal-header">
          <h2 className="header pointer" onClick={reject}>
            X
          </h2>
          <h1 className="header">ویرایش آدرس</h1>
        </div>
        <div className="modal-content">
          {CurrentAddress && (
            <Form onSubmit={handleSubmit(onSubmit)}>
              <div className="address-fild-modal">
                <Controller
                  name="title"
                  control={control}
                  defaultValue={CurrentAddress?.title}
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
                      <FormFeedback className="d-block">{errors?.title?.message}</FormFeedback>
                    </>
                  )}
                />
                <Controller
                  name="zipCode"
                  control={control}
                  defaultValue={CurrentAddress?.zipCode}
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
                {/* <div
                className={`input-style has-borders no-icon validate-field mb-4 ${input.countryId ? 'input-style-active' : ''}`}
                >
                <Select
                noOptionsMessage={() => t('ListIsEmpty')}
                  isClearable
                  className="select-city"
                  placeholder={t('SelectCountry')}
                  // defaultValue={CurrentAddress?.c}
                  options={countries}
                  isSearchable={true}
                  onChange={(e: any) => {
                    e ? (setCountryId(e.value), GetProvincesList(e.value)) : setCountryId(undefined),
                    setProvinces([]),
                    GetCountryList();
                  }}
                  />
                </div> */}
                {/* استان */}

                <Select
                  noOptionsMessage={() => t('ListIsEmpty')}
                  isClearable
                  className=""
                  placeholder={t('SelectProvince')}
                  defaultInputValue={CurrentAddress?.provinceName}
                  options={provinces}
                  isSearchable={true}
                  onChange={(e: any) => {
                    e ? (setProvinceId(e.value), GetCityList(e.value)) : setProvinceId(undefined), setCities([]);
                    // GetProvincesList(countryId!);
                  }}
                />
                {/* شهر */}

                <Select
                  noOptionsMessage={() => t('ListIsEmpty')}
                  isClearable
                  className=""
                  defaultInputValue={CurrentAddress?.cityName}
                  placeholder={t('SelectCity')}
                  options={cities}
                  isSearchable={true}
                  onChange={(e: any) => {
                    e ? (setCityId(e.value), setRegionId(e.value), GetRegionList(e.value)) : setRegion([]),
                      GetCityList(provinceId!);
                  }}
                />
                {/* منطقه */}
                <Select
                  noOptionsMessage={() => t('ListIsEmpty')}
                  isDisabled={regionShow}
                  isClearable
                  className=""
                  defaultInputValue={CurrentAddress?.regionName}
                  placeholder={t('SelectRegion')}
                  options={regiones}
                  isSearchable={true}
                  onChange={(e: any) => {
                    e ? (setRegionId(e.value), setDistrictId(e.value), GetDistrictList(e.value)) : setDistrictId(undefined),
                      setDistritcs([]);
                    GetRegionList(cityId!);
                  }}
                />
                {/* محله */}
                <Select
                  noOptionsMessage={() => t('ListIsEmpty')}
                  isClearable
                  className=""
                  defaultInputValue={CurrentAddress?.districtName}
                  placeholder={t('SelectDistrict')}
                  options={distritcs}
                  isSearchable={true}
                  onChange={(e: any) => {
                    setDistrictId(e.value);
                  }}
                />
                <Controller
                  name="address"
                  control={control}
                  defaultValue={CurrentAddress?.address}
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
                  defaultValue={CurrentAddress?.homeTel}
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

                <Container style={{ maxWidth: '100%', padding: '0 0 0 0' }}>
                  <Row>
                    <Col>
                      <Controller
                        name="number"
                        control={control}
                        defaultValue={CurrentAddress?.number}
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
                        defaultValue={CurrentAddress?.unit}
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

                <div className="toggle-center text-center">
                  <label className="ml-2" htmlFor="">
                    برای خودم
                  </label>
                  <Input
                    defaultChecked={true}
                    onChange={(e) => {
                      e.currentTarget.checked ? changeForMe(true) : changeForMe(false);
                    }}
                    type="checkbox"
                    className="toggle-checkbox"
                  />
                  <label className="mr-2" htmlFor="">
                    برای دیگری
                  </label>
                </div>

                {forMe ? null : (
                  <div>
                    <div style={{ marginTop: '25px' }} ref={messagesEndRef}>
                      <Controller
                        name="anotherAddressOwnerInformation.firstName"
                        control={control}
                        defaultValue={CurrentAddress?.anotherAddressOwnerInformation?.firstName}
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
                      defaultValue={CurrentAddress?.anotherAddressOwnerInformation?.lastName}
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
                      defaultValue={CurrentAddress?.anotherAddressOwnerInformation?.mobileNumber}
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
                      defaultValue={CurrentAddress?.anotherAddressOwnerInformation?.telNumber}
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
              <Button type="submit" style={{ marginTop: '30px' }} className="">
                {loading ? <Spinner /> : 'ویرایش آدرس'}
              </Button>
            </Form>
          )}
        </div>
      </div>
    </>
  );
};
export default EditAddressModal;
