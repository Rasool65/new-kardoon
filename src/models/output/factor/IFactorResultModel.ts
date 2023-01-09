export interface IFactorResultModel {
  requestNumber?: string;
  consumerFullName?: string;
  nationalCode?: string;
  contactNumber?: string;
  address?: string;
  zipCode?: string;
  technicianFullName?: string;
  actionName?: string;
  count?: number;
  price?: number;
  totalPrice?: number;
  presenceTime?: string;
  presenceTimeShamsi?: string;
  totalAmount?: number;
  orderDetails?: IInvoiceOrderDetail[];
  createdByFirstName?: string;
  createdByLastName?: string;
  totalTechnicianAmount?: number;
  totalAgentAmount?: number;
  totalKardoonAmount?: number;
}

export interface IInvoiceOrderDetail {
  actionName?: string;
  count?: number;
  price?: number;
  totalPrice?: number;
  technicianAmount?: number;
  agentAmount?: number;
  kardoonAmount?: number;
}
