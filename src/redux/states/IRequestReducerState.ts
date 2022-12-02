import { ISubmitEvent } from '@rjsf/core';
import { IRequestDetail } from '@src/models/input/requestDetail/IRequestDetail';

export interface IRequestReducerState {
  requestDetail?: IRequestDetail;
  formGenDetail?: ISubmitEvent<unknown>;
}
