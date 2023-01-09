import { ITitleResultModel } from '@src/models/output/missionDetail/ITitleResultModel';
import { t } from 'i18next';
import * as yup from 'yup';

export interface IUpdateAddressModel {
  userName?: string;
  refkey?: number;
  countryId?: ICountrySelectModel;
  cityId?: ICitySelectModel;
  provinceId?: IProvinceSelectModel;
  regionId?: IRegionSelectModel;
  districtId?: IDistrictSelectModel;
  zipCode: string;
  latitude?: number;
  longitude?: number;
  title: ITitleResultModel;
  homeTel: string;
  address: string;
  number: number;
  unit: number;
  anotherAddressOwnerInformation?: IAnotherAddressOwnerInformation;
}
export const UpdateAddressModelSchema: yup.SchemaOf<IUpdateAddressModel> = yup.object({
  userName: yup.string(),
  refkey: yup.number(),
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
    value: yup.number(),
    label: yup.string(),
  }),
  districtId: yup.object({
    value: yup.number().required('انتخاب نام محله الزامیست'),
    label: yup.string(),
  }),
  zipCode: yup.string().length(10, 'کد پستی میبایست 10 رقم باشد').required(t('ZipCodeRequired')),
  latitude: yup.number(),
  longitude: yup.number(),
  title: yup.object({ label: yup.string(), value: yup.number().required(t('TitleRequired')) }),
  homeTel: yup.string().required(t('HomeTelRequired')),
  address: yup.string().required(t('AddressRequired')),
  number: yup.number().required(t('NumberRequired')),
  unit: yup.number().required(t('UnitRequired')),
  anotherAddressOwnerInformation: yup.object({
    firstName: yup.string(),
    lastName: yup.string(),
    mobileNumber: yup.string(),
    telNumber: yup.string(),
  }),
});
interface IAnotherAddressOwnerInformation {
  firstName?: string;
  lastName?: string;
  mobileNumber?: string;
  telNumber?: string;
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
