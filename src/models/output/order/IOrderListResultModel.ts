export interface IOrderListResultModel {
  requestId: number;
  productCategoryTitle: string;
  serviceTypeTitle?: string;
  // productTitle?: string;
  requestNumber: string;
  presenceTime: string;
  presenceShiftId?: number;
  presenceShift?: string;
  isUrgent: boolean;
  requestDetailId: number;
  requestDescription: string;
  statusId: number;
  statusTitle: string;
  technicianInfoList: string[];
  presenceDateTime?: string;
}

export enum IEStatusId {
  'bg-success', // باز
  'bg-warning ', // تخصیص یافته
  'bg-danger ', // منتظر لغو
  'bg-info', // بسته
  'bg-danger', // ابطال
  'bg-warning', //در حال بررسی
}

export enum IEServiceTypeId {
  'repair' = 1, // تعمیر
  'installation' = 2, // نصب
  'periodic-service' = 3, // سرویس دوره ایی
  'guarantee' = 4, // گارانتی
  'piece-sale' = 5, // فروش قطعه
  'product-purchase' = 6, // خرید محصول
  'consulting' = 7, //کارشناسی و مشاوره
  'transportation' = 8, // حمل و نقل
  'insurance' = 12, // صدور بیمه
  'label' = 13, //لیبل
}

export enum IEStatusMissionId {
  'mission-status-success', // باز
  'mission-status-warning ', // تخصیص یافته
  'mission-status-danger ', // منتظر لغو
  'mission-status-info', // بسته
  'mission-status-danger', // ابطال
  'mission-status-warning', //در حال بررسی
}
