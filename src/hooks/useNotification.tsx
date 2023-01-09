import {
  APIURL_GET_COUNT_SYSTEM_MESSAGE,
  APIURL_GET_MESSAGE_COUNT,
  APIURL_GET_STATUS_MISSION,
  API_URL_GET_WALLET_BALANCE,
} from '@src/configs/apiConfig/apiUrls';
import { ICountResultModel } from '@src/models/output/categoryConversation/ICountResultModel';
import { IOutputResult } from '@src/models/output/IOutputResult';
import { IStatusMissionCountResultModel } from '@src/models/output/main/IStatusMissionCountResultModel';
import {
  handleNewMessageBlogCount,
  handleNewMessageCount,
  handleStatusMission,
  handleWalletBalance,
} from '@src/redux/reducers/messageReducer';
// import { setStatusMission } from '@src/redux/reducers/statusMissionReducer';
import { RootStateType } from '@src/redux/Store';
import { useDispatch, useSelector } from 'react-redux';
import useHttpRequest from '@src/hooks/useHttpRequest';
import { IWalletBalanceResultModel } from '@src/models/output/orderDetail/IWalletBalanceResultModel';

export const useNotification = () => {
  const dispatch = useDispatch();
  const httpRequest = useHttpRequest();
  const auth = useSelector((state: RootStateType) => state.authentication.isAuthenticate);
  const userData = useSelector((state: RootStateType) => state.authentication.userData);

  const checkRole = (normalizedName: string) => {
    return userData?.roles ? userData?.roles.some((roleName) => roleName.normalizedName === normalizedName) : false;
  };

  const getCountMessage = () => {
    auth
      ? httpRequest
          .getRequest<IOutputResult<ICountResultModel>>(`${APIURL_GET_MESSAGE_COUNT}?UserId=${userData?.userId}`)
          .then((result) => {
            dispatch(handleNewMessageCount(result.data.data.count));
          })
      : dispatch(handleNewMessageCount(0));
  };
  const getCountBlogMessage = () => {
    auth
      ? httpRequest.getRequest<IOutputResult<ICountResultModel>>(`${APIURL_GET_COUNT_SYSTEM_MESSAGE}`).then((result) => {
          dispatch(handleNewMessageBlogCount(result.data.data.count));
        })
      : dispatch(handleNewMessageBlogCount(0));
  };
  const getStatusMissionCount = () => {
    auth && checkRole('TECHNICIAN')
      ? httpRequest.getRequest<IOutputResult<IStatusMissionCountResultModel[]>>(`${APIURL_GET_STATUS_MISSION}`).then((result) => {
          dispatch(handleStatusMission(result.data.data));
        })
      : dispatch(
          handleStatusMission([
            { status: 'Open', count: 0 },
            { status: 'Assigned', count: 0 },
            { status: 'CancelAwaiting', count: 0 },
            { status: 'Close', count: 0 },
            { status: 'Cancel', count: 0 },
            { status: 'Pending', count: 0 },
            { status: 'InvoiceIssuance', count: 0 },
          ])
        );
  };
  const getWalletBalance = () => {
    auth
      ? httpRequest.getRequest<IOutputResult<IWalletBalanceResultModel>>(`${API_URL_GET_WALLET_BALANCE}`).then((result) => {
          dispatch(handleWalletBalance(result.data.data.balance));
        })
      : dispatch(handleWalletBalance(0));
  };
  return { getCountBlogMessage, getCountMessage, getStatusMissionCount, getWalletBalance };
};
