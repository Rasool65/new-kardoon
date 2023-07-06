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
  estimatedValues: IEstimateValues[];
  productTagList: IProductTagList[];
  brandValues: IBrandValues[];
  technicalReviewValues: ITechnicalValues[];
  appearanceReviewValues: IAppearanceReviewValues[];
}

export interface IProductTagList {
  value: number;
  label: string;
}

export interface IAppearanceReviewValues {
  value: number;
  label: string;
  result: boolean;
}

export interface IBrandValues {
  value: number;
  label: string;
}

export interface ITechnicalValues {
  value: number;
  label: string;
  result: boolean;
}

export interface IEstimateValues {
  value: number;
  label: string;
}
