export interface IOrderListResultModel {
  requestId: number;
  serviceTypeTitle?: string;
  productTitle?: string;
  requestNumber: string;
  presenceTime: string;
  presenceShiftId?: number;
  presenceShift?: string;
  isUrgent: boolean;
  requestDetailId: number;
  requestDescription: string;
  statusId: number;
  statusTitle: string;
  technicianInfoList: string[];
  presenceDateTime?: string;
}

export enum IEStatusId {
  'bg-success',
  'bg-warning ',
  'bg-danger ',
  'bg-info',
  'bg-danger',
  'bg-warning',
}
