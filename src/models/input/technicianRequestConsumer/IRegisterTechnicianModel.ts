import { t } from 'i18next';
import * as yup from 'yup';
import { mobileRegExp } from '../authentication/ILoginModel';
import { checkCodeMelli } from '../profile/IUpdateProfileModel';

export interface IRegisterTechnicianModel {
  firstName: string;
  lastName: string;
  mobile: string;
  gender?: number;
  nationalCode: string;
  introductionInfo?: {
    refkey?: number;
    introMethodId?: number;
    introductionCode?: string;
  };
}

export const RegisterTechnicianModelSchema: yup.SchemaOf<IRegisterTechnicianModel> = yup.object({
  firstName: yup.string().required(t('FirstNameRequired')),
  lastName: yup.string().required(t('LastNameRequired')),
  mobile: yup.string().required(t('MobileRequired')).matches(mobileRegExp, t('InvalidMobile')),
  gender: yup.number(),
  nationalCode: yup
    .string()
    .required(t('NationalCodeRequired'))
    .length(10, t('NationalCodeLengthInvalid'))
    .test('codeMelliValidation', t('NationalCodeInvalid'), checkCodeMelli),
  introductionInfo: yup.object({
    refkey: yup.number(),
    introMethodId: yup.number(),
    introductionCode: yup.string(),
  }),
});
