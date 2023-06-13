import { ComponentType, FunctionComponent, useEffect, useState } from 'react';
import { IPageProps } from '../../configs/routerConfig/IPageProps';
import useHttpRequest, { RequestDataType } from '@src/hooks/useHttpRequest';
import { useSelector, useDispatch } from 'react-redux';
import { RootStateType } from '@src/redux/Store';
import { APIURL_POST_CREATE_REQUEST } from '@src/configs/apiConfig/apiUrls';
import { IOutputResult } from '@src/models/output/IOutputResult';
import RequestDetailFirst from './RequestDetailFirst';
import RequestDetailConfirm from './RequestDetailSecond';
import { IRequestDetail } from '@src/models/input/requestDetail/IRequestDetail';
import { IRequestDetailSecond } from './IRequestDetailProp';
import { ICreateRequestResultModel } from '@src/models/output/requestDetail/ICreateRequestResultModel';
import { useToast } from '@src/hooks/useToast';
import { ISubmitEvent } from '@rjsf/core';
import RequestDetailZero from './RequestDetailZero';
import { useNavigate } from 'react-router-dom';
import { URL_MAIN } from '@src/configs/urls';
import { handleAddRequest, handleResetRequest } from '@src/redux/reducers/requestReducer';
import { IProductProblemsResultModel } from './../../models/output/requestDetail/IProductProblemsResultModel';

export type ISteps = {
  id: number;
  name: string;
  Component: ComponentType<any>;
};

const steps: ISteps[] = [
  {
    id: 0,
    name: 'فرم ساز',
    Component: RequestDetailZero,
  },
  {
    id: 1,
    name: 'اولیه',
    Component: RequestDetailFirst,
  },
  {
    id: 2,
    name: 'تکمیلی',
    Component: RequestDetailConfirm,
  },
];

const RequestDetail: FunctionComponent<IPageProps> = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const userData = useSelector((state: RootStateType) => state.authentication.userData);
  const request = useSelector((state: RootStateType) => state.Request);
  const httpRequest = useHttpRequest(RequestDataType.formData);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [CurrentStep, setCurrentStep] = useState(steps[activeStep]);
  const [formGenDetail, setFormGenDetail] = useState<ISubmitEvent<unknown>>();

  const onClickNextToFirst = (formGenDetail: ISubmitEvent<unknown>) => {
    setFormGenDetail(formGenDetail);
    setCurrentStep(steps[activeStep + 1]);
    setActiveStep(activeStep + 1);
  };
  const onClickNextToSecond = (requestDetail: IRequestDetail) => {
    const body = {
      formGenDetail: formGenDetail,
      requestDetail: requestDetail,
    };
    dispatch(handleAddRequest(body));
    setCurrentStep(steps[activeStep + 1]);
    setActiveStep(activeStep + 1);
  };
  const onClickMore = (requestDetail: IRequestDetail) => {
    const body = {
      formGenDetail: formGenDetail,
      requestDetail: requestDetail,
    };
    dispatch(handleAddRequest(body));
    navigate(URL_MAIN);
  };
  const handleSubmit = (body: IRequestDetailSecond) => {
    !body.refkey && toast.showError('آدرس را انتخاب نمایید');
    var formData = new FormData();
    if (body.presenceDate) formData.append('presenceDate', body.presenceDate?.toString());
    if (body.presenceShift) formData.append('presenceShift', body.presenceShift?.toString());
    formData.append('refkey', body.refkey.toString());
    formData.append('isUrgent', body.isUrgent.toString());

    for (var i = 0; i < request.length; i++) {
      //formGen
      formData.append(
        `requestDetail[${i}].formGenDetail`,
        request[i].formGenDetail ? JSON.stringify(request[i].formGenDetail?.formData) : '{}'
      );
      //requestDetail
      if (request[i].requestDetail?.serviceTypeId)
        formData.append(`requestDetail[${i}].serviceTypeId`, request[i].requestDetail!.serviceTypeId!.toString());
      formData.append(`requestDetail[${i}].productCategoryId`, request[i].requestDetail!.productCategoryId!.toString());
      formData.append(`requestDetail[${i}].requestDescription`, request[i].requestDetail!.requestDescription);
      if (request[i].requestDetail?.audioMessage)
        formData.append(`requestDetail[${i}].audioMessage`, request[i].requestDetail?.audioMessage);

      if (request[i].requestDetail?.imageMessage != undefined && request[i].requestDetail?.imageMessage?.length! > 0)
        request[i].requestDetail?.imageMessage?.forEach((imageFile: any, index: number) => {
          formData.append(`requestDetail[${i}].imageMessage[${index}].image`, imageFile);
          formData.append(`requestDetail[${i}].imageMessage[${index}].imagedescription`, '');
        });

      if (request[i].requestDetail?.problemList != undefined && request[i].requestDetail?.problemList?.length! > 0)
        request[i].requestDetail?.problemList?.forEach((problemList: IProductProblemsResultModel) => {
          formData.append(`requestDetail[${i}].problemList`, problemList.value?.toString()!);
        });
      if (request[i].requestDetail?.videoMessage)
        formData.append(`requestDetail[${i}].videoMessage`, request[i].requestDetail?.videoMessage);
    }
    if (formData) {
      setIsLoading(true);
      httpRequest
        .postRequest<IOutputResult<ICreateRequestResultModel>>(APIURL_POST_CREATE_REQUEST, formData)
        .then((result) => {
          result.data.isSuccess
            ? (toast.showSuccess(result.data.message), dispatch(handleResetRequest()), navigate(URL_MAIN), setIsLoading(false))
            : toast.showError(result.data.message);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };
  useEffect(() => {
    document.title = props.title;
  }, [props.title]);
  return (
    <>
      <CurrentStep.Component
        handleClickNextToFirst={onClickNextToFirst}
        handleClickNextToSecond={onClickNextToSecond}
        handleClickMore={onClickMore}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </>
  );
};

export default RequestDetail;
