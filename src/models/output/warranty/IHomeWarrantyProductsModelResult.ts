export interface IHomeWarrantyProductsModelResult {
  id: number;
  title: string;
  baseValue: number;
  insuranceRisksPercent: number;
  insuranceRisksValue: number;
  warrantyRisksPercent: number;
  warrantyRisksValue: number;
  comprehensiveCoveragePercent: number;
  comprehensiveCoverageValue: number;
  isRequired: boolean;
  inDiscount: boolean;
  estimatedValues: [{ value: number; label: string }];
}
