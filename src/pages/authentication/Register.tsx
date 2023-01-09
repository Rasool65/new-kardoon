import { yupResolver } from '@hookform/resolvers/yup';
import { APIURL_REGISTER } from '@src/configs/apiConfig/apiUrls';
import useHttpRequest from '@src/hooks/useHttpRequest';
import { useToast } from '@src/hooks/useToast';
import { IRegisterModel, RegisterModelSchema } from '@src/models/input/authentication/IRegisterModel';
import { IRegisterResultModel } from '@src/models/output/authentication/IRegisterResultModel';
import { IOutputResult } from '@src/models/output/IOutputResult';
import { RootStateType } from '@src/redux/Store';
import { FunctionComponent, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Button, Form, FormFeedback, Input, Label, Spinner } from 'reactstrap';
import { IModalModel } from './ModalModel';

const Register: FunctionComponent<IModalModel> = ({ showRegisterModal, display, handleClose }) => {
  const color = useSelector((state: RootStateType) => state.theme.color);
  const { t }: any = useTranslation();
  const toast = useToast();
  const [isFemale, setIsFemale] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const httpRequest = useHttpRequest();

  const {
    register,
    control,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm<IRegisterModel>({ mode: 'onChange', resolver: yupResolver(RegisterModelSchema) });

  const onSubmit = (data: IRegisterModel) => {
    setLoading(true);
    const body = {
      firstName: data.firstName,
      lastName: data.lastName,
      mobile: data.mobile,
      gender: Number(!isFemale),
    };
    if (data && !loading) {
      httpRequest
        .postRequest<IOutputResult<IRegisterResultModel>>(APIURL_REGISTER, body)
        .then((result) => {
          toast.showSuccess(result.data.message);
          handleClose();
        })
        .catch(() => {
          setLoading(false), handleClose();
        })
        .finally(() => setLoading(false));
    }
  };
  return (
    <>
      <div className="modal" style={{ display: display ? 'block' : 'none' }}>
        <div className="modal-content">
          <Form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-header">
              <span className="close" onClick={handleClose}>
                &times;
              </span>
              <h4>ورود/ثبت نام</h4>
            </div>

            <div className="modal-items">
              <Label className="info-text" htmlFor="number-input">
                لطفا شماره همراه خود را وارد کنید
              </Label>
              <Controller
                name="mobile"
                control={control}
                render={({ field }: any) => (
                  <>
                    <Input
                      autoFocus
                      className="primary-input"
                      type="number"
                      placeholder={t('EnterMobile')}
                      autoComplete="off"
                      invalid={errors.mobile && true}
                      {...field}
                    />
                    <FormFeedback className="danger-message">{errors.mobile?.message}</FormFeedback>
                  </>
                )}
              />
              <div className="gender">
                <img
                  src={require(`@src/scss/images/icons/${color}-famel-icon.svg`)}
                  className={`${!isFemale && 'disable'} gender-icon`}
                  alt=""
                />
                <div className="toggle-center">
                  <Input
                    {...register('gender', { required: true })}
                    name="gender"
                    onChange={(e) => {
                      e.currentTarget.checked ? setIsFemale(true) : setIsFemale(false);
                    }}
                    type="checkbox"
                    className="toggle-checkbox"
                  />
                </div>
                <img
                  src={require(`@src/scss/images/icons/${color}-male-icon.svg`)}
                  className={`${isFemale && 'disable'} gender-icon`}
                  alt=""
                />
              </div>
              <div>
                <Label className="info-text" htmlFor="name-input">
                  نام
                </Label>
                <Controller
                  name="firstName"
                  control={control}
                  render={({ field }: any) => (
                    <>
                      <Input
                        className="primary-input"
                        type="text"
                        placeholder={t('EnterName')}
                        autoComplete="off"
                        invalid={errors.firstName && true}
                        {...field}
                      />
                      <div className="danger-message">{errors.firstName?.message}</div>
                    </>
                  )}
                />
                <Label className="info-text" htmlFor="lastname-input">
                  نام خانوادگی
                </Label>
                <Controller
                  name="lastName"
                  control={control}
                  render={({ field }: any) => (
                    <>
                      <Input
                        className="primary-input"
                        type="text"
                        placeholder={t('EnterFamily')}
                        autoComplete="off"
                        invalid={errors.lastName && true}
                        {...field}
                      />
                      <div className="danger-message">{errors.lastName?.message}</div>
                    </>
                  )}
                />
              </div>
              <Button type="submit" className="primary-btn">
                {loading ? <Spinner /> : t('Signup')}{' '}
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};
export default Register;
