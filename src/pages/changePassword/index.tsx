import { FunctionComponent, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootStateType } from '@src/redux/Store';
import { Form, Button, Spinner, Input, FormFeedback } from 'reactstrap';
import { Controller, useForm } from 'react-hook-form';
import { IOutputResult } from '@src/models/output/IOutputResult';
import { ChangePasswordModelSchema, IChangePasswordModel } from '@src/models/input/authentication/IChangePassword';
import { yupResolver } from '@hookform/resolvers/yup';
import useHttpRequest from '@src/hooks/useHttpRequest';
import { APIURL_CHANGE_PASSWORD, APIURL_LOGIN } from '@src/configs/apiConfig/apiUrls';
import { useTranslation } from 'react-i18next';
import { useToast } from '@src/hooks/useToast';
import { IChangePasswordProps } from './IChangePasswordProps';

const ChangePassword: FunctionComponent<IChangePasswordProps> = ({ displayChangePassword, handleDisplayChangePassword }) => {
  const userData = useSelector((state: RootStateType) => state.authentication.userData);
  const [loading, setLoading] = useState<boolean>();
  const httpRequest = useHttpRequest();
  const { t }: any = useTranslation();
  const toast = useToast();
  const {
    reset,
    control,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm<IChangePasswordModel>({ mode: 'onChange', resolver: yupResolver(ChangePasswordModelSchema) });

  //todo <button onClick={() => i18n.changeLanguage('fa')}>changeLanguage</button>  */
  const onSubmit = (data: IChangePasswordModel) => {
    setLoading(true);
    const body = {
      userId: userData?.userId,
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
      confirmPassword: data.confirmPassword,
    };
    if (data && !loading) {
      httpRequest
        .postRequest<IOutputResult<IChangePasswordModel>>(APIURL_CHANGE_PASSWORD, body)
        .then((result) => {
          setLoading(false);
          result.data.isSuccess ? toast.showSuccess(result.data.message) : toast.showError(result.data.message);
          reset({ confirmPassword: '', newPassword: '', oldPassword: '' });
        })
        .catch(() => {
          setLoading(false);
        });
    }
  };

  return (
    <>
      <div className="modal" style={{ display: `${displayChangePassword ? 'block' : ''}` }}>
        <div className="modal-content">
          <div className="modal-header">
            <span className="close" onClick={handleDisplayChangePassword}>
              &times;
            </span>
            <h4>تغییر کلمه عبور</h4>
          </div>

          <Form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-items">
              <p className="info-text">کد ارسال شده به شماره همراه خود را وارد کنید.</p>
              <div>
                <div className="input-have-icon input-password">
                  <Controller
                    name="oldPassword"
                    control={control}
                    render={({ field }: any) => (
                      <>
                        <Input
                          className="primary-input m-0"
                          autoFocus
                          type="password"
                          placeholder="رمز عبور جاری را وارد نمایید"
                          autoComplete="off"
                          invalid={errors.oldPassword && true}
                          {...field}
                        />
                        <div className="danger-message">{errors.oldPassword?.message}</div>
                      </>
                    )}
                  />
                </div>
                <div className="input-have-icon input-password">
                  <Controller
                    name="newPassword"
                    control={control}
                    render={({ field }: any) => (
                      <>
                        <Input
                          className="primary-input m-0"
                          type="password"
                          placeholder="رمز عبور جدید را وارد نمایید"
                          autoComplete="off"
                          invalid={errors.newPassword && true}
                          {...field}
                        />
                        <div className="danger-message">{errors.newPassword?.message}</div>
                      </>
                    )}
                  />
                </div>
                <div className="input-have-icon input-password">
                  {/* <input className="primary-input m-0" type="password" placeholder="تکرار رمز عبور جدید" /> */}
                  <Controller
                    name="confirmPassword"
                    control={control}
                    render={({ field }: any) => (
                      <>
                        <Input
                          className="primary-input m-0"
                          autoFocus
                          type="password"
                          placeholder="تکرار رمز عبور جدید را وارد نمایید"
                          autoComplete="off"
                          invalid={errors.confirmPassword && true}
                          {...field}
                        />
                        <div className="danger-message">{errors.confirmPassword?.message}</div>
                      </>
                    )}
                  />
                </div>
              </div>
            </div>
            <button type="submit" className="primary-btn">
              تغییر رمز عبور
            </button>
          </Form>
        </div>
      </div>
    </>
  );
};

export default ChangePassword;
