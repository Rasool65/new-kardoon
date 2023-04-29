import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { useSelector, useDispatch } from 'react-redux';
import { RootStateType } from '@src/redux/Store';
import { useToast } from '@src/hooks/useToast';
import { API_BASE_URL, API_SIGNALR_URL } from '@src/configs/apiConfig/apiBaseUrl';
import { APIURL_LISTENING_CHAT } from '@src/configs/apiConfig/apiUrls';
import { useEffect, useState } from 'react';
import { handleNewMessage } from './../../redux/reducers/messageReducer';
import { IMessage } from '@src/models/output/categoryConversation/IChatConversation';

export const SignalR = () => {
  const dispatch = useDispatch();
  const [connection, setConnection] = useState<HubConnection>();
  const userData = useSelector((state: RootStateType) => state.authentication.userData);
  const show = useSelector((state: RootStateType) => state.message.showMessage);
  const toast = useToast();

  useEffect(() => {
    connection && connection.stop();
    const newConnection = new HubConnectionBuilder()
      .withUrl(`${API_SIGNALR_URL}${APIURL_LISTENING_CHAT}?UserId=${userData?.userId}`, { withCredentials: true })
      .withAutomaticReconnect()
      .build();
    setConnection(newConnection);
  }, [userData?.userId]);

  useEffect(() => {
    if (connection && userData?.userId) {
      connection
        .start()
        .then((result) => {
          console.log('SignalR Connected!');
          connection.on('receiveChat', (data: IMessage) => {
            var options = {
              body: data.message,
              icon: 'favicon.ico',
              // image: '/assets/images/profile-defult-img.png',
              vibrate: [100, 50, 200],
            };
            show && toast.showNotify(data.message);
            dispatch(handleNewMessage(data));

            navigator.serviceWorker.ready.then((result) => {
              if ('showNotification' in result) {
                show && result.showNotification(`${data.fromFirstName} ${data.fromLastName}:${data.message}`, options);
              } else {
                show && new Notification(`${data.fromFirstName} ${data.fromLastName}:${data.message}`, options);
              }
            });
          });
        })
        .catch((e) => console.log('Connection failed: ', e));
    }
  }, [connection]);
  return <></>;
};
