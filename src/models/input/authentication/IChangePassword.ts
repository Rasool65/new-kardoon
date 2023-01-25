import { t } from 'i18next';
import * as yup from 'yup';

export interface IChangePasswordModel {
  userId?: number;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const ChangePasswordModelSchema: yup.SchemaOf<IChangePasswordModel> = yup.object({
  userId: yup.number(),
  oldPassword: yup.string().required('وارد کردن رمز عبور جاری الزامیست'),
  newPassword: yup.string().required('وارد کردن رمز عبور جدید الزامیست').min(6, t('PasswordLength6')),
  confirmPassword: yup
    .string()
    .required(t('ConfirmPasswordRequired'))
    .oneOf([yup.ref(`newPassword`), null], 'رمز عبور جدید با تکرار آن همخوانی ندارد'),
});
