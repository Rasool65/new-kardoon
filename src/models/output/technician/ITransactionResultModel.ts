export interface ITransactionResultModel {
  description: string;
  isDebtor: boolean;
  debtorAmount: number;
  creditorAmount: number;
  transactionDateTime: string;
  consumerFirstName?: string;
  consumerLastName?: string;
  requestNumber: string;
}
