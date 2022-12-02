import { IAddressesResultModel } from '@src/models/output/requestDetail/IAddressesResultModel';

export interface IAddAddressModal {
  GetAddresses?: any;
  reject: any;
  AddAddressModalVisible: boolean;
}

export interface IEditAddressModal {
  reject: any;
  GetAddresses?: any;
  EditAddressModalVisible?: any;
  CurrentAddress: IAddressesResultModel;
}
