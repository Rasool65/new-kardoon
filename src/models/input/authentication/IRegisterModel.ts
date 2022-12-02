import { t } from 'i18next';
import * as yup from 'yup';
import { mobileRegExp } from './ILoginModel';

export interface IRegisterModel {
  firstName: string;
  lastName: string;
  mobile: string;
  gender?: boolean;
}

export const RegisterModelSchema: yup.SchemaOf<IRegisterModel> = yup.object({
  firstName: yup.string().required(t('FirstNameRequired')),
  lastName: yup.string().required(t('LastNameRequired')),
  mobile: yup.string().required(t('MobileRequired')).matches(mobileRegExp, t('InvalidMobile')),
  gender: yup.boolean(),
});
