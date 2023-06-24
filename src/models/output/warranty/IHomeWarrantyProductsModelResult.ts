export interface IHomeWarrantyProductsModelResult {
  id: number;
  uuid?: string;
  title: string;
  actionId: number;
  baseValue: number;
  insuranceRisksPercent: number;
  insuranceRisksValue: number;
  warrantyRisksPercent: number;
  warrantyRisksValue: number;
  comprehensiveCoveragePercent: number;
  comprehensiveCoverageValue: number;
  required: boolean;
  inDiscount: boolean;
  estimatedValues: [{ value: number; label: string }];
  productTagList: IProductTagList[];
}
export interface IProductTagList {
  value: number;
  label: string;
}
