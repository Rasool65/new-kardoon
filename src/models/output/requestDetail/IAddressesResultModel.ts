import { ITitleResultModel } from '../missionDetail/ITitleResultModel';

export interface IAddressesResultModel {
  refkey?: number;
  countryId?: number;
  countryName?: string;
  provinceName?: string;
  provinceId?: number;
  cityId?: number;
  cityName?: string;
  districtId?: number;
  districtName?: string;
  latitude?: number;
  longitude?: number;
  title?: ITitleResultModel;
  regionId?: number;
  regionName?: string;
  homeTel?: string;
  address?: string;
  number?: number;
  unit?: number;
  zipCode?: string;
  anotherAddressOwnerInformation?: IAnotherAddressOwnerInformation;
}

interface IAnotherAddressOwnerInformation {
  firstName?: string;
  lastName?: string;
  mobileNumber?: string;
  telNumber?: string;
}
