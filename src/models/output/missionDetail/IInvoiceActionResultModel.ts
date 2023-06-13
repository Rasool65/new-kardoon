export interface IInvoiceActionResultModel {
  requestLinkId?: string;
  generalLinkId?: string;
  invoiceList: IInvoiceActionList[];
}

export enum ECostSource {
  'مشتری' = 0,
  'گارانتی' = 1,
}
export interface IInvoiceActionList {
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
  paymentUrl?: string;
  paymentType?: string;
  costSource?: number;
  files?: IFiles[];
  orderId?: number;
  hasInvoice: boolean;
}
export interface IFiles {
  description?: string;
  fileType?: string;
  tag?: string;
  fileTypeTitle?: string;
  fileUrl?: string;
}
