export interface ITransactionResultModel {
  description: string;
  isDebtor: boolean;
  debtorAmount: number;
  creditorAmount: number;
  transactionDateTime: string;
}
