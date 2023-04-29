export interface IRegisterOptionResultModel {
  rp?: IRP;
  user?: IUser;
  challenge?: string;
  pubKeyCredParams?: IPubKeyCredParams[];
  timeout?: number;
  attestation?: string;
  authenticatorSelection?: IAuthenticatorSelection;
  excludeCredentials?: [];
  status?: string;
  errorMessage?: string;
}

interface IRP {
  id?: string;
  name?: string;
}
interface IUser {
  name?: string;
  id?: string;
  displayName?: string;
}
interface IPubKeyCredParams {
  type?: string;
  alg?: string;
}

interface IAuthenticatorSelection {
  requireResidentKey?: boolean;
  userVerification?: string;
}
