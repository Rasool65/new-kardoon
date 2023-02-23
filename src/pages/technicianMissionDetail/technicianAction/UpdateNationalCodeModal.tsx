import { FunctionComponent, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Form, FormFeedback, Input } from 'reactstrap';
import { t } from 'i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  AddTechnicanActionUpdateNationalCodeModelSchema,
  ITechnicianActionUpdateNationalCode,
} from '@src/models/input/technicianMission/ITechnicianActionUpdateNationalCode';
import LoadingComponent from '@src/components/spinner/LoadingComponent';
import useHttpRequest from '@src/hooks/useHttpRequest';
import { APIURL_PUT_UPDATE_CONSUMER_NATIONAL_CODE } from '@src/configs/apiConfig/apiUrls';
import { IOutputResult } from '@src/models/output/IOutputResult';
import { useToast } from '@src/hooks/useToast';

interface RemoveConfirmModalProps {
  requestDetailId: number;
  confirmModalVisible?: boolean;
  reject: any;
}

const UpdateNationalCodeModal: FunctionComponent<RemoveConfirmModalProps> = ({
  confirmModalVisible,
  reject,
  requestDetailId,
}) => {
  const httpRequest = useHttpRequest();
  const toast = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const {
    register,
    control,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm<ITechnicianActionUpdateNationalCode>({
    mode: 'onChange',
    resolver: yupResolver(AddTechnicanActionUpdateNationalCodeModelSchema),
  });
  const onSubmit = (data: ITechnicianActionUpdateNationalCode) => {
    setLoading(true);
    const body = {
      requestDetailId: requestDetailId,
      consumerNationalCode: data.consumerNationalCode,
    };
    httpRequest.updateRequest<IOutputResult<any>>(`${APIURL_PUT_UPDATE_CONSUMER_NATIONAL_CODE}`, body).then((result) => {
      setLoading(false);
      result.data.isSuccess ? (toast.showSuccess(result.data.message), reject()) : toast.showError(result.data.message);
    });
  };
  return (
    <>
      <div className={`modal ${confirmModalVisible ? 'd-block' : ''}`}>
        <div className="modal-content">
          <Form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-header">
              <h2 className="header pointer" onClick={reject}>
                X
              </h2>
              <h1 className="header">ثبت کد ملی</h1>
            </div>
            <p className="boxed-text-l">لطفأ ابتدا کد ملی معتبر مشتری را ثبت نمایید</p>
            <Controller
              name="consumerNationalCode"
              control={control}
              render={({ field }) => (
                <>
                  <Input
                    className="account-data-input"
                    type="number"
                    placeholder={'کد ملی مشتری را وارد نمایید'}
                    autoComplete="off"
                    invalid={errors.consumerNationalCode && true}
                    {...field}
                  />
                  <FormFeedback>{errors.consumerNationalCode?.message}</FormFeedback>
                </>
              )}
            />

            <div className="row me-3 ms-3 mb-0">
              <div className="col-6">
                <button type="submit" className="primary-btn green-btn">
                  {loading ? <LoadingComponent /> : `ثبت کد ملی`}
                </button>
              </div>
              <div className="col-6">
                <button onClick={reject} className="red-btn">
                  انصراف
                </button>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};

export default UpdateNationalCodeModal;
