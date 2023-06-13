import { IUserModel } from '@src/models/output/authentication/ILoginResultModel';

export interface IAuthenticationReducerState {
  userData?: IUserModel;
  isAuthenticate: boolean;
  currentTokenGuid: string;
}
