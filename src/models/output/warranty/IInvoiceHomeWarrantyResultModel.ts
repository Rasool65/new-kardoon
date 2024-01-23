export interface IInvoiceHomeWarrantyResultModel {
  requestNumber?: string;
  consumerFullName?: string;
  nationalCode?: string;
  contactNumber?: string;
  address?: string;
  zipCode?: string;
  technicianFullName?: string;
  presenceTime?: string;
  presenceTimeShamsi?: string;
  totalAmount?: number;
  orderDetails?: IHomeWarrantyOrderDetail[];
  createdByFirstName?: string;
  createdByLastName?: string;
  totalTechnicianAmount?: number;
  totalAgentAmount?: number;
  totalKardoonAmount?: number;
}
export interface IHomeWarrantyOrderDetail {
  actionName: string;
  count: number;
  price: number;
  totalPrice: number;
  technicianAmount: number;
  agentAmount: number;
  kardoonAmount: number;
}
