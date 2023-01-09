import { IMessage } from '@src/models/output/categoryConversation/IChatConversation';
import { IStatusCountReducerState } from './IStatusMissionCountReducerState';

export interface IMessageReducerState {
  newMessage: IMessage;
  newMessageCount: number;
  newMessageBlogCount: number;
  showMessage: boolean;
  statusMission: IStatusCountReducerState[];
  walletBalance?: number;
}
