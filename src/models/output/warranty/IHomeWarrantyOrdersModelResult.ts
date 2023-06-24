export interface IGetHomeWarrantyOrderInfoResultModel {
  products: IHomeWarrantyOrdersModelResult[];
  calculations: ICalculationsHomeWarrantyOrderPrice;
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
}

export interface ICalculationsHomeWarrantyOrderPrice {
  calculatePrice?: number;
  totalPrice?: number;
  totalReductionValue?: number;
  totalTax?: number;
}

export interface IGetHomeWarrantyOrderInfo {
  uuid: string;
  actionId: number;
  productId: number;
  priceAfterReduction_Addition: number;
  activeWarranty: boolean;
  estimatedValue: number;
  count: number;
  images?: IImagesHomeWarranty[];
}

export interface IImagesHomeWarranty {
  tag: 0;
  imageFile: any;
  description: string;
}
