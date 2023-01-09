import * as yup from 'yup';
import { t } from 'i18next';
import { ITitleResultModel } from '@src/models/output/missionDetail/ITitleResultModel';

export interface ITechnicianRequestModel {
  consumerId?: number;
  presenceDate: string;
  presenceShift?: IPresenceShift;
  isUrgent?: boolean;
  requestDetail: IRequestDetail;
  consumerAddress: IConsumerAddress;
}

export const AddTechnicianRequestModelSchema: yup.SchemaOf<ITechnicianRequestModel> = yup.object({
  consumerId: yup.number(),
  presenceDate: yup.string().required('تعیین تاریخ مراجعه الزامیست'),
  presenceShift: yup.object({
    value: yup.number().required('شیفت را تعیین نمایید'),
    label: yup.string(),
  }),
  isUrgent: yup.bool(),
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
  }),
  consumerAddress: yup.object({
    countryId: yup.object({
      value: yup.number().required('انتخاب نام کشور الزامیست'),
      label: yup.string(),
    }),
    provinceId: yup.object({
      value: yup.number().required('انتخاب نام استان الزامیست'),
      label: yup.string(),
    }),
    cityId: yup.object({
      value: yup.number().required('انتخاب نام شهر الزامیست'),
      label: yup.string(),
    }),
    regionId: yup.object({
      value: yup.number().required('انتخاب نام منطقه الزامیست'),
      label: yup.string(),
    }),
    districtId: yup.object({
      value: yup.number().required('انتخاب نام محله الزامیست'),
      label: yup.string(),
    }),
    zipCode: yup.string().required(t('ZipCodeRequired')),
    latitude: yup.number(),
    longitude: yup.number(),
    title: yup.object({ label: yup.string(), value: yup.number().required('انتخاب عنوان اجباریست') }),
    homeTel: yup.string().required(t('HomeTelRequired')),
    address: yup.string().required(t('AddressRequired')),
    number: yup.number().required(t('NumberRequired')),
    unit: yup.number().required(t('UnitRequired')),
  }),
});

export interface IServiceTypeId {
  value?: number;
  label?: string;
}
export interface IPresenceShift {
  value?: number;
  label?: string;
}
export interface IProductCategoryId {
  value?: number;
  label?: string;
}

export interface IProductGroup {
  value?: number;
  label?: string;
}

interface IProvinceSelectModel {
  label?: string;
  value?: number;
}
interface IDistrictSelectModel {
  label?: string;
  value?: number;
}
interface ICountrySelectModel {
  label?: string;
  value?: number;
}
interface IRegionSelectModel {
  label?: string;
  value?: number;
}
interface ICitySelectModel {
  label?: string;
  value?: number;
}

interface IRequestDetail {
  serviceTypeId: IServiceTypeId;
  productCategoryId: IProductCategoryId;
  requestDescription: string;
  productGroup: IProductGroup;
}

interface IConsumerAddress {
  countryId?: ICountrySelectModel;
  cityId: ICitySelectModel;
  provinceId: IProvinceSelectModel;
  regionId: IRegionSelectModel;
  districtId: IDistrictSelectModel;
  zipCode: string;
  latitude?: number;
  longitude?: number;
  title: ITitleResultModel;
  homeTel: string;
  address: string;
  number: number;
  unit: number;
}
