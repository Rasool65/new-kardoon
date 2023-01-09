import * as yup from 'yup';
import { mixed } from 'yup';

export interface ITechnicianActionModel {
  id?: number;
  technicianId?: number;
  price: string;
  action: IAction;
  count?: string;
  serviceTypeId: IService;
  description: string;
  sourceCost: ISourceCost;
  // discountAmount?: string;
  frontRight?: any;
  frontLeft?: any;
  behind?: any;
  locationImages?: any[];
  purchaseInvoice?: any;
  identityCard?: any;
  lableWarranty?: any;
}

export const AddTechnicianActionModelSchema: yup.SchemaOf<ITechnicianActionModel> = yup.object({
  id: yup.number(), //RequestDetailID
  serviceTypeId: yup.object({
    value: yup.number().required('انتخاب نوع خدمت اجباریست'),
    label: yup.string().required('انتخاب نوع خدمت اجباریست'),
  }),
  technicianId: yup.number(),
  price: yup.string().required('مقدار هزینه اجباریست'),
  // count: yup.string().required('تعداد اجباریست'),
  count: yup.string(),
  description: yup.string().required('توضیحات شرح اقدام اجباریست'),
  action: yup.object({
    price: yup.number().nullable(),
    value: yup.number().required('انتخاب گروه خدمات اجباریست'),
    label: yup.string().required('انتخاب گروه خدمات اجباریست'),
  }),
  sourceCost: yup.object({
    value: yup.number().required('انتخاب  اجباریست'),
    label: yup.string().required('انتخاب منبع هزینه اجباریست'),
  }),
  // discountAmount: yup.string(),
  frontRight: yup.object(),
  frontLeft: yup.object(),
  behind: yup.object(),
  // .shape({
  //   file: mixed()
  //     .test('required', 'You need to provide a file', (file) => {
  //       // return file && file.size <-- u can use this if you don't want to allow empty files to be uploaded;
  //       if (file) return true;
  //       return false;
  //     })
  //     .test('fileSize', 'The file is too large', (file) => {
  //       //if u want to allow only certain file sizes
  //       return file && file.size <= 2000000;
  //     }),
  // }),
  locationImages: yup.array(),
  purchaseInvoice: yup.object(),
  identityCard: yup.object(),
  lableWarranty: yup.object(),
});
interface IAction {
  price: number | null | undefined;
  value: number;
  label: string;
}
interface IService {
  value: number;
  label: string;
}
export interface ISourceCost {
  value: number;
  label: string;
}
