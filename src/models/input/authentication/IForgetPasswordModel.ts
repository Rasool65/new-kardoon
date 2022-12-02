import { t } from 'i18next';
import * as yup from 'yup';
import { mobileRegExp } from './ILoginModel';

export interface IForgetPasswordModel {
  mobileNumber: string;
}

export const ForgetPasswordModelSchema: yup.SchemaOf<IForgetPasswordModel> = yup.object({
  mobileNumber: yup.string().required(t('MobileRequired')).matches(mobileRegExp, t('InvalidMobile')),
});
