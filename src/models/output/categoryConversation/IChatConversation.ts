import { IPaging } from './../mission/IMissionResultModel';
import { IFiles } from '@src/models/output/missionDetail/IInvoiceActionResultModel';
export interface IChatConversation<T extends object> {
  messages: IMessage[];
  paging: IPaging;
}

export interface IMessage {
  id: number;
  seen: boolean;
  from: number;
  fromFirstName?: string;
  fromLastName?: string;
  to: number;
  message: string;
  replyToId: number;
  replyTo: IMessage;
  seenDateTime: string;
  category: number;
  categoryTitle: string;
  conversationId: string;
  createDateTime: string;
  link: string;
  chatFile?: IFiles;
}
