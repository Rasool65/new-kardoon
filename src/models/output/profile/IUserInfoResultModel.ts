import { IAddAddressesResultModel } from '@src/models/output/address/IAddAddressesResultModel';
import { IIntrductionInfo } from '../authentication/ILoginResultModel';

export interface IUserInfoResultModel {
  user: {
    userId?: number;
    isActive?: boolean;
    userName?: string;
    roles?: IRoles[];
    profile?: IProfile;
  };
}

interface IRoles {
  id?: number;
  name?: string;
  normalizedName?: string;
}

interface IProfile {
  residenceCityId?: number;
  residenceCityName?: string;
  email?: string;
  gender?: number;
  nationalCode?: string;
  genderName?: number;
  firstName?: string;
  lastName?: string;
  birthDate?: string;
  isPublicEmail?: boolean;
  phoneNumber?: string;
  workAddress?: string;
  homeAddress?: string;
  profileImageUrl?: string;
  addresses?: IAddAddressesResultModel[];
  intrductionInfo?: IIntrductionInfo;
}
