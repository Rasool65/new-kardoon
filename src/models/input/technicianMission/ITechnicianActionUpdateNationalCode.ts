import * as yup from 'yup';
import { checkCodeMelli } from '../profile/IUpdateProfileModel';
import { t } from 'i18next';

export interface ITechnicianActionUpdateNationalCode {
  requestDetailId?: number;
  consumerNationalCode: string;
}

export const AddTechnicanActionUpdateNationalCodeModelSchema: yup.SchemaOf<ITechnicianActionUpdateNationalCode> = yup.object({
  requestDetailId: yup.number(),
  consumerNationalCode: yup
    .string()
    .required(t('NationalCodeRequired'))
    .length(10, t('NationalCodeLengthInvalid'))
    .test('codeMelliValidation', t('NationalCodeInvalid'), checkCodeMelli),
});
