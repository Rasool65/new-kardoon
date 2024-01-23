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
  order_EstimatedValue?: string;
  order_ActiveWarranty?: boolean;
  order_Addition?: number;
  order_Price?: number;
  order_PriceAfterReduction_Addition?: number;
  order_ReductionValue?: number;
  order_Tax?: number;
  order_PaymentValue?: number;
}
