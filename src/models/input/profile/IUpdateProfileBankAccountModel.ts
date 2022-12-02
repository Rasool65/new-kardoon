import { t } from 'i18next';
import * as yup from 'yup';

export interface IUpdateProfileBankAccountModel {
  userId?: number;
  bankName: string;
  acountNumber: string;
  cardNumber: string;
  shabaNumber: string;
  accountHolderName: string;
}

export const UpdateProfileBankAccountModelSchema: yup.SchemaOf<IUpdateProfileBankAccountModel> = yup.object({
  userId: yup.number(),
  bankName: yup.string().required(t('وارد کردن نام بانک اجباریست')),
  acountNumber: yup.string().required(t('وارد کردن شماره حساب اجباریست')),
  cardNumber: yup.string().required(t('وارد کردن شماره کارت اجباریست')),
  shabaNumber: yup.string().required(t('وارد کردن شماره شبا اجباریست')),
  accountHolderName: yup.string().required(t('وارد کردن نام صاحب حساب اجباریست')),
});
