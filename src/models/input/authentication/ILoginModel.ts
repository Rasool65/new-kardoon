import { t } from 'i18next';
import * as yup from 'yup';

export interface ILoginModel {
  client_id?: string;
  client_secret?: string;
  grant_type?: string;
  username: string;
  password: string;
}
export const mobileRegExp = /(^09[0-9]{9}$)|(^\u06F0\u06F9[\u06F0-\u06F9]{9})$/;

export const LoginModelSchema: yup.SchemaOf<ILoginModel> = yup.object({
  client_id: yup.string(),
  client_secret: yup.string(),
  grant_type: yup.string(),
  // username: yup.string().required(t('MobileRequired')).matches(mobileRegExp, t('InvalidMobile')),
  username: yup.string().required(t('MobileRequired')),
  password: yup.string().required(t('PasswordRequired')),
});
