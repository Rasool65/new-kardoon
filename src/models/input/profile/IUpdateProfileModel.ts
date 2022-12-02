import { t } from 'i18next';
import * as yup from 'yup';

export interface IUpdateProfileModel {
  userName?: string;
  firstName: string;
  lastName: string;
  email: string;
  isPublicEmail?: boolean;
  birthDate: string;
  gender?: boolean;
  nationalCode: string;
  introductionInfo?: IIntroductionInfo;
  phoneNumber: string;
  homeAddress?: string;
  workAddress?: string;
}
interface IIntroductionInfo {
  refkey?: number;
  // introMethodId?: number;
  introductionCode?: string;
  introMethodTitle?: string;
}

export const checkCodeMelli = (meli_code: any) => {
  if (meli_code == undefined) return false;
  if (
    [
      '1111111111',
      '2222222222',
      '3333333333',
      '4444444444',
      '5555555555',
      '6666666666',
      '7777777777',
      '8888888888',
      '9999999999',
    ].includes(meli_code)
  ) {
    return false;
  } else {
    var c = parseInt(meli_code.charAt(9));
    var n =
      parseInt(meli_code.charAt(0)) * 10 +
      parseInt(meli_code.charAt(1)) * 9 +
      parseInt(meli_code.charAt(2)) * 8 +
      parseInt(meli_code.charAt(3)) * 7 +
      parseInt(meli_code.charAt(4)) * 6 +
      parseInt(meli_code.charAt(5)) * 5 +
      parseInt(meli_code.charAt(6)) * 4 +
      parseInt(meli_code.charAt(7)) * 3 +
      parseInt(meli_code.charAt(8)) * 2;
    // @ts-ignore
    var r = n - parseInt(n / 11) * 11;
    if ((r == 0 && r == c) || (r == 1 && c == 1) || (r > 1 && c == 11 - r)) {
      return true;
    } else {
      return false;
    }
  }
};

export const UpdateProfileModelSchema: yup.SchemaOf<IUpdateProfileModel> = yup.object({
  userName: yup.string(),
  firstName: yup.string().required(t('FirstNameRequired')),
  lastName: yup.string().required(t('LastNameRequired')),
  email: yup.string().required(t('EmailRequired')).email(t('EmailNotMatch')),
  phoneNumber: yup.string().required('شماره تماس ضروری اجباریست'),
  nationalCode: yup
    .string()
    .required(t('NationalCodeRequired'))
    .length(10, t('NationalCodeLengthInvalid'))
    .test('codeMelliValidation', t('NationalCodeInvalid'), checkCodeMelli),
  isPublicEmail: yup.boolean(),
  birthDate: yup.string().required(t('BirthDateIsRequired')),
  homeAddress: yup.string(),
  workAddress: yup.string(),
  gender: yup.boolean(),
  introductionInfo: yup.object({
    refkey: yup.number(),
    // introMethodId: yup.number(),
    introductionCode: yup.string(),
  }),
});
