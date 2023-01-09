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
  invoiceId?: number;
  totalPaymentAmount?: number;
  totalPaymentAmountAfterDiscount?: number;
  discount?: boolean;
  productCategoryTitle?: string;
  requestNumber?: string;
  invoiceStatusId?: number;
  invoiceStatusTitle?: string;
  detailList?: IDetailInvoiceList[];
}
export interface IDetailInvoiceList {
  paymentId?: number;
  serviceTypeTitle?: string;
  productName?: string;
  price?: number;
  priceAfterDiscount: number;
  discount?: boolean;
  settlementStatus: boolean;
  status?: string;
  actionTitle?: string;
  description?: string;
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
