import * as yup from 'yup';
import {
  IPresenceShift,
  IProductCategoryId,
  IProductGroup,
  IServiceTypeId,
} from './../technicianRequest/ITechnicianRequestModel';

export interface ITechnicianRequestConsumerModel {
  consumerId?: number;
  technicianId?: number;
  presenceDate: string;
  presenceShift?: IPresenceShift;
  isUrgent?: boolean;
  consumerAddressId?: number;
  requestDetail: IRequestDetail;
}

export const ITechnicianRequestConsumerModelSchema: yup.SchemaOf<ITechnicianRequestConsumerModel> = yup.object({
  consumerId: yup.number(),
  technicianId: yup.number(),
  presenceDate: yup.string().required('تعیین تاریخ مراجعه الزامیست'),
  presenceShift: yup.object({
    value: yup.number(),
    label: yup.string(),
  }),
  isUrgent: yup.boolean(),
  consumerAddressId: yup.number(),
  requestDetail: yup.object({
    serviceTypeId: yup.object({
      value: yup.number().required('انتخاب نوع خدمت اجباریست'),
      label: yup.string().required('انتخاب نوع خدمت اجباریست'),
    }),
    productCategoryId: yup.object({
      value: yup.number().required('انتخاب گروه بندی محصول اجباریست'),
      label: yup.string().required('انتخاب گروه بندی محصول اجباریست'),
    }),
    requestDescription: yup.string().required('توضیحات درخواست اجباریست'),
    productGroup: yup.object({ value: yup.number(), label: yup.string() }),
    // formGenDetail: yup.string(),
  }),
});

interface IRequestDetail {
  serviceTypeId: IServiceTypeId;
  productCategoryId: IProductCategoryId;
  requestDescription: string;
  productGroup?: IProductGroup;
  //   formGenDetail: string;
}
