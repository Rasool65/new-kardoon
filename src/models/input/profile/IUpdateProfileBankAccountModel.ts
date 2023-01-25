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
  bankName: yup.string().required(t('BankNameRequired')),
  acountNumber: yup.string().required(t('AccountNumberRequired')),
  cardNumber: yup.string().required(t('BankCardNumberRequired')),
  shabaNumber: yup.string().required(t('ShabaNumberRequired')),
  accountHolderName: yup.string().required(t('BankAccountNameRequired')),
});
