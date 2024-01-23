import { ISubmitEvent } from '@rjsf/core';

export interface IHomeWarrantyProduct {
  id: string;
  productId: number;
  productCode: string;
  title: string;
  actionId: number;
  formGen: string;
  discountAmount: number;
  costSource: number;
  count: number;
  price: number;
  priceAfterReduction_Addition: number;
  estimatedValue: string;
}
