import { IRequestDetail } from './IRequestDetail';

export interface ICreateConsumerRequest {
  userId?: number;
  presenceDate?: string;
  isUrgent?: boolean;
  presenceShift?: number;
  requestDetail: IRequestDetail[];
}

export interface IAddress {
  refkey?: number;
  provinceId?: number;
  cityId?: number;
  districtId?: number;
  latitude?: number;
  longitude?: number;
  title?: string;
  homeTel?: string;
  address?: string;
  number?: number;
  unit?: number;
  anotherAddressOwnerInformation?: IAnotherAddressOwnerInformation;
}

export interface IAnotherAddressOwnerInformation {
  firstName?: string;
  lastName?: string;
  mobileNumber?: string;
  telNumber?: string;
}
