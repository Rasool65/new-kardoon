import { APIURL_GET_BANK_ACCOUNT_INFO, APIURL_UPDATE_BANK_ACCOUNT_INFO } from '@src/configs/apiConfig/apiUrls';
import useHttpRequest from '@src/hooks/useHttpRequest';
import { FunctionComponent, useState, useEffect } from 'react';
import { Form, FormFeedback, Input } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { RootStateType } from '@src/redux/Store';
import { IOutputResult } from '@src/models/output/IOutputResult';
import { IBankAccountInfoResultModel } from '@src/models/output/profile/IBankAccountInfoResultModel';
import { Controller, useForm } from 'react-hook-form';
import {
  IUpdateProfileBankAccountModel,
  UpdateProfileBankAccountModelSchema,
} from '@src/models/input/profile/IUpdateProfileBankAccountModel';
import { yupResolver } from '@hookform/resolvers/yup';
import { useToast } from '@src/hooks/useToast';
import { useTranslation } from 'react-i18next';
import LoadingComponent from '@src/components/spinner/LoadingComponent';
import { updateUserData } from '@src/redux/reducers/authenticationReducer';

interface CreditInfoProps {
  closeModal?: any;
}

const CreditInfo: FunctionComponent<CreditInfoProps> = ({ closeModal }) => {
  const userData = useSelector((state: RootStateType) => state.authentication.userData);
  const { t }: any = useTranslation();
  const httpRequest = useHttpRequest();
  const toast = useToast();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);

  const GetBankAccountInfo = () => {
    httpRequest.getRequest<IOutputResult<IBankAccountInfoResultModel>>(`${APIURL_GET_BANK_ACCOUNT_INFO}`).then((result) => {
      let NewUserData = { ...userData };
      NewUserData['accountInfo'] = result.data.data;
      dispatch(updateUserData(NewUserData));
    });
  };

  const {
    register,
    control,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm<IUpdateProfileBankAccountModel>({ mode: 'onChange', resolver: yupResolver(UpdateProfileBankAccountModelSchema) });

  const onSubmit = (data: IUpdateProfileBankAccountModel) => {
    const body = {
      bankName: data.bankName,
      acountNumber: data.acountNumber,
      cardNumber: data.cardNumber,
      shabaNumber: data.shabaNumber,
      accountHolderName: data.accountHolderName,
    };
    if (data && !loading) {
      setLoading(true);
      httpRequest
        .updateRequest<IOutputResult<any>>(APIURL_UPDATE_BANK_ACCOUNT_INFO, body)
        .then((result) => {
          let NewUserData = { ...userData };
          NewUserData['accountInfo'] = body;
          dispatch(updateUserData(NewUserData));
          toast.showInfo(result.data.message);
        })
        .finally(() => setLoading(false));
    }
  };

  useEffect(() => {
    GetBankAccountInfo();
  }, []);
  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)} className="row">
        <div className="col-12 col-md-6">
          <p className="item-label">
            نام صاحب حساب<span className="color-danger">*</span>
          </p>
          <Controller
            name="accountHolderName"
            control={control}
            defaultValue={userData?.accountInfo?.accountHolderName || ''}
            render={({ field }) => (
              <>
                <Input
                  className="account-data-input"
                  type="text"
                  placeholder="نام صاحب حساب"
                  autoComplete="off"
                  invalid={errors.accountHolderName && true}
                  {...field}
                />
                <FormFeedback>{errors.accountHolderName?.message}</FormFeedback>
              </>
            )}
          />
        </div>
        <div className="col-12 col-md-6">
          <p className="item-label">
            نام بانک<span className="color-danger">*</span>
          </p>
          <Controller
            name="bankName"
            control={control}
            defaultValue={userData?.accountInfo?.bankName || ''}
            render={({ field }) => (
              <>
                <Input
                  className="account-data-input"
                  type="text"
                  placeholder="نام بانک"
                  autoComplete="off"
                  invalid={errors.bankName && true}
                  {...field}
                />
                <FormFeedback>{errors.bankName?.message}</FormFeedback>
              </>
            )}
          />
        </div>
        <div className="col-12 col-md-6">
          <p className="item-label">
            شماره حساب<span className="color-danger">*</span>
          </p>
          <Controller
            name="acountNumber"
            control={control}
            defaultValue={userData?.accountInfo?.acountNumber || ''}
            render={({ field }) => (
              <>
                <Input
                  className="account-data-input"
                  type="text"
                  placeholder="شماره حساب"
                  autoComplete="off"
                  invalid={errors.acountNumber && true}
                  {...field}
                />
                <FormFeedback>{errors.acountNumber?.message}</FormFeedback>
              </>
            )}
          />
        </div>
        <div className="col-12 col-md-6">
          <p className="item-label">
            شماره کارت<span className="color-danger">*</span>
          </p>
          <Controller
            name="cardNumber"
            control={control}
            defaultValue={userData?.accountInfo?.cardNumber || ''}
            render={({ field }) => (
              <>
                <Input
                  className="account-data-input"
                  type="text"
                  placeholder="شماره کارت"
                  autoComplete="off"
                  invalid={errors.cardNumber && true}
                  {...field}
                />
                <FormFeedback>{errors.cardNumber?.message}</FormFeedback>
              </>
            )}
          />
        </div>
        <div className="col-12">
          <p className="item-label">
            شماره شبا<span className="color-danger">*</span>
          </p>
          <Controller
            name="shabaNumber"
            control={control}
            defaultValue={userData?.accountInfo?.shabaNumber || ''}
            render={({ field }) => (
              <>
                <Input
                  className="account-data-input"
                  type="text"
                  placeholder="شماره شبا"
                  autoComplete="off"
                  invalid={errors.shabaNumber && true}
                  {...field}
                />
                <FormFeedback>{errors.shabaNumber?.message}</FormFeedback>
              </>
            )}
          />
        </div>
        <button type="submit" className="primary-btn green-btn">
          {loading ? <LoadingComponent /> : ' ثبت اطلاعات حساب بانکی'}
        </button>
      </Form>
    </>
  );
};

export default CreditInfo;
