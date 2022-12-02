import * as yup from 'yup';

export interface ITechnicianSubRequestModel {
  requestNumber?: number;
  serviceTypeId: IServiceTypeId;
  technicianId?: number;
  productCategoryId: IProductCategoryId;
  requestDescription: string;
  productGroup: IProductGroup;
}

export const AddTechnicianSubRequestModelSchema: yup.SchemaOf<ITechnicianSubRequestModel> = yup.object({
  requestNumber: yup.number(),
  serviceTypeId: yup.object({
    value: yup.number().required('انتخاب نوع خدمت اجباریست'),
    label: yup.string().required('انتخاب نوع خدمت اجباریست'),
  }),
  productCategoryId: yup.object({
    value: yup.number().required('انتخاب گروه بندی محصول اجباریست'),
    label: yup.string().required('انتخاب گروه بندی محصول اجباریست'),
  }),
  technicianId: yup.number(),
  requestDescription: yup.string().required('توضیحات درخواست اجباریست'),
  productGroup: yup.object({ value: yup.number(), label: yup.string() }),
});

export interface IServiceTypeId {
  value: number;
  label: string;
}
export interface IProductCategoryId {
  value: number;
  label: string;
}

export interface IProductGroup {
  value?: number;
  label?: string;
}
