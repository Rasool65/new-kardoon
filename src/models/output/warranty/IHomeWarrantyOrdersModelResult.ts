import { IAppearanceReviewValues, ITechnicalValues } from './IHomeWarrantyProductsModelResult';
export interface IGetHomeWarrantyOrderInfoResultModel {
  products: IHomeWarrantyOrdersModelResult[];
  calculations: ICalculationsHomeWarrantyOrderPrice;
  prePaymentAmount: number;
}
export interface IHomeWarrantyOrdersModelResult {
  productId: number;
  productName: string;
  baseValue: number;
  insuranceRisksPercent: number;
  insuranceRisksValue: number;
  warrantyRisksPercent: number;
  warrantyRisksValue: number;
  comprehensiveCoveragePercent: number;
  comprehensiveCoverageValue: number;
  reductionValue: number;
  addition: number;
  estimatedValue: number;
  activeWarranty: boolean;
  price: number;
  priceAfterReduction_Addition: number;
  tax: number;
  paymentableAmount: number;
}

export interface ICalculationsHomeWarrantyOrderPrice {
  calculatePrice: number;
  totalPrice: number;
  totalReductionValue: number;
  totalTax: number;
  totalPaymentableAmount: number;
  prePaymentAmount: number;
}

export interface IGetHomeWarrantyOrderInfo {
  uuid: string;
  actionId: number;
  productId: number;
  priceAfterReduction_Addition: number;
  activeWarranty: boolean;
  estimatedValue: number;
  brandValue: number;
  count: number;
  images?: IImagesHomeWarranty[];
  model: string;
  serial: string;
  technicalDescription: string;
  appearanceReviewValues: IAppearanceReviewValues[];
  technicalValues: ITechnicalValues[];
}

export interface IImagesHomeWarranty {
  tag: 0;
  imageFile: any;
  description: string;
}
