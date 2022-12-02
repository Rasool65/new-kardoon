export interface IRequestDetailPageProp {
  handleClickNextToFirst?: any;
  handleClickNextToSecond?: any;
  handleClickMore?: any;
  handleSubmit?: any;
  isLoading?: boolean;
  title?: string;
}

export interface IRequestDetailSecond {
  isUrgent: boolean;
  presenceDate?: string;
  presenceShift?: number;
  refkey: number;
}
