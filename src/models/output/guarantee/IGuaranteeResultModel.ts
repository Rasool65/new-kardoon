export interface IGuaranteeResultModel {
  consumerInfo?: IConsumerInfo;
  guaranteeInfoList?: IGuaranteeInfoList[];
}

interface IConsumerInfo {
  consumerFullName?: string;
  nationalCode?: string;
  address?: string;
  zipCode?: string;
  contactNumber?: string;
}
export interface IGuaranteeInfoList {
  requestNumber?: string;
  productTitle?: string;
  warrantyStartDate?: string;
  warrantyEndDate?: string;
  technicianFullName?: string;
  model?: string;
  serialNumber?: string;
  labelNumber?: string;
}
