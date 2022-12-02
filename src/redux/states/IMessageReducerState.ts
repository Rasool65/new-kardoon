import { IMessage } from '@src/models/output/categoryConversation/IChatConversation';

export interface IMessageReducerState {
  newMessage: IMessage;
  newMessageCount: number;
  showMessage: boolean;
}
