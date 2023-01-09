import { IFiles } from './IInvoiceActionResultModel';
export interface IMissionDetailResultModel {
  consumerId: number;
  userName?: string;
  requestDetailId: number;
  description: string;
  requestNumber: string;
  serviceTypeTitle?: string;
  productTypeTitle?: string;
  productCategoryId?: number;
  presenceDateTime?: string;
  presenceShift?: string;
  address?: string;
  statusId?: number;
  statusTitle?: string;
  problemList?: IProblemList[];
  imageMessage?: string[];
  videoMessage?: string;
  audioMessage?: string;
  addressOwnerFirstName?: string;
  addressOwnerLastName?: string;
  addressOwnerTel?: string;
  cityName?: string;
  consumerFirstName?: string;
  consumerLastName?: string;
  consumerPhoneNumber?: string;
  districtName?: string;
  isUrgent: boolean;
  regionName?: string;
  files?: IFiles[];
  orderId: number;
}
export interface IProblemList {
  value?: number;
  label?: string;
}
export interface IStatus {
  value?: number;
  label?: string;
}

export interface IStatusMission {
  value?: number;
  label?: string;
  causeList?: IStatus[];
}
