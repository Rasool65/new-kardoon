export interface IMissionsResultModel {
  technicianMissionList: ITechnicianMissionList[];
  paging: IPaging;
}

export interface ITechnicianMissionList {
  requestDetailId?: number;
  consumerFirstName?: string;
  consumerLastName?: string;
  address?: string;
  serviceTypeTitle?: string;
  productTitle?: string;
  presenceShiftId?: number;
  presenceShift?: string;
  presenceDateTime?: string;
  requestNumber?: string;
  statusId?: number;
  statusTitle?: string;
  isUrgent?: boolean;
}

export interface IPaging {
  totalItems?: number;
  itemsPerPage?: number;
  currentPage?: number;
  maxPagerItems?: number;
  showFirstLast?: boolean;
  showNumbered?: boolean;
  useReverseIncrement?: boolean;
  suppressEmptyNextPrev?: boolean;
  suppressInActiveFirstLast?: boolean;
  removeNextPrevLinks?: boolean;
}
