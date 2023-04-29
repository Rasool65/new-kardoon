import { APIURL_LOGIN, APIURL_SEND_PASSWORD } from '@src/configs/apiConfig/apiUrls';
import useHttpRequest from '@src/hooks/useHttpRequest';
import { IForgetPasswordResultModel } from '@src/models/output/authentication/IForgetPasswordResultModel';
import { IOutputResult } from '@src/models/output/IOutputResult';
import { GeneralHelpers } from '@src/utils/GeneralHelpers';
import { FunctionComponent, useEffect, useState } from 'react';
import { Button, Spinner } from 'reactstrap';
import { IModalModel } from './ModalModel';
import PinField from 'react-pin-field';
import { useToast } from '@src/hooks/useToast';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { handleLogin } from '@src/redux/reducers/authenticationReducer';
import { ILoginResultModel } from '@src/models/output/authentication/ILoginResultModel';
import { URL_MAIN, URL_USER_PROFILE } from '@src/configs/urls';
import { useTranslation } from 'react-i18next';
import manifestJson from '@src/manifest.json';
import LoadingComponent from '@src/components/spinner/LoadingComponent';

const EnterCode: FunctionComponent<IModalModel> = ({ mobileNumber, display, handleClose }) => {
  const toast = useToast();
  const { t }: any = useTranslation();
  const [remainingTimeSeconds, setRemainingTimeSeconds] = useState<number>(180);
  const httpRequest = useHttpRequest();
  const [timer, setTimer] = useState<boolean>(true);
  const [pinLoading, setPinLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const Resent = () => {
    if (!timer) {
      httpRequest
        .postRequest<IOutputResult<IForgetPasswordResultModel>>(APIURL_SEND_PASSWORD, { mobileNumber: mobileNumber })
        .then((result) => {
          setTimer(true);
          toast.showSuccess(result.data.message);
          setRemainingTimeSeconds(result.data.data.remainingTimeSeconds);
          setRemainingTimeSeconds(30);
        });
    }
  };

  const LoginWithSMS = (code: string) => {
    setPinLoading(true);
    const body = {
      ClientId: manifestJson.clientId,
      ClientSecret: manifestJson.clientSecret,
      UserName: mobileNumber,
      Password: code,
    };
    httpRequest
      .postRequest<IOutputResult<ILoginResultModel>>(APIURL_LOGIN, body)
      .then((result) => {
        dispatch(handleLogin(result));
        navigate(URL_MAIN);
        toast.showSuccess(result.data.message);
        setPinLoading(false);
      })
      .catch((result) => {
        setPinLoading(false);
      })
      .finally(() => {
        setPinLoading(false);
      });
  };

  useEffect(() => {
    if (remainingTimeSeconds > 0) {
      const timer = setTimeout(() => {
        setRemainingTimeSeconds(remainingTimeSeconds - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else {
      setTimer(false);
    }
  });
  const controller = new AbortController();
  navigator.credentials
    .get({
      //@ts-ignore
      otp: { transport: ['sms'] },
      signal: controller.signal,
    })
    .then((otp: any) => {
      LoginWithSMS(otp.code);
    })
    .catch((err) => {
      console.log(err);
    });

  //! ex SMS:
  // code : 123456
  // @tech.kardoon.ir #123456

  return (
    <>
      <div className="enter-code">
        <div className="modal" style={{ display: display ? 'block' : 'none' }}>
          <div className="modal-content">
            <div className="modal-header">
              <span className="close" onClick={handleClose}>
                &times;
              </span>
              <h4>تایید تلفن همراه</h4>
            </div>

            <div className="modal-items">
              <p className="info-text">
                {' '}
                کد پیامک شده به شماره موبایل {GeneralHelpers.toPersianNumber(mobileNumber?.toString())} را وارد نمایید.
              </p>
              <div className="enter-code" style={{ direction: 'ltr' }}>
                {/* <input className="primary-input" type="tel" placeholder="کد دریافت شده" /> */}
                {pinLoading ? (
                  <LoadingComponent />
                ) : (
                  <PinField
                    className="pin-field"
                    style={{ height: '55px' }}
                    length={6}
                    type="number"
                    validate={/^[0-9]$/}
                    onComplete={(e) => {
                      const number = [...e].reverse().join('');
                      LoginWithSMS(number);
                    }}
                  />
                )}
                {/* <div className="normal-message">
                  <span className="time-count">{remainingTimeSeconds}</span>ثانیه تا ارسال مجدد
                </div> */}
              </div>
              <Button onClick={Resent} className="btn primary-btn">
                {remainingTimeSeconds > 0 ? `${t('PleaseWait')}(${remainingTimeSeconds})` : t('Resent')}
              </Button>
              <div className="pointer" style={{ marginTop: '25px' }} onClick={handleClose}>
                {t('EditMobileNumber')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default EnterCode;
