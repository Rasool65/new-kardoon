import { ISubmitEvent } from '@rjsf/core';

export interface IHomeWarrantyProduct {
  id: string;
  productId: number;
  title: string;
  actionId: number;
  formGen: ISubmitEvent<unknown>;
  discountAmount: number;
  costSource: number;
  count: number;
  price: number;
}
