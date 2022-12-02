export interface IInvoiceActionResultModel {
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
}

export enum ECostSource {
  'مشتری' = 0,
  'گارانتی' = 1,
}

export interface IFiles {
  fileType?: string;
  tag?: string;
  fileTypeTitle?: string;
  fileUrl?: string;
}
