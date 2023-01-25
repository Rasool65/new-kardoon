export interface IInvoiceIssuanceResultModel {
  requestNumber: string;
  consumerFullName: string;
  invoiceId: number;
  orderDetails?: IOrderDetails[];
}

export interface IOrderDetails {
  actionName?: string;
  count?: number;
  price?: number;
  totalPrice?: number;
  checkOutStatus?: number;
  checkOutStatusTitle?: string;
}
