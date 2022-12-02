import type { JSONSchema7 } from 'json-schema';
import { IAttributesResultModel } from '../missionDetail/IAttributesResultModel';
import { IFiles } from '../missionDetail/IInvoiceActionResultModel';
import { IAddressesResultModel } from './../requestDetail/IAddressesResultModel';

export interface IOrderDetailListResultModel {
  requestDetailInfo?: IRequestDetailInfo;
  invoices?: IInvoices[];
}

export interface IRequestDetailInfo {
  requestDetailId?: number;
  attributes: IAttributesResultModel;
  description?: string;
  statusId?: number;
  statusTitle?: string;
  problemList?: IProblemList[];
  files?: IFiles[];
  technicianList?: ITechnicians[];
  isUrgent?: boolean;
  serviceTypeTitle?: string;
  productTypeTitle?: string;
  productCategoryId?: number;
  address?: IAddressesResultModel;
  requestNumber?: string;
  presenceDateTime?: string;
  presenceShift?: string;
}
export interface IInvoices {
  paymentId: number;
  serviceTypeTitle?: string; // نوع خدمت
  actionTitle?: string; // گروه خدمات
  description?: string; // شرح اقدامات
  productName?: string;
  price?: number;
  discount?: boolean;
  settlementStatus?: boolean;
  priceAfterDiscount: number;
  status?: string; // نقدی | اعتباری | گارانتی
  // paymentUrl?: string;
  paymentType?: string;
  costSource?: number;
}
export interface IProblemList {
  value?: number;
  label?: string;
}
export interface ITechnicians {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}
