import { IInvoiceActionResultModel } from '@src/models/output/missionDetail/IInvoiceActionResultModel';
import { IMissionDetailResultModel, IStatusMission } from '@src/models/output/missionDetail/IMissionDetailListResultModel';
import { IGetHomeWarrantyResultModel } from '@src/models/output/warranty/IGetHomeWarrantyResultModel';
import { ICalculationsHomeWarrantyOrderPrice } from '@src/models/output/warranty/IHomeWarrantyOrdersModelResult';
import { IHomeWarrantyProduct } from '@src/models/output/warranty/IHomeWarrantyProduct';

export type EventState = {
  loading?: boolean;
  btnLoading?: boolean;
  requestLoading?: boolean;
  btnDisabled?: boolean;
  agreementDisabled?: boolean;
  homeWarranties?: IGetHomeWarrantyResultModel[];
  selectDisabled?: boolean;
  followUpDescription?: string;
  calcResult?: ICalculationsHomeWarrantyOrderPrice;
  statusValue?: number;
  statusList?: IStatusMission[];
  followUpModalVisible?: boolean;
  describeModalVisible?: boolean;
  paymentId?: number;
  checkoutLoading?: boolean;
  progress?: number;
  calcSum?: number;
  showConfirmModal?: boolean;
  showCheckOutConfirmModal?: boolean;
  displayImage?: boolean;
  products?: IHomeWarrantyProduct[];
  productBeforCalc?: IProductCalc[];
  nextTrackingDateTime?: string;
  invoice?: IInvoiceActionResultModel;
  btnIssuance?: boolean;
  suspendCauseList?: number[];
  displayCallModal?: boolean;
  confirmRemoveModalVisible?: boolean;
  totalConsumerPayment?: number;
  orderId?: number;
  confirmModalVisible?: boolean;
  suspendReasonModalVisible?: boolean;
  progressReasonModalVisible?: boolean;
  progressCauseList?: number[];
  missionDetail?: IMissionDetailResultModel;
  imageSrc?: string;
  cardCode?: string;
  btnValidationLoading?: boolean;
  disabledValidationCode?: boolean;
};

interface IProductCalc {
  id: string;
  productId: number;
  activeWarranty: boolean;
  estimatedValue: number;
  count: number;
}
