export interface ILoginResultModel {
  accessTokenInfo: IAuthResultModel;
  user: IUserModel;
}

export interface IAuthResultModel {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

export interface IProfileUser {
  email: string;
  gender: number;
  genderName: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  isPublicEmail: boolean;
  residenceCityId?: number;
  residenceCityName?: string;
  nationalCode?: string;
  addresses?: string[];
  intrductionInfo: IIntrductionInfo;
  profileImageUrl?: string;
  phoneNumber?: string;
  workAddress?: string;
  homeAddress?: string;
}

export interface IIntrductionInfo {
  refkey: number;
  introMethodId: number;
  introMethodTitle: string;
  introductionCode: string;
}
export interface IUserModel {
  guId: string;
  userId: number;
  userName: string;
  profile: IProfileUser;
  roles: IUserRoles[];
  accountInfo?: IAccountInfo;
}

interface IUserRoles {
  id: number;
  name: string;
  normalizedName: string;
}

interface IAccountInfo {
  bankName?: string;
  acountNumber?: string;
  cardNumber?: string;
  shabaNumber?: string;
  accountHolderName?: string;
}
