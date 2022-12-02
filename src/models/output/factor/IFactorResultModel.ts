import { ITechnicians } from '../orderDetail/IOrderDetailListResultModel';

export interface IFactorResultModel {
  requestNumber: string;
  currentDateTime: string;
  consumer: IConsumerFactor;
  technician: ITechnicians;
  totalPrice: number;
  totalTechnicianShare: number;
  totalKardoonShare: number;
  totalAgentShare: number;
  invoice: IInvoiceFactor[];
}

export interface IInvoiceFactor {
  serviceTypeTitle: string;
  description: string;
  productName: string;
  actionTitle: string;
  count: number;
  unitPrice: number;
  totalPrice: number;
  technicianShare: number;
  kardoonShare: number;
  agentShare: number;
}

interface IConsumerFactor {
  firstName: string;
  lastName: string;
  nationalCode: string;
  address: string;
  postalCode: string;
}
