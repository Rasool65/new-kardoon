import { FunctionComponent, useEffect, useState, useLayoutEffect, useRef } from 'react';
import { IPageProps } from '@src/configs/routerConfig/IPageProps';
import { useParams } from 'react-router-dom';
import { RootStateType } from '@src/redux/Store';
import { useDispatch, useSelector } from 'react-redux';
import useHttpRequest, { RequestDataType } from '@src/hooks/useHttpRequest';
import { IOutputResult } from '@src/models/output/IOutputResult';
import {
  APIURL_GET_CHAT_CONVERSATION,
  APIURL_POST_NEW_MESSAGE,
  APIURL_PUT_SEEN_ALL_BY_CATEGORY,
} from '@src/configs/apiConfig/apiUrls';
import { IChatConversation, IMessage } from '@src/models/output/categoryConversation/IChatConversation';
import { useToast } from '@src/hooks/useToast';
import { DateHelper } from '@src/utils/dateHelper';
import { Input, Spinner } from 'reactstrap';
import { handleNewMessageCount, handleShowMessage } from '@src/redux/reducers/messageReducer';
import { useRecorder } from '@src/hooks/useRecorder';
import PrevHeader from '@src/layout/Headers/PrevHeader';
import { resizeFile } from '@src/utils/ImageHelpers';
import ShowImageModal from '@src/components/showImageModal/ShowImageModal';

const Chat: FunctionComponent<IPageProps> = () => {
  const color = useSelector((state: RootStateType) => state.theme.color);
  let { audioData, audioURL, isRecording, startRecording, stopRecording } = useRecorder();
  let { id } = useParams();
  const toast = useToast();
  const dispatch = useDispatch();
  const newMessage = useSelector((state: RootStateType) => state.message.newMessage);
  const userData = useSelector((state: RootStateType) => state.authentication.userData);
  const httpRequest = useHttpRequest();
  const httpRequestFormData = useHttpRequest(RequestDataType.formData);
  const [loading, setLoading] = useState<boolean>(false);
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const [messageList, setMessageList] = useState<IMessage[]>([]);
  const [message, setMessage] = useState<string>();
  const [toId, setToId] = useState<number>(0);
  const [displayReplay, setDisplayReplay] = useState<string>('none');
  const [displayMedia, setDisplayMedia] = useState<string>('none');
  const [replayTo, setReplayTo] = useState<number>();
  const [replayMessage, setReplayMessage] = useState<string>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [recordPerPage] = useState<number>(50);
  const [totalPage, setTotalPage] = useState<number>();
  const [scroll, setScroll] = useState<boolean>(true);
  const [imageFile, setImageFile] = useState<any>();
  const [imgSrc, setImgSrc] = useState<any>();
  const [videoFile, setVideoFile] = useState<any>();
  const [file, setFile] = useState<any>();
  const [audioFile, setAudioFile] = useState<any>();
  const [iconDisplay, setIconDisplay] = useState<boolean>(false);
  const [displayImage, setDisplayImage] = useState<boolean>(false);
  const [imageSrc, setImageSrc] = useState<string>();

  const handleDisplay = () => {
    setDisplayImage(!displayImage);
  };
  const getMessages = (currentPage: number) => {
    setLoading(true);
    httpRequest
      .getRequest<IOutputResult<IChatConversation<IMessage[]>>>(
        `${APIURL_GET_CHAT_CONVERSATION}?TechnicianId=${userData?.userId}&MessageCategory=${id}&PageNumber=${currentPage}&RecordsPerPage=${recordPerPage}`
      )
      .then((result) => {
        setTotalPage(Math.ceil(result.data.data.paging.totalItems! / recordPerPage));
        currentPage > 1
          ? setMessageList(result.data.data.messages.concat(messageList))
          : setMessageList(result.data.data.messages);
        setLoading(false);
        const Array = result.data.data.messages.filter((messages) => messages.from != userData?.userId);
        setToId(Array.at(-1)?.from!);
      })
      .catch((result) => {
        toast.showError(result);
        setLoading(false);
      });
  };

  const seenAllMessageByCategory = () => {
    const body = {
      userId: userData?.userId,
      category: Number(id),
    };
    setLoading(true);
    httpRequest
      .updateRequest<IOutputResult<any>>(APIURL_PUT_SEEN_ALL_BY_CATEGORY, body)
      .then((result) => {
        dispatch(handleNewMessageCount(0));
        setLoading(false);
      })
      .catch((result) => {
        toast.showError(result);
      });
  };

  const scrollDown = () => {
    var objDiv = document.getElementById('chatList');
    objDiv!.scrollTop = objDiv!.scrollHeight;
  };

  const handleSearch = (value: string) => {
    let findData = messageList.filter((el: IMessage) => el.message.match(value));
    value ? setMessageList(findData) : getMessages(1);
  };

  const sendMessage = (link?: string) => {
    if (!toId) return toast.showError('شروع مکالمه میبایست ابتدا از سمت پشتیبانی باشد');
    setScroll(true);
    setBtnLoading(true);
    var formData = new FormData();
    formData.append('from', userData?.userId.toString()!);
    formData.append('to', toId?.toString());
    if (message) formData.append('message', message);
    if (replayTo) formData.append('replyTo', replayTo.toString());
    formData.append('messageCategory', id!);
    if (videoFile) formData.append('attachFile', videoFile), formData.append('attachFileType', '0');
    if (audioFile) formData.append('attachFile', audioFile), formData.append('attachFileType', '1');
    if (imageFile) formData.append('attachFile', imageFile), formData.append('attachFileType', '2');
    if (file) formData.append('attachFile', file), formData.append('attachFileType', '3');

    httpRequestFormData
      .postRequest<IOutputResult<IMessage>>(APIURL_POST_NEW_MESSAGE, formData)
      .then((result) => {
        setDisplayReplay('none');
        setDisplayMedia('none');
        setReplayMessage('');
        messageList.push(result.data.data);
        setMessage('');
        setBtnLoading(false);
      })
      .catch((result) => {
        setBtnLoading(false);
        toast.showError(result);
      });
  };
  const onImageFileChange = async (e: any) => {
    ClearReplay();
    setDisplayMedia('flex');
    const files = e.target.files;
    await resizeFile(files[0]).then((result: any) => {
      setImageFile(result);
    });
    const reader = new FileReader();
    reader.onload = function () {
      setImgSrc(reader.result);
    };
    reader.readAsDataURL(files[0]);
  };

  const onVideoFileChange = (e: any) => {
    ClearReplay();
    setDisplayMedia('flex');
    let file = e.target.files[0];
    setVideoFile(file);
    let blobURL = URL.createObjectURL(file);
    document.querySelector('video')!.src = blobURL;
  };

  const onDocumnetFileChange = (e: any) => {
    ClearReplay();
    setDisplayMedia('flex');
    let file = e.target.files[0];
    setFile(file);
  };

  const ClearReplay = () => {
    setIconDisplay(false);
    setDisplayReplay('none');
    setDisplayMedia('none');
    setReplayTo(undefined);
    setReplayMessage(undefined);
    setImgSrc(undefined);
    setImageFile(undefined);
    setVideoFile(undefined);
    setFile(undefined);
    setAudioFile(undefined);
  };

  useEffect(() => {
    getMessages(1);
    seenAllMessageByCategory();
  }, []);

  useEffect(() => {
    dispatch(handleShowMessage(false));
    newMessage && (setMessageList([...messageList, newMessage]), setToId(newMessage.from), setReplayTo(undefined));
  }, [newMessage]);

  useEffect(() => {
    scroll && scrollDown();
    setReplayTo(undefined);
  }, [messageList.length]);

  useEffect(() => {
    setAudioFile(audioData);
  }, [audioData]);
  return (
    <>
      <div className="message-page">
        <PrevHeader />
        <div className="container position-relative">
          <div id="footer-bar" className="message-input-bar d-flex"></div>
          <div className="page-content">
            <div className="">
              <div className="search-card mb-3">
                <div className="search-box">
                  <div className="saerch-icon">
                    <img
                      src={require(`@src/scss/images/icons/${color}-search3449-7ho.svg`)}
                      alt="search3449"
                      className="home-search2"
                    />
                  </div>
                  <input type="text" onChange={(e: any) => handleSearch(e)} className="search-input" placeholder="جستجو " />
                </div>
              </div>
              <div className="card after-search h-100">
                <div
                  onScroll={(e: any) => {
                    e.target.scrollTop == 0 &&
                      totalPage! > pageNumber &&
                      (getMessages(pageNumber + 1), setPageNumber(pageNumber + 1), setScroll(false));
                  }}
                  className="content mt-5 pt-3"
                  id="chatList"
                  style={{
                    overscrollBehavior: 'contain',
                    overflowY: 'auto',
                  }}
                >
                  {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '120px' }}>
                      <Spinner style={{ width: '5rem', height: '5rem' }} />
                    </div>
                  ) : (
                    messageList &&
                    messageList?.length > 0 &&
                    messageList?.map((message: IMessage, index: number) => {
                      return (
                        <>
                          <div
                            id={message.id.toString()}
                            className={`speech-bubble ${
                              message.from == userData?.userId ? `speech-right bg-highlight` : 'speech-left color-black'
                            }`}
                          >
                            <div
                              className="message-profile"
                              style={{
                                backgroundImage: `url(${
                                  userData?.profile?.profileImageUrl
                                    ? userData?.profile?.profileImageUrl
                                    : require('@src/scss/images/profile-defult-img.png')
                                }`,
                              }}
                            ></div>
                            {message.replyToId && (
                              <>
                                <a className="btn font-12 w-100 text-right" href={`#${message.replyToId}`}>
                                  {message.replyTo.message}
                                </a>
                                <hr />
                              </>
                            )}
                            {/* if image */}
                            {message.chatFile?.fileType == 'Image' && (
                              <div
                                className="image-chat pointer"
                                onClick={() => {
                                  setImageSrc(message.chatFile?.fileUrl), setDisplayImage(true);
                                }}
                                style={{ backgroundImage: `url(${message.chatFile.fileUrl})` }}
                              />
                            )}
                            {/* if video */}
                            {message.chatFile?.fileType == 'Video' && <video controls src={message.chatFile?.fileUrl} />}
                            {/* if voice */}
                            {message.chatFile?.fileType == 'Audio' && <audio src={message.chatFile?.fileUrl} controls />}
                            {/* if file */}
                            {message.chatFile?.fileType && !['Audio', 'Video', 'Image'].includes(message.chatFile?.fileType!) && (
                              <img
                                className="pointer"
                                onClick={() => {
                                  window.open(message.chatFile?.fileUrl, '_self');
                                }}
                                style={{ minHeight: '35px', maxHeight: '35px' }}
                                src={require(`@src/scss/images/icons/attachment2.svg`)}
                              />
                            )}
                            {message.from == userData?.userId
                              ? `${message.message}`
                              : `${message.fromLastName ? message.fromLastName + ':' : ''}${message.message}`}
                            <div className="pointer message-time">
                              <div className="message-time-detail">
                                <em className="speech-read"> {DateHelper.isoDateTopersian(message.createDateTime)}</em>
                                <em className="speech-read"> {DateHelper.splitTime(message.createDateTime)}</em>
                              </div>
                              <div className="d-flex justify-content-between replay-btn">
                                {message.seen && (
                                  <em className="ml-2">
                                    <svg
                                      className="read-message"
                                      width="24px"
                                      height="24px"
                                      viewBox="0 0 24 24"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path d="M9.172 18.657a1 1 0 0 1-.707-.293l-5.657-5.657a1 1 0 0 1 1.414-1.414l4.95 4.95L19.778 5.636a1 1 0 0 1 1.414 1.414L9.879 18.364a1 1 0 0 1-.707.293z" />
                                    </svg>
                                  </em>
                                )}
                                <div>
                                  <em
                                    className="float-end"
                                    onClick={() => {
                                      setDisplayReplay('flex');
                                      setReplayTo(message.id);
                                      message.from != userData?.userId && setToId(message.from);
                                      setReplayMessage(message.message);
                                    }}
                                  >
                                    <svg
                                      className="reply-icon"
                                      width="20px"
                                      height="20px"
                                      viewBox="0 0 20 20"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path d="M19 16.685S16.775 6.953 8 6.953V2.969L1 9.542l7 6.69v-4.357c4.763-.001 8.516.421 11 4.81z" />
                                    </svg>
                                  </em>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className=""></div>
                        </>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
            <div
              className="replay-message"
              onClick={() => {
                ClearReplay();
              }}
              style={{
                display: `${displayMedia}`,
              }}
            >
              <svg className="close-message" width="24px" height="24px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <g data-name="Layer 2">
                  <g data-name="close">
                    <rect width="24" height="24" transform="rotate(180 12 12)" opacity="0" />
                    <path d="M13.41 12l4.3-4.29a1 1 0 1 0-1.42-1.42L12 10.59l-4.29-4.3a1 1 0 0 0-1.42 1.42l4.3 4.29-4.3 4.29a1 1 0 0 0 0 1.42 1 1 0 0 0 1.42 0l4.29-4.3 4.29 4.3a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42z" />
                  </g>
                </g>
              </svg>

              {imgSrc && <div className="send-image-message" style={{ backgroundImage: `url(${imgSrc})` }} />}
              <video style={{ display: `${videoFile ? 'flex' : 'none'}` }} id="video" width="200" height="150" controls>
                مرور گر شما از ویدیو پشتیبانی نمیکند
              </video>
              {file && (
                <p style={{ marginTop: `-4px` }}>
                  <img src={require(`@src/scss/images/icons/${color}-checked.svg`)} className="checked-attach" alt="" />
                  فایل ضمیمه شد.
                </p>
              )}

              {audioFile && (
                <audio
                  style={{
                    width: '-webkit-fill-available',
                  }}
                  hidden={isRecording}
                  src={audioURL}
                  controls
                />
              )}
            </div>
            <div
              className="replay-message"
              onClick={() => {
                ClearReplay();
              }}
              style={{
                display: `${displayReplay}`,
              }}
            >
              <svg className="close-message" width="24px" height="24px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <g data-name="Layer 2">
                  <g data-name="close">
                    <rect width="24" height="24" transform="rotate(180 12 12)" opacity="0" />
                    <path d="M13.41 12l4.3-4.29a1 1 0 1 0-1.42-1.42L12 10.59l-4.29-4.3a1 1 0 0 0-1.42 1.42l4.3 4.29-4.3 4.29a1 1 0 0 0 0 1.42 1 1 0 0 0 1.42 0l4.29-4.3 4.29 4.3a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42z" />
                  </g>
                </g>
              </svg>

              <p className="m-1 p-2 pointer">{replayMessage}</p>
            </div>
            <div className="chat-input-text">
              <div id="footer-bar" className="d-flex p-0">
                <div className="attachment-icons">
                  {/* Voice */}
                  <div className={`chat-media-icon ${iconDisplay && 'show'}`}>
                    <a>
                      <label htmlFor="attachment">
                        <div className="d-flex">
                          <div className="icon-bg">
                            <img
                              className="pointer"
                              src={require(`@src/scss/images/icons/document.svg`)}
                              width="46"
                              height="46"
                              alt=""
                            />
                          </div>
                        </div>
                      </label>
                      <Input
                        onChange={onDocumnetFileChange}
                        id="attachment"
                        style={{ display: 'none' }}
                        type="file"
                        accept="*/*"
                      />
                    </a>

                    <a>
                      <label htmlFor="video-attach">
                        <div className="d-flex">
                          <div className="icon-bg">
                            <img
                              className="pointer"
                              src={require(`@src/scss/images/icons/${color}-video.svg`)}
                              width="46"
                              height="46"
                              alt=""
                            />
                          </div>
                        </div>
                      </label>
                      <Input
                        onChange={onVideoFileChange}
                        style={{ display: 'none' }}
                        id="video-attach"
                        type="file"
                        accept="video/*"
                      />
                    </a>

                    <a>
                      <label className="pointer" htmlFor="img">
                        <div className="icon-bg">
                          <img src={require(`@src/scss/images/icons/${color}-camera.svg`)} />
                        </div>
                        <Input onChange={onImageFileChange} style={{ display: 'none' }} id="img" type="file" accept="image/*" />
                      </label>
                    </a>
                  </div>

                  <a onClick={() => setIconDisplay(!iconDisplay)} className="text-center">
                    <label htmlFor="more">
                      <div className="d-flex">
                        <div className="icon-bg">
                          <img className="pointer attach-icon" src={require(`@src/scss/images/icons/attachment.svg`)} alt="" />
                        </div>
                      </div>
                    </label>
                  </a>

                  <a className="text-center">
                    <img
                      hidden={isRecording}
                      className="pointer"
                      src={require(`@src/scss/images/icons/${color}-voice.svg`)}
                      onClick={() => {
                        startRecording();
                        // setRecordTime(1);
                        // setAudioDisplay('flex');
                      }}
                    />
                    <div
                      className="recording-animate"
                      hidden={!isRecording}
                      onClick={() => {
                        stopRecording();
                        setDisplayMedia('flex');
                        // setRecordTime(0);
                      }}
                    />
                  </a>
                </div>
              </div>

              <div className="send-message-bar">
                <input
                  type="text"
                  className="form-control"
                  value={message}
                  onKeyDown={(e) => (e.code === 'Enter' || e.key === 'Enter' ? sendMessage() : '')}
                  onChange={(e) => {
                    setMessage(e.currentTarget.value);
                  }}
                  placeholder="پیام را وارد نمایید"
                />
                <div className="send-icon" style={{ flex: 'none', paddingTop: 'inherit' }}>
                  <a
                    onClick={() => {
                      sendMessage();
                    }}
                    className="send-message-btn"
                  >
                    {btnLoading ? (
                      <Spinner style={{ color: '#fff', height: '0px', width: '18px', marginTop: '1px', marginRight: '2px' }} />
                    ) : (
                      <svg
                        className="arrow-up"
                        width="24px"
                        height="24px"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 4L12 20M12 4L18 10M12 4L6 10"
                          stroke="#ffffff"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ShowImageModal display={displayImage} src={imageSrc} handleDisplay={handleDisplay} />
    </>
  );
};

export default Chat;
