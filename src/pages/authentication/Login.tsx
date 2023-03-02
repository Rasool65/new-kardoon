import React, { FunctionComponent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, generatePath } from 'react-router-dom';
import IPageProps from '../../configs/routerConfig/IPageProps';
import useHttpRequest from '@src/hooks/useHttpRequest';
import { Form, FormFeedback, Input } from 'reactstrap';
import { ILoginModel, LoginModelSchema } from '@src/models/input/authentication/ILoginModel';
import { yupResolver } from '@hookform/resolvers/yup';
import { IOutputResult } from '@src/models/output/IOutputResult';
import { APIURL_LOGIN } from '@src/configs/apiConfig/apiUrls';
import { ILoginResultModel } from '@src/models/output/authentication/ILoginResultModel';
import { handleLogin } from '@src/redux/reducers/authenticationReducer';
import { URL_MAIN } from '../../configs/urls';
import { useToast } from '@src/hooks/useToast';
import Register from './Register';
import PasswordMessage from './PasswordMessage';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import manifestJson from '@src/manifest.json';
import { UtilsHelper } from '@src/utils/GeneralHelpers';
import LoadingComponent from '@src/components/spinner/LoadingComponent';
import { URL_PROVINCE } from './../../configs/urls';
import { RootStateType } from '@src/redux/Store';
import WebAuthnLoginForm from './WebAuthnLoginForm';

const Login: FunctionComponent<IPageProps> = ({ title }) => {
  const color = useSelector((state: RootStateType) => state.theme.color);
  const navigate = useNavigate();
  const httpRequest = useHttpRequest();
  const dispatch = useDispatch();
  const { t }: any = useTranslation();
  const toast = useToast();
  const [displayRegister, setDisplayRegister] = useState<boolean>(false);
  const [displayPasswordMessage, setDisplayPasswordMessage] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginModel>({ mode: 'onChange', resolver: yupResolver(LoginModelSchema) });

  //todo <button onClick={() => i18n.changeLanguage('fa')}>changeLanguage</button>  */
  const onSubmit = (data: ILoginModel) => {
    setLoading(true);
    const body = {
      ClientId: manifestJson.clientId,
      ClientSecret: manifestJson.clientSecret,
      UserName: UtilsHelper.fixFarsiForSearch(data.username),
      Password: data.password,
    };
    if (data && !loading) {
      httpRequest
        .postRequest<IOutputResult<ILoginResultModel>>(APIURL_LOGIN, body)
        .then((result) => {
          setLoading(false);
          dispatch(handleLogin(result)),
            toast.showSuccess(result.data.message),
            result.data.data.user.profile.residenceCityId ? navigate(URL_MAIN) : navigate(URL_PROVINCE);
          location.reload();
        })
        .catch(() => {
          setLoading(false);
        });
    }
  };
  const handleClose = () => {
    setDisplayRegister(false);
    setDisplayPasswordMessage(false);
  };
  useEffect(() => {
    document.title = title;
  }, [title]);
  return (
    <>
      <div className="login-page">
        <img src={require(`@src/scss/images/icons/${color}-Kardoon-Final-logo.svg`)} className="login-page-logo" alt="" />
        <div className="modal-page">
          <Form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-items">
              <h4>ورود</h4>
              <div>
                {/* <input className="primary-input" type="number" placeholder="لطفا شماره همراه خود را وارد کنید" /> */}
                <Controller
                  name="username"
                  control={control}
                  render={({ field }: any) => (
                    <>
                      <Input
                        className="primary-input"
                        autoFocus
                        type="number"
                        placeholder={t('EnterMobile')}
                        autoComplete="off"
                        invalid={errors.username && true}
                        {...field}
                      />
                      <FormFeedback className="danger-message">{errors.username?.message}</FormFeedback>
                    </>
                  )}
                />
                {/* <input className="primary-input" type="password" placeholder="لطفا رمز عبور را وارد کنید" /> */}
                <Controller
                  name="password"
                  control={control}
                  render={({ field }: any) => (
                    <>
                      <Input
                        className="primary-input"
                        autoFocus
                        type="password"
                        placeholder={t('EnterPassword')}
                        autoComplete="off"
                        invalid={errors.password && true}
                        {...field}
                      />
                      <FormFeedback className="danger-message">{errors.password?.message}</FormFeedback>
                    </>
                  )}
                />
              </div>
              <button className="primary-btn">{loading ? <LoadingComponent /> : 'وارد شوید'}</button>
              <a
                onClick={() => {
                  setDisplayRegister(true);
                }}
                className="normal-message"
              >
                ثبت نام حساب کاربری
              </a>
              <br />
              <a
                onClick={() => {
                  setDisplayPasswordMessage(true);
                }}
                className="normal-message"
              >
                ورود با رمز یکبار مصرف
              </a>
            </div>
          </Form>
          <WebAuthnLoginForm />
        </div>
        <PasswordMessage handleClose={handleClose} display={displayPasswordMessage} />
        <Register display={displayRegister} handleClose={handleClose} />
      </div>
    </>
  );
};

export default Login;
