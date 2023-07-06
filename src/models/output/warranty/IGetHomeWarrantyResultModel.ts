import type { JSONSchema7 } from 'json-schema';
export interface IGetHomeWarrantyResultModel {
  id: number;
  actionId: number;
  title: string;
  productCode: string;
  required: boolean;
  baseValue: number;
  insuranceRisksPercent: number;
  insuranceRisksValue: number;
  warrantyRisksPercent: number;
  warrantyRisksValue: number;
  comprehensiveCoveragePercent: number;
  comprehensiveCoverageValue: number;
  propValues: JSONSchema7;
  propsUISchema: JSONSchema7;
}
