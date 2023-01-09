import { yupResolver } from '@hookform/resolvers/yup';
import { FunctionComponent, useState } from 'react';
import { Form, FormFeedback, Input } from 'reactstrap';
import EnterCode from './EnterCode';
import { IModalModel } from './ModalModel';
import { ForgetPasswordModelSchema, IForgetPasswordModel } from './../../models/input/authentication/IForgetPasswordModel';
import { IOutputResult } from '@src/models/output/IOutputResult';
import { IForgetPasswordResultModel } from '@src/models/output/authentication/IForgetPasswordResultModel';
import useHttpRequest, { RequestDataType } from '@src/hooks/useHttpRequest';
import { APIURL_SEND_PASSWORD } from '@src/configs/apiConfig/apiUrls';
import { useToast } from '@src/hooks/useToast';
import { useTranslation } from 'react-i18next';
import { Controller, useForm } from 'react-hook-form';
import LoadingComponent from '@src/components/spinner/LoadingComponent';

const PasswordMessage: FunctionComponent<IModalModel> = ({ display, handleClose }) => {
  const { t }: any = useTranslation();
  const httpRequest = useHttpRequest(RequestDataType.json);
  const [loading, setLoading] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(false);
  const [mobileNumber, setMobileNumber] = useState<string>();
  const toast = useToast();
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm<IForgetPasswordModel>({ mode: 'onChange', resolver: yupResolver(ForgetPasswordModelSchema) });

  const handleEditMobileNo = () => {
    setShow(false);
  };

  const onSubmit = (data: IForgetPasswordModel) => {
    setLoading(true);
    if (data && !loading) {
      httpRequest
        .postRequest<IOutputResult<IForgetPasswordResultModel>>(APIURL_SEND_PASSWORD, data)
        .then((result) => {
          toast.showSuccess(result.data.message);
          setMobileNumber(data.mobileNumber);
          setShow(true);
        })
        .catch(() => {
          setLoading(false);
        })
        .finally(() => setLoading(false));
    }
  };
  return (
    <>
      <div className="modal" style={{ display: display ? 'block' : 'none' }}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className="modal-content">
            <div className="modal-header">
              <span className="close" onClick={handleClose}>
                &times;
              </span>
              <h4>ورود با رمز یکبارمصرف</h4>
            </div>

            <div className="modal-items">
              <p className="info-text">شماره تلفن خود را وارد کنید</p>
              <div>
                <Controller
                  name="mobileNumber"
                  control={control}
                  render={({ field }: any) => (
                    <>
                      <Input
                        className="primary-input"
                        type="number"
                        placeholder={t('EnterMobile')}
                        autoComplete="off"
                        invalid={errors.mobileNumber && true}
                        {...field}
                      />
                      <div className="danger-message">{errors.mobileNumber?.message}</div>
                    </>
                  )}
                />
              </div>
              <button className="primary-btn">{loading ? <LoadingComponent /> : 'دریافت رمز'}</button>
            </div>
          </div>
        </Form>
      </div>
      <EnterCode handleClose={handleEditMobileNo} display={show} mobileNumber={mobileNumber} />
    </>
  );
};
export default PasswordMessage;
