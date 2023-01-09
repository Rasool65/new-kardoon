import { IPaging } from '../mission/IMissionResultModel';

export interface IBlogResultModel {
  paging?: IPaging;
  changeList?: IChangeList[];
}
export interface IChangeList {
  title?: string;
  summary?: string;
  content?: string;
  expirationDatetime?: string;
  issueDateTime?: string;
}
