import { t } from 'i18next';
import * as yup from 'yup';

export interface IRequestDetail {
  serviceTypeId?: number;
  productCategoryId?: number;
  requestDescription: string;
  audioMessage?: any;
  imageMessage?: any[];
  videoMessage?: any;
  problemList?: IProblemsSelectModel[];
}

export const RequestDetailModelSchema: yup.SchemaOf<IRequestDetail> = yup.object({
  serviceTypeId: yup.number(),
  productCategoryId: yup.number(),
  requestDescription: yup.string().required(t('RequestDescriptionRequired')),
  audioMessage: yup.object(),
  imageMessage: yup.array(),
  videoMessage: yup.object(),
  problemList: yup.array(
    yup.object({
      value: yup.number(),
      label: yup.string(),
    })
  ),
});

export interface IProblemsSelectModel {
  label?: string;
  value?: number;
}
