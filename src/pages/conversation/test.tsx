// import PrevHeader from '@src/layout/PrevHeader';
// import { FunctionComponent, useEffect, useState, useLayoutEffect, useRef } from 'react';
// import { IPageProps } from '@src/configs/routerConfig/IPageProps';
// import { customFunction } from '../city/template';
// import { useLocation, useParams } from 'react-router-dom';
// import { RootStateType } from '@src/redux/Store';
// import { useSelector } from 'react-redux';
// import useHttpRequest from '@src/hooks/useHttpRequest';
// import { IOutputResult } from '@src/models/output/IOutputResult';
// import { APIURL_GET_CHAT_CONVERSATION, APIURL_POST_NEW_MESSAGE } from '@src/configs/apiConfig/apiUrls';
// import { IChatConversation, IMessage } from '@src/models/output/categoryConversation/IChatConversation';
// import { useToast } from '@src/hooks/useToast';
// import { UtilsHelper } from '@src/utils/GeneralHelpers';
// import { DateHelper } from '@src/utils/dateHelper';
// import InfiniteScroll from 'react-infinite-scroll-component';
// const Chat: FunctionComponent<IPageProps> = () => {
//   // const { state }: any = useLocation();
//   const toast = useToast();
//   const userData = useSelector((state: RootStateType) => state.authentication.userData);
//   const httpRequest = useHttpRequest();
//   const [loading, setLoading] = useState<boolean>(false);
//   const [chatList, setChatList] = useState<IChatConversation<IMessage[]>>();
//   const [messageList, setMessageList] = useState<IMessage[]>([]);
//   const [message, setMessage] = useState<string>();
//   const [displayReplay, setDisplayReplay] = useState<string>('none');
//   const [replayTo, setReplayTo] = useState<number>();
//   const [replayMessage, setReplayMessage] = useState<string>();
//   const [hasMore, setHasMore] = useState<boolean>(false);
//   const [pageNumber, setPageNumber] = useState<number>(1);
//   let { id } = useParams();

//   const getMoreMessages = () => {
//     setLoading(true);
//     httpRequest
//       .getRequest<IOutputResult<IChatConversation<IMessage[]>>>(
//         `${APIURL_GET_CHAT_CONVERSATION}?TechnicianId=${userData?.userId}&MessageCategory=${id}&PageNumber=${pageNumber}&RecordsPerPage=10`
//       )
//       .then((result) => {
//         // result.data.data.messages.reverse();
//         debugger;
//         result.data.data.messages && result.data.data.messages.length > 0
//           ? (setMessageList(result.data.data.messages.concat(messageList)), setHasMore(true))
//           : setHasMore(false);
//         setChatList(result.data.data);
//         setLoading(false);
//       })
//       .catch((result) => {
//         toast.showError(result);
//       });
//   };
//   const getMessages = () => {
//     setLoading(true);
//     httpRequest
//       .getRequest<IOutputResult<IChatConversation<IMessage[]>>>(
//         `${APIURL_GET_CHAT_CONVERSATION}?TechnicianId=${userData?.userId}&MessageCategory=${id}&PageNumber=${pageNumber}&RecordsPerPage=10`
//       )
//       .then((result) => {
//         setMessageList(result.data.data.messages);
//         setLoading(false);
//       })
//       .catch((result) => {
//         toast.showError(result);
//       });
//   };
//   const sendMessage = (link?: string) => {
//     const body = {
//       from: userData?.userId,
//       to: 200,
//       message: message,
//       replyTo: replayTo,
//       messageCategory: id,
//       link: link,
//     };
//     httpRequest
//       .postRequest<IOutputResult<any>>(APIURL_POST_NEW_MESSAGE, body)
//       .then(() => {
//         setMessage('');
//         setDisplayReplay('none');
//         setReplayMessage('');
//         getMessages();
//       })
//       .catch((result) => {
//         toast.showError(result);
//       });
//   };
//   useLayoutEffect(() => {
//     var objDiv = document.getElementById('chatList');
//     objDiv!.scrollTop = objDiv!.scrollHeight;
//   }, [messageList]);

//   useEffect(() => {
//     getMessages();
//     customFunction();
//   }, []);

//   return (
//     <>
//       <div id="page">
//         <PrevHeader />
//         <div
//           className="replay-message"
//           onClick={() => {
//             setDisplayReplay('none');
//             setReplayTo(undefined);
//           }}
//           style={{
//             display: `${displayReplay}`,
//           }}
//         >
//           <i className="fa fa-close p-1 pointer" />
//           <p className="m-1 p-2 pointer">{replayMessage}</p>
//         </div>
//         <div id="footer-bar" className="d-flex">
//           <div className="flex-fill speach-input" style={{ flex: 'none', paddingTop: 'inherit' }}>
//             <input
//               type="text"
//               className="form-control"
//               value={message}
//               onKeyDown={(e) => (e.code === 'Enter' || e.key === 'Enter' ? sendMessage() : '')}
//               onChange={(e) => {
//                 setMessage(e.currentTarget.value);
//               }}
//               placeholder="پیام را وارد نمایید"
//             />
//           </div>
//           <div className="ms-3 speach-icon pointer" style={{ flex: 'none', paddingTop: 'inherit' }}>
//             <a
//               onClick={() => {
//                 sendMessage();
//               }}
//               className="bg-blue-dark me-2"
//             >
//               <i className="fa fa-arrow-up mt-2"></i>
//             </a>
//           </div>
//         </div>
//         <div className="page-content">
//           <div className="page-title page-title-large"></div>
//           <div className="card header-card shape-rounded" data-card-height="170">
//             <div className="card-overlay bg-highlight opacity-95"></div>
//             <div className="card-overlay dark-mode-tint"></div>
//           </div>
//           <div className="card card-style mb-3 mt-n2">
//             <div className="search-box bg-theme rounded-m border-0">
//               <i className="fa fa-search ms-n3"></i>
//               <input type="text" className="border-0" placeholder="جستجو " />
//             </div>
//           </div>

//           <div
//             className="content mt-5 pt-3"
//             id="chatList"
//             style={{
//               overflowY: 'auto',
//               // maxHeight: `${window.innerHeight - 230}px`,
//               maxHeight: '70vh',
//             }}
//           >
//             <InfiniteScroll
//               // style={{ display: 'flex', flexDirection: 'column-reverse' }} //To put endMessage and loader to the top.
//               // inverse={true} //
//               // scrollableTarget="scrollableDiv"
//               dataLength={messageList?.length ? messageList?.length : 1}
//               next={() => {
//                 setPageNumber(pageNumber + 1);
//                 getMoreMessages();
//               }}
//               hasMore={hasMore!}
//               loader={<h4 className="d-flex justify-content-center">درحال بارگذاری...</h4>}
//             >
//               {messageList &&
//                 messageList?.length > 0 &&
//                 messageList?.map((message: IMessage, index: number) => {
//                   return (
//                     <>
//                       <div
//                         id={message.id.toString()}
//                         className={`speech-bubble ${
//                           message.from == userData?.userId ? 'speech-right bg-highlight' : 'speech-left color-black'
//                         }`}
//                       >
//                         {message.replyToId && (
//                           <>
//                             <a className="btn font-12 w-100" href={`#${message.replyToId}`}>
//                               {message.replyTo.message}
//                             </a>
//                             <hr />
//                           </>
//                         )}
//                         {message.message}
//                         <div
//                           className="pointer"
//                           onClick={() => {
//                             setDisplayReplay('flex');
//                             setReplayTo(message.id);
//                             setReplayMessage(message.message);
//                           }}
//                         >
//                           <div>
//                             <em className="speech-read mb-n3 m-1"> {DateHelper.isoDateTopersian(message.createDateTime)}</em>
//                             <em className="speech-read mb-n3 m-1"> {DateHelper.splitTime(message.createDateTime)}</em>
//                           </div>
//                           <div className="justify-content-between">
//                             {!message.seen && (
//                               <em className="speech-read mb-n3 m-1">
//                                 <i className="fa fa-check" />
//                               </em>
//                             )}
//                             <div>
//                               <em className="speech-read mb-n3 float-end">
//                                 <i className="fa fa-share pointer font-14" />
//                               </em>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                       <div className="clearfix"></div>
//                     </>
//                   );
//                 })}
//             </InfiniteScroll>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Chat;
