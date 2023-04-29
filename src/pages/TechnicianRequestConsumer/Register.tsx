import LoadingComponent from '@src/components/spinner/LoadingComponent';
import {
  APIURL_GET_CONSUMER_INFO,
  APIURL_GET_INTRODUCTIONS,
  APIURL_POST_REGISTER_BY_TECHNICIAN,
} from '@src/configs/apiConfig/apiUrls';
import useHttpRequest from '@src/hooks/useHttpRequest';
import { useToast } from '@src/hooks/useToast';
import { IOutputResult } from '@src/models/output/IOutputResult';
import { IIntroductionResultModel } from '@src/models/output/profile/IIntroductionResultModel';
import { FunctionComponent, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Form, FormFeedback, Input } from 'reactstrap';
import Select from 'react-select';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  IRegisterTechnicianModel,
  RegisterTechnicianModelSchema,
} from '@src/models/input/technicianRequestConsumer/IRegisterTechnicianModel';
import { IRegisterTechnicianModelResult } from '@src/models/output/technicianRequestConsumer/IRegisterTechnicianModelResult';
import { useSelector } from 'react-redux';
import { RootStateType } from '@src/redux/Store';
import { IUserInfoResultModel } from '@src/models/output/profile/IUserInfoResultModel';
import { IUserInfoTechnicianRequestModelResult } from '@src/models/output/technicianRequestConsumer/IUserInfoTechnicianRequestModelResult';

interface RegisterProps {
  handleClickNext: any;
}

const Register: FunctionComponent<RegisterProps> = ({ handleClickNext }) => {
  const color = useSelector((state: RootStateType) => state.theme.color);
  const { t }: any = useTranslation();
  const toast = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const [introMethodId, setIntroMethodId] = useState<any>(undefined);
  const [introductions, setIntroductions] = useState<any>();
  const [gender, setGender] = useState<number>(1);
  const httpRequest = useHttpRequest();

  const GetIntroductions = () => {
    httpRequest.getRequest<IOutputResult<IIntroductionResultModel>>(`${APIURL_GET_INTRODUCTIONS}`).then((result) => {
      setIntroductions(result.data.data);
    });
  };
  const GetUserInfo = (phoneNumber: string) => {
    httpRequest
      .getRequest<IOutputResult<IUserInfoTechnicianRequestModelResult>>(`${APIURL_GET_CONSUMER_INFO}?UserName=${phoneNumber}`)
      .then((result) => {
        result.data.data.id && toast.showSuccess('این کاربر قبلا ثبت نام کرده است');
        result.data.data.id && handleClickNext(result.data.data.id, result.data.data.userName, 1);
      });
  };

  const {
    register,
    control,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm<IRegisterTechnicianModel>({ mode: 'onChange', resolver: yupResolver(RegisterTechnicianModelSchema) });

  const onSubmit = (data: IRegisterTechnicianModel) => {
    if (!introMethodId) {
      toast.showError('نحوه آشنایی را انتخاب نمایید');
      return;
    }
    setLoading(true);
    const body = {
      firstName: data.firstName,
      lastName: data.lastName,
      mobile: data.mobile,
      gender: data.gender,
      nationalCode: data.nationalCode,
      introductionInfo: {
        refkey: data.introductionInfo?.refkey,
        introMethodId: introMethodId,
        introductionCode: data.introductionInfo?.introductionCode,
      },
    };
    if (!loading) {
      httpRequest
        .postRequest<IOutputResult<IRegisterTechnicianModelResult>>(APIURL_POST_REGISTER_BY_TECHNICIAN, body)
        .then((result) => {
          setLoading(false);
          result.data.data.userName && handleClickNext(result.data.data.userName, 1) && toast.showInfo('کاربر با موفقیت ثبت شد.');
        })
        .finally(() => setLoading(false));
    }
  };

  useEffect(() => {
    GetIntroductions();
  }, []);
  return (
    <>
      <div className="container p-4 pt-0 pb-0">
        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className="row">
            <div className="col-12 col-md-6 col-lg-3">
              <p className="item-label">
                شماره موبایل<span className="color-danger">*</span>
              </p>
              <Controller
                name="mobile"
                control={control}
                render={({ field }) => (
                  <>
                    <Input
                      disabled={loading}
                      className="account-data-input"
                      type="number"
                      placeholder={t('EnterMobile')}
                      autoComplete="off"
                      invalid={errors.mobile && true}
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        e && e.currentTarget.value.length == 11 && GetUserInfo(e.currentTarget.value);
                      }}
                    />
                    <FormFeedback>{errors.mobile?.message}</FormFeedback>
                  </>
                )}
              />
            </div>
            <div className="col-12">
              <p />
              <div className="gender">
                <img
                  src={require(`@src/scss/images/icons/red-famel-icon.svg`)}
                  className={`${gender && 'disable'} gender-icon`}
                  alt=""
                />
                <div className="toggle-center">
                  <Input
                    {...register('gender', { required: true })}
                    name="gender"
                    onChange={(e) => {
                      e.currentTarget.checked ? setGender(0) : setGender(1);
                    }}
                    type="checkbox"
                    className="toggle-checkbox"
                  />
                </div>
                <img
                  src={require(`@src/scss/images/icons/${color}-male-icon.svg`)}
                  className={`${!gender && 'disable'} gender-icon`}
                  alt=""
                />
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-3">
              <p className="item-label">
                نام<span className="color-danger">*</span>
              </p>
              <Controller
                name="firstName"
                control={control}
                render={({ field }) => (
                  <>
                    <Input
                      className="account-data-input"
                      type="text"
                      placeholder={t('Name')}
                      autoComplete="off"
                      invalid={errors.firstName && true}
                      {...field}
                    />
                    <FormFeedback>{errors.firstName?.message}</FormFeedback>
                  </>
                )}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-3">
              <p className="item-label">
                نام خانوادگی<span className="color-danger">*</span>
              </p>
              <Controller
                name="lastName"
                control={control}
                render={({ field }) => (
                  <>
                    <Input
                      className="account-data-input"
                      type="text"
                      placeholder={t('Family')}
                      autoComplete="off"
                      invalid={errors.lastName && true}
                      {...field}
                    />
                    <FormFeedback>{errors.lastName?.message}</FormFeedback>
                  </>
                )}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-3">
              <p className="item-label">کد ملی</p>
              <Controller
                name="nationalCode"
                control={control}
                render={({ field }) => (
                  <>
                    <Input
                      className="account-data-input"
                      type="number"
                      placeholder={t('EnterNationalCode')}
                      autoComplete="off"
                      invalid={errors.nationalCode && true}
                      {...field}
                    />
                    <FormFeedback>{errors.nationalCode?.message}</FormFeedback>
                  </>
                )}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-3">
              <p className="item-label">کد معرف</p>
              <Controller
                name="introductionInfo.introductionCode"
                control={control}
                render={({ field }) => (
                  <>
                    <Input
                      className="account-data-input"
                      type="text"
                      placeholder={t('EnterIntroductionCode')}
                      autoComplete="off"
                      invalid={errors.introductionInfo?.introductionCode && true}
                      {...field}
                    />
                    <FormFeedback>{errors.introductionInfo?.introductionCode?.message}</FormFeedback>
                  </>
                )}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-3">
              <p className="item-label">نحوه آشنایی</p>
              <Controller
                name="introductionInfo.introMethodId"
                control={control}
                render={({ field }) => (
                  <>
                    <Select
                      noOptionsMessage={() => t('ListIsEmpty')}
                      isClearable
                      placeholder={t('SelectIntroduction')}
                      options={introductions}
                      isSearchable={true}
                      {...field}
                      onChange={(e: any) => {
                        e ? setIntroMethodId(e.value) : setIntroMethodId(undefined);
                      }}
                    />
                    {!introMethodId ? <FormFeedback className="d-block">نحوه آشنایی اجباریست</FormFeedback> : ''}
                  </>
                )}
              />
            </div>
            <button type="submit" className="primary-btn">
              {loading ? <LoadingComponent /> : 'ثبت نام و ادامه'}
            </button>
          </div>
        </Form>
      </div>
    </>
  );
};

export default Register;
