import { IAnotherAddressOwnerInformation } from '@src/models/input/requestDetail/ICreateConsumerRequest';
import { ITitleResultModel } from '@src/models/output/missionDetail/ITitleResultModel';

export interface IAddAddressesResultModel {
  refkey?: number;
  provinceId?: number;
  provinceName?: string;
  cityId?: number;
  cityName?: string;
  districtId?: number;
  districtName?: string;
  regionId?: number;
  regionName?: string;
  countryId?: number;
  countryName?: string;
  latitude?: number;
  longitude?: number;
  title?: ITitleResultModel;
  homeTel?: string;
  address?: string;
  number?: number;
  unit?: number;
  zipCode?: string;
  anotherAddressOwnerInformation?: IAnotherAddressOwnerInformation;
}
