import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, generatePath } from 'react-router-dom';
import IPageProps from '../../configs/routerConfig/IPageProps';
import useHttpRequest from '@src/hooks/useHttpRequest';
import { Button, Form, FormFeedback, Input } from 'reactstrap';
import { ILoginModel, LoginModelSchema } from '@src/models/input/authentication/ILoginModel';
import { yupResolver } from '@hookform/resolvers/yup';
import { IOutputResult } from '@src/models/output/IOutputResult';
import { APIURL_LOGIN, APIURL_POST_LOGIN, APIURL_POST_LOGIN_OPTIONS } from '@src/configs/apiConfig/apiUrls';
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
import { BASE_URL } from '@src/configs/apiConfig/baseUrl';
import { coerceToArrayBuffer, coerceToBase64Url } from '@src/utils/site';

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
  const [showBiometricBtn, setShowBiometricBtn] = useState<boolean>(false);
  const [publicKeyOptions, setPublicKeyOptions] = useState<any>();
  const [userName, setUserName] = useState<string>();

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
  const HandleLoginFingerPrint = (userName: string) => {
    if (!window.navigator.credentials) return toast.showError('مرورگر شما این قابلیت را پشتیبانی نمی کند');
    setLoading(true);
    httpRequest
      .postRequest<IOutputResult<any>>(`${APIURL_POST_LOGIN_OPTIONS}?username=${userName}`, {})
      .then((result) => {
        setPublicKeyOptions(result.data.data);
      })
      .catch(() => {
        setLoading(false);
      });
  };
  interface IClientResponse {
    id: string;
    rawId: string;
    type: any;
    extensions: any;
    response: {
      authenticatorData: any;
      clientDataJson: any;
      signature: any;
    };
  }
  const verifyAssertionWithServer = (assertedCredential: any) => {
    let authData = new Uint8Array(assertedCredential.response.authenticatorData);
    let clientDataJSON = new Uint8Array(assertedCredential.response.clientDataJSON);
    let rawId = new Uint8Array(assertedCredential.rawId);
    let sig = new Uint8Array(assertedCredential.response.signature);
    const clientResponse: IClientResponse = {
      id: assertedCredential.id,
      rawId: coerceToBase64Url(rawId),
      type: assertedCredential.type,
      extensions: assertedCredential.getClientExtensionResults(),
      response: {
        authenticatorData: coerceToBase64Url(authData),
        clientDataJson: coerceToBase64Url(clientDataJSON),
        signature: coerceToBase64Url(sig),
      },
    };
    const data = {
      userName: userName,
      clientId: manifestJson.clientId,
      clientSecret: manifestJson.clientSecret,
      clientResponse,
    };
    httpRequest
      .postRequest<IOutputResult<any>>(`${APIURL_POST_LOGIN}`, data)
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
  };
  const handleClose = () => {
    setDisplayRegister(false);
    setDisplayPasswordMessage(false);
  };
  useEffect(() => {
    document.title = title;
  }, [title]);

  useEffect(() => {
    publicKeyOptions && Option();
  }, [publicKeyOptions]);
  const Option = () => {
    try {
      const challenge = publicKeyOptions.data.challenge.replace(/-/g, '+').replace(/_/g, '/');
      publicKeyOptions.data.challenge = coerceToArrayBuffer(challenge);
      // publicKeyOptions.data.challenge = Uint8Array.from(window.atob(challenge), (c) => c.charCodeAt(0));
      publicKeyOptions.data.allowCredentials.forEach(function (listItem: any) {
        var fixedId = listItem.id.replace(/\_/g, '/').replace(/\-/g, '+');
        // listItem.id = Uint8Array.from(window.atob(fixedId), (c) => c.charCodeAt(0));
        listItem.id = coerceToArrayBuffer(fixedId);
        navigator.credentials
          .get({ publicKey: publicKeyOptions.data })
          .then((result) => {
            verifyAssertionWithServer(result);
          })
          .catch(() => {
            setLoading(false);
            console.log('Could not verify assertion');
          });
      });
    } catch (e) {
      alert('خطا در شناسایی بیومتریک');
      setLoading(false);
    }
  };
  useEffect(() => {
    localStorage.getItem('userName')
      ? (setUserName(localStorage.getItem('userName')!),
        setShowBiometricBtn(true),
        HandleLoginFingerPrint(localStorage.getItem('userName')!))
      : setShowBiometricBtn(false);
  }, []);

  return (
    <>
      <div className="login-page">
        <div className="modal-page">
          <img src={require(`@src/scss/images/icons/${color}-Kardoon-Final-logo.svg`)} className="login-page-logo" alt="" />
          <Form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-items">
              <h4>ورود</h4>
              <div>
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
                        onChange={(e: any) => {
                          field.onChange(e);
                          setUserName(e.currentTarget.value);
                        }}
                      />
                      <FormFeedback className="danger-message">{errors.username?.message}</FormFeedback>
                    </>
                  )}
                />
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
              <div>
                <button type="submit" className="primary-btn">
                  {loading ? <LoadingComponent /> : 'وارد شوید'}
                </button>
                <br />
              </div>
              <div className="d-flex align-items-center justify-content-between">
                <a
                  onClick={() => {
                    setDisplayRegister(true);
                  }}
                  className="normal-message m-2"
                >
                  ثبت نام حساب کاربری
                </a>

                <a
                  onClick={() => {
                    setDisplayPasswordMessage(true);
                  }}
                  className="normal-message m-2"
                >
                  ورود با رمز یکبار مصرف
                </a>
              </div>
            </div>
          </Form>
          <div className="fingerprint-box">
            <Button
              onClick={() => HandleLoginFingerPrint(userName!)}
              className={`btn-warning mb-2 fingerprint-btn ${!showBiometricBtn && 'disable-fingerprint'}`}
            >
              <img className="fingerprint-icon" src={require(`@src/scss/images/icons/fingerprint.svg`)} />
            </Button>
          </div>
        </div>
        <PasswordMessage handleClose={handleClose} display={displayPasswordMessage} />
        <Register display={displayRegister} handleClose={handleClose} />
      </div>
    </>
  );
};

export default Login;
