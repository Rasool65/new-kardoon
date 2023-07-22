import Form, { ISubmitEvent } from '@rjsf/core';
import {
  APIURL_GET_MISSION_ATTRIBUTES_DETAILS,
  APIURL_GET_MISSION_DETAILS,
  APIURL_GET_REQUEST_STATUS_LIST,
  APIURL_GET_TRACKING_LIST,
  APIURL_POST_TECHNICIAN_MEDIA_FILES,
  APIURL_POST_TRACKING,
  APIURL_UPDATE_REQUEST_ATTRIBUTES,
  APIURL_UPDATE_REQUEST_DETAIL_STATUS,
} from '@src/configs/apiConfig/apiUrls';
import useHttpRequest, { RequestDataType } from '@src/hooks/useHttpRequest';
import Footer from '@src/layout/Footer';
import { IOutputResult } from '@src/models/output/IOutputResult';
import { IProblemList } from '@src/models/output/orderDetail/IOrderDetailListResultModel';
import { RootStateType } from '@src/redux/Store';
import { DateHelper } from '@src/utils/dateHelper';
import { UtilsHelper } from '@src/utils/GeneralHelpers';
import { FunctionComponent, useEffect, useState, forwardRef } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Spinner, Input, FormFeedback, Container, Row, Col } from 'reactstrap';
import { IPageProps } from '../../configs/routerConfig/IPageProps';
import { URL_MY_ORDERS, URL_TECHNICIAN_MISSION_DETAIL_ACTION, URL_TECHNICIAN_REQUEST } from '../../configs/urls';
import { IMissionDetailResultModel, IStatusMission } from '@src/models/output/missionDetail/IMissionDetailListResultModel';
import Select from 'react-select';
import { IAttributesResultModel } from '@src/models/output/missionDetail/IAttributesResultModel';
import { useToast } from '@src/hooks/useToast';
import { IFollowUpList } from '@src/models/output/missionDetail/IFollowUpList';
import { useRecorder } from '@src/hooks/useRecorder';
import FollowUpModal from './FollowUpModal';
import SuspendCauseModal from './SuspendCauseModal';
import ProgressCauseModal from './ProgressCauseModal';
import ConfirmModal from './ConfirmModal';
import PrevHeader from '@src/layout/Headers/PrevHeader';
import LoadingComponent from '@src/components/spinner/LoadingComponent';
import { IFiles } from '@src/models/output/missionDetail/IInvoiceActionResultModel';
import ShowImageModal from '../../components/showImageModal/ShowImageModal';
import CallModal from './CallModal';
import { addTextToImage } from '@src/utils/ImageHelpers';
import ImageLabelModal from './ImageLabelModal';

const technicianMissionDetail: FunctionComponent<IPageProps> = (props) => {
  let { audioData, audioURL, isRecording, startRecording, stopRecording } = useRecorder();
  const navigate = useNavigate();
  const color = useSelector((state: RootStateType) => state.theme.color);
  const search = useLocation().search;
  const id = new URLSearchParams(search).get('id');
  const httpRequest = useHttpRequest();
  const httpRequestMedia = useHttpRequest(RequestDataType.formData);
  const [missionDetail, setMissionDetail] = useState<IMissionDetailResultModel>();
  const [genForm, setGenForm] = useState<IAttributesResultModel>();
  const [imageModalVisible, setImageModalVisible] = useState<boolean>(false);
  const [followUpModalVisible, setFollowUpModalVisible] = useState<boolean>(false);
  const [displayCallModal, setDisplayCallModal] = useState<boolean>(false);
  const [suspendReasonModalVisible, setSuspendReasonModalVisible] = useState<boolean>(false);
  const [progressReasonModalVisible, setProgressReasonModalVisible] = useState<boolean>(false);
  const [suspendCauseList, setSuspendCasueList] = useState<number[]>([]);
  const [progressCauseList, setProgressCasueList] = useState<number[]>([]);
  const [selectDisabled, setSelectDisabled] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [requestLoading, setRequestloading] = useState<boolean>(false);
  const [formLoading, setFormLoading] = useState<boolean>(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState<boolean>(false);
  const [showButton, setShowButton] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>();
  const [imageSrc, setImageSrc] = useState<string>();
  const [imageDescription, setImageDescription] = useState<string>();
  const [imageLabel, setImageLabel] = useState<string[]>([]);
  const [displayImage, setDisplayImage] = useState<boolean>(false);
  const [statusValue, setStatusValue] = useState<number>();
  const [displayLabelImage, setDisplayLabelImage] = useState<boolean>(false);
  const [followUpDescription, setFollowUpDescription] = useState<string>();
  const [nextTrackingDateTime, setNextTrackingDateTime] = useState<string>();
  const [followUpList, setFollowUpList] = useState<IFollowUpList[]>();
  const [audioDisplay, setAudioDisplay] = useState<string>('none');
  const [imageDisplay, setImageDisplay] = useState<string>('none');
  const [videoDisplay, setVideoDisplay] = useState<string>('none');
  const [imgSrcList, setImgSrcList] = useState<any[]>([]);
  const [imageFile, setImageFile] = useState<any[]>([]);
  const [audioFile, setAudioFile] = useState<any>();
  const [videoFile, setVideoFile] = useState<any>();
  const [statusList, setStatusList] = useState<IStatusMission[]>();
  const userData = useSelector((state: RootStateType) => state.authentication.userData);
  const toast = useToast();
  const GetMissionDetail = () => {
    setRequestloading(true);
    httpRequest
      .getRequest<IOutputResult<IMissionDetailResultModel>>(
        `${APIURL_GET_MISSION_DETAILS}?TechnicianId=${userData?.userId}&RequestDetailId=${id}`
      )
      .then((result) => {
        setMissionDetail(result.data.data);
        result.data.data.statusId == 3 || result.data.data.statusId == 4 ? setSelectDisabled(true) : setSelectDisabled(false);
        setRequestloading(false);
      });
  };
  const UpdateStatus = (statusValue: number, causeIdList?: number[]) => {
    const body = {
      technicianId: userData?.userId,
      requestDetailId: parseInt(id!),
      status: statusValue,
      causeIdList: causeIdList,
    };
    setLoading(true);
    httpRequest.updateRequest<IOutputResult<any>>(`${APIURL_UPDATE_REQUEST_DETAIL_STATUS}`, body).then((result) => {
      result.data.isSuccess ? toast.showSuccess(result.data.message) : toast.showError(result.data.message);
      setLoading(false);
    });
  };
  const onSubmit = (data: ISubmitEvent<unknown>) => {
    const body = {
      requestDetailId: parseInt(id!),
      technicianId: userData?.userId,
      formGeneratorDetail: JSON.stringify(data.formData),
    };
    setFormLoading(true);
    httpRequest.updateRequest<IOutputResult<any>>(`${APIURL_UPDATE_REQUEST_ATTRIBUTES}`, body).then((result) => {
      FormGenDetail();
      result.data.isSuccess ? toast.showSuccess(result.data.message) : toast.showError(result.data.message);
      setFormLoading(false);
    });
  };
  const handleDisplay = () => {
    setDisplayImage(!displayImage);
  };
  const handleCallModal = () => {
    setDisplayCallModal(!displayCallModal);
  };
  const AddFollowUp = () => {
    setTimeout(() => {
      if (followUpDescription == '') return toast.showError('توضیحات نمی تواند خالی باشد'), setLoading(false);
      const body = {
        technicianId: userData?.userId,
        requestDetailId: parseInt(id!),
        description: followUpDescription,
        nextTrackingDateTime: nextTrackingDateTime,
      };
      setLoading(true);
      httpRequest
        .postRequest<IOutputResult<any>>(`${APIURL_POST_TRACKING}`, body)
        .then((result) => {
          toast.showSuccess(result.data.message);
          setFollowUpModalVisible(false);
          setSuspendReasonModalVisible(false);
          setProgressReasonModalVisible(false);
          setLoading(false);
          GetFollowUp();
        })
        .finally(() => {
          setLoading(false);
        });
    }, 500);
  };

  const submitTechnicianMedia = () => {
    setLoading(true);
    const data = new FormData();
    data.append('technicianId', userData!.userId!.toString());
    data.append('requestDetailId', id!.toString());
    audioFile ? data.append('audioMessage', audioFile) : data.append('audioMessage', '');
    videoFile ? data.append('videoMessage', videoFile) : data.append('videoMessage', '');
    imageFile
      ? imageFile.forEach((imageFile: any, index: number) => {
          data.append(`imageMessage[${index}].image`, imageFile);
          data.append(`imageMessage[${index}].imagedescription`, imageLabel[index]);
        })
      : data.append('imageMessage', '');
    httpRequestMedia
      .postRequest<IOutputResult<any>>(`${APIURL_POST_TECHNICIAN_MEDIA_FILES}`, data)
      .then((result) => {
        toast.showSuccess(result.data.message);
        setLoading(false);
        ClearMediaFiles();
        GetMissionDetail();
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const closeModal = () => {
    setProgressReasonModalVisible(false);
    setSuspendReasonModalVisible(false);
    setFollowUpModalVisible(false);
    setImageModalVisible(false);
    setConfirmModalVisible(false);
  };
  const ClearMediaFiles = () => {
    setAudioFile(null);
    setAudioDisplay('none');
    setImgSrcList([]);
    setImageFile([]);
    setImageLabel([]);
    setImageDescription(undefined);
    setImageDisplay('none');
    setVideoFile(null);
    setVideoDisplay('none');
  };
  const GetFollowUp = () => {
    setLoading(true);
    httpRequest
      .getRequest<IOutputResult<IFollowUpList[]>>(
        `${APIURL_GET_TRACKING_LIST}?TechnicianId=${userData?.userId}&RequestDetailId=${id}`
      )
      .then((result) => {
        setFollowUpList(result.data.data);
        setLoading(false);
      });
  };
  const uiSchema = {
    'ui:readonly': false,
    // 'ui:widget': 'checkboxes',
  };

  const FormGenDetail = () => {
    setLoading(true);
    httpRequest
      .getRequest<IOutputResult<IAttributesResultModel>>(
        `${APIURL_GET_MISSION_ATTRIBUTES_DETAILS}?RequestDetailId=${id}&UserId=${userData?.userId}`
      )
      .then((result) => {
        setGenForm(result.data.data);
        setLoading(false);
      });
  };

  const GetStatusList = () => {
    setLoading(true);
    httpRequest.getRequest<IOutputResult<IStatusMission[]>>(`${APIURL_GET_REQUEST_STATUS_LIST}`).then((result) => {
      setStatusList(result.data.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    GetStatusList();
    GetMissionDetail();
    FormGenDetail();
    GetFollowUp();
  }, []);

  useEffect(() => {
    setAudioFile(audioData);
  }, [audioData]);

  const onImageFileChange = (files: any) => {
    // const newFile: any = await addTextToImage(files[0], 'Rasool Aghajani');
    setImageFile([...imageFile, files]);
    const reader = new FileReader();
    reader.onload = function () {
      setImgSrcList([...imgSrcList, reader.result]);
    };
    reader.readAsDataURL(files);
    setImageDisplay('initial');
  };

  const handleImageLabelModal = () => {
    setDisplayLabelImage(!displayLabelImage);
  };

  const onVideoFileChange = (e: any) => {
    let file = e.target.files[0];
    setVideoFile(file);
    let blobURL = URL.createObjectURL(file);
    document.querySelector('video')!.src = blobURL;
    setVideoDisplay('flex');
  };

  useEffect(() => {
    document.title = props.title;
  }, [props.title]);

  useEffect(() => {
    videoDisplay == 'flex' || audioDisplay == 'initial' || imageDisplay == 'initial' ? setShowButton(true) : setShowButton(false);
  }, [videoDisplay, audioDisplay, imageDisplay]);

  return (
    <>
      <PrevHeader />
      <div className="home-container mission-details">
        <div className="container">
          <div className="card">
            <div className="section-1">
              <div className="details-bar">
                <p>شماره درخواست:</p>
                <p>{missionDetail?.requestNumber}</p>
              </div>
              <div className="details-bar">
                <p>زمان مراجعه:</p>
                <p>
                  {DateHelper.isoDateTopersian(missionDetail?.presenceDateTime)}-{missionDetail?.presenceShift}
                </p>
              </div>
              <div className="details-bar">
                <p>نام مشتری:</p>
                <p>
                  {' '}
                  {missionDetail?.consumerFirstName} {missionDetail?.consumerLastName}
                </p>
              </div>
              <div className="details-bar">
                <p>آدرس:</p>
                <p className="m-1">{missionDetail?.address}</p>
              </div>
            </div>
            <div className="section-2 mt-2">
              <div className="d-flex justify-content-between align-items-center flex-wrap">
                <div style={{ whiteSpace: 'nowrap', marginLeft: '15px' }}>
                  {' '}
                  {missionDetail?.serviceTypeTitle}-{missionDetail?.productTypeTitle}
                </div>
                <div className="w-100">
                  <div className="">
                    {missionDetail?.statusTitle && (
                      <Select
                        isSearchable={false}
                        isDisabled={selectDisabled}
                        isLoading={loading}
                        className="select-city"
                        options={statusList?.filter((x) => x.label !== 'ابطال')}
                        placeholder={missionDetail?.statusTitle}
                        onChange={(e) => {
                          if (e?.value == 2) setSuspendReasonModalVisible(true);
                          else if (e?.value == 5) setProgressReasonModalVisible(true);
                          else setConfirmModalVisible(true), setStatusValue(e?.value!);
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
              {/* Generate Form here */}
              {formLoading ? (
                <LoadingComponent />
              ) : (
                genForm && (
                  <>
                    <Form onSubmit={onSubmit} schema={genForm.attributes} formData={genForm.attributeValues} uiSchema={uiSchema}>
                      <Button className="btn-info" style={{ marginTop: '10px', width: '100%' }} type="submit">
                        بروزرسانی اطلاعات
                      </Button>
                    </Form>
                  </>
                )
              )}
              <div className="mission-gallery">
                {/* File List  */}
                {missionDetail?.files &&
                  missionDetail.files.length > 0 &&
                  missionDetail.files.map((media: IFiles, index: number) => {
                    return (
                      <>
                        {media.fileType == 'Audio' && <audio src={media.fileUrl} controls className="audio-item" />}
                        {media.fileType == 'Image' && (
                          <>
                            <div
                              className="image-item pointer"
                              onClick={() => {
                                setImageSrc(media.fileUrl), setDisplayImage(true), setImageDescription(media.description);
                              }}
                              style={{ backgroundImage: `url(${media.fileUrl})` }}
                            >
                              {media.description}
                            </div>
                          </>
                        )}
                        {media.fileType == 'Video' && (
                          <video
                            className="video-item"
                            width="320"
                            height="240"
                            controls
                            // style={{ display: 'flex', alignContent: 'center' }}
                            src={media?.fileUrl}
                          />
                        )}
                      </>
                    );
                  })}
              </div>

              <div className="" style={{ width: '100%', padding: '10px 0px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly' }}>
                  <div>
                    <p style={{ marginBottom: '0px' }}>ایرادات</p>
                    <ul>
                      {missionDetail?.problemList &&
                        missionDetail?.problemList.length > 0 &&
                        missionDetail.problemList.map((problems: IProblemList, index: number) => {
                          return <li>{problems.label}</li>;
                        })}
                    </ul>
                    {missionDetail?.description && (
                      <div>
                        <p> توضیحات :</p>
                        <div className="description">{missionDetail?.description}</div>
                      </div>
                    )}
                  </div>
                </div>

                {missionDetail?.audioMessage && (
                  <div className="d-flex justify-content-center m-3">
                    <audio src={missionDetail?.audioMessage} controls />
                  </div>
                )}
                <div style={{ display: 'block' }}>
                  {missionDetail?.videoMessage && (
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <video
                        width="320"
                        height="240"
                        controls
                        style={{ display: 'flex', alignContent: 'center' }}
                        src={missionDetail?.videoMessage}
                      />
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'inherit', flexWrap: 'wrap' }}>
                    {missionDetail?.imageMessage &&
                      missionDetail?.imageMessage.length > 0 &&
                      missionDetail?.imageMessage.map((imageAddress: string, index: number) => {
                        return (
                          <img
                            style={{ maxWidth: '85px', cursor: 'pointer' }}
                            className="m-2"
                            onClick={() => {
                              setImageUrl(imageAddress);
                              setImageModalVisible(true);
                            }}
                            src={imageAddress}
                          />
                        );
                      })}
                  </div>
                </div>

                {/* Technician Media list */}
                {/* <div>
                  {missionDetail?.audioMessage && (
                    <div className="d-flex justify-content-center m-3">
                      <audio src={missionDetail?.audioMessage} controls />
                    </div>
                  )}

                  <div style={{ display: 'block' }}>
                    {missionDetail?.videoMessage && (
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <video
                          width="320"
                          height="240"
                          controls
                          style={{ display: 'flex', alignContent: 'center' }}
                          src={missionDetail?.videoMessage}
                        />
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'inherit', flexWrap: 'wrap' }}>
                      {missionDetail?.imageMessage &&
                        missionDetail?.imageMessage.length > 0 &&
                        missionDetail?.imageMessage.map((imageAddress: string, index: number) => {
                          return (
                            <img
                              style={{ maxWidth: '85px', cursor: 'pointer' }}
                              className="m-2"
                              onClick={() => {
                                setImageUrl(imageAddress);
                                setImageModalVisible(true);
                              }}
                              src={imageAddress}
                            />
                          );
                        })}
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
            <div
              style={{
                padding: '20px 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-evenly',
                width: '100%',
                maxWidth: '330px',
                margin: '0 auto',
                flexWrap: 'wrap',
              }}
            >
              {/* Action */}
              <span className="upload-icons">
                {requestLoading ? (
                  <Spinner style={{ height: '1rem', width: '1rem', top: '10px', left: '10px', position: 'absolute' }} />
                ) : (
                  <img
                    className="pointer"
                    src={require(`@src/scss/images/icons/${color}-action.svg`)}
                    onClick={() =>
                      navigate(`${URL_TECHNICIAN_MISSION_DETAIL_ACTION}`, {
                        state: {
                          requestDetailId: missionDetail?.requestDetailId,
                          productCategoryId: missionDetail?.productCategoryId,
                          orderId: missionDetail?.orderId,
                        },
                      })
                    }
                  />
                )}
              </span>
              {/* Call */}
              <span className="upload-icons">
                <img
                  className="pointer"
                  onClick={() => handleCallModal()}
                  src={require(`@src/scss/images/icons/${color}-call2.svg`)}
                  alt="VectorI344"
                />
              </span>
              {/* Images */}
              <span className="upload-icons">
                <label onClick={handleImageLabelModal} htmlFor="img" style={{ cursor: 'pointer' }}>
                  <img className="pointer" src={require(`@src/scss/images/icons/${color}-camera2.svg`)} />
                </label>
                {/* <Input onChange={onImageFileChange} style={{ display: 'none' }} id="img" type="file" accept="image/*" /> */}
              </span>
              {/* Video */}
              <span className="upload-icons">
                <label htmlFor="video" style={{ cursor: 'pointer' }}>
                  <img className="pointer" src={require(`@src/scss/images/icons/${color}-video2.svg`)} />
                </label>
                <Input onChange={onVideoFileChange} style={{ display: 'none' }} id="video" type="file" accept="video/*" />
              </span>
              {/* Voice */}
              <span className="upload-icons" hidden={isRecording}>
                <img
                  className="pointer"
                  src={require(`@src/scss/images/icons/${color}-voice.svg`)}
                  onClick={() => {
                    startRecording();
                    setAudioDisplay('initial');
                  }}
                />
              </span>
              <span className="record-icon upload-icons" hidden={!isRecording}>
                <img
                  className="pointer"
                  src={require(`@src/scss/images/icons/${color}-stop.svg`)}
                  onClick={() => {
                    stopRecording();
                  }}
                />
              </span>
              {/* Message FollowUp */}
              <span className="upload-icons">
                <img
                  className="pointer"
                  src={require(`@src/scss/images/icons/${color}-follow-up.svg`)}
                  onClick={() => {
                    setFollowUpModalVisible(true);
                  }}
                />
              </span>
              {/* Request For Consumer */}
              <span className="upload-icons">
                {requestLoading ? (
                  <Spinner style={{ height: '1rem', width: '1rem', top: '10px', left: '10px', position: 'absolute' }} />
                ) : (
                  <img
                    className="pointer"
                    src={require(`@src/scss/images/icons/${color}-addrequest3.svg`)}
                    onClick={() => {
                      navigate(`${URL_TECHNICIAN_REQUEST}`, {
                        state: {
                          requestDetailId: missionDetail?.requestDetailId,
                          productCategoryId: missionDetail?.productCategoryId,
                          consumerFullName: missionDetail?.consumerFirstName + ' ' + missionDetail?.consumerLastName,
                          consumerAddress: missionDetail?.address,
                          requestNumber: missionDetail?.requestNumber,
                          consumerId: missionDetail?.consumerId,
                        },
                      });
                    }}
                  />
                )}
              </span>
            </div>
            {/* Voice */}
            <div style={{ width: '100%', display: `${audioDisplay}` }}>
              <div className="d-flex m-3 upload-box">
                <div className="d-flex" style={{ width: '80%' }}>
                  {/* {missionDetail?.audioMessage && (
                            <div className="d-flex justify-content-center m-3">
                              <audio src={missionDetail?.audioMessage} controls />
                            </div>
                          )} */}
                  <audio
                    style={{
                      width: '-webkit-fill-available',
                    }}
                    hidden={isRecording}
                    src={audioURL}
                    controls
                  />
                </div>
                <div className="d-flex justify-content-around" style={{ width: '20%' }}>
                  <img
                    hidden={isRecording}
                    src={require(`@src/scss/images/icons/${color}-delete.svg`)}
                    className="delete-icon pointer"
                    onClick={() => {
                      setAudioFile(null);
                      setAudioDisplay('none');
                    }}
                    width="46"
                    height="46"
                    alt=""
                  />
                </div>
              </div>
            </div>
            {/* Images */}
            <div style={{ width: '100%', display: `${imageDisplay}` }}>
              <div className="d-flex m-3 upload-box">
                <div className="d-flex flex-wrap" style={{ width: '80%' }}>
                  {imgSrcList &&
                    imgSrcList.length > 0 &&
                    imgSrcList.map((item: any, index: number) => {
                      return <img className="m-1 pointer" width="75" height="75" src={item} />;
                    })}
                </div>
                <div className="d-flex justify-content-around" style={{ width: '20%' }}>
                  <img
                    className="pointer delete-icon"
                    src={require(`@src/scss/images/icons/${color}-delete.svg`)}
                    onClick={() => {
                      setImgSrcList([]);
                      setImageFile([]);
                      setImageLabel([]);
                      setImageDescription(undefined);
                      setImageDisplay('none');
                    }}
                    width="46"
                    height="46"
                    alt=""
                  />
                </div>
              </div>
            </div>
            {/* Video */}
            <div style={{ width: '100%', display: `${videoDisplay}` }}>
              <div className="d-flex m-3 upload-box">
                <div className="d-flex" style={{ width: '80%' }}>
                  <video id="video" style={{ width: 'inherit', height: 'inherit' }} controls>
                    مرور گر شما از ویدیو پشتیبانی نمیکند
                  </video>
                </div>
                <div className="d-flex justify-content-around" style={{ width: '20%' }}>
                  <img
                    style={{ zIndex: '1' }}
                    src={require(`@src/scss/images/icons/${color}-delete.svg`)}
                    className="delete-icon pointer"
                    onClick={() => {
                      setVideoFile(null);
                      setVideoDisplay('none');
                    }}
                    width="46"
                    height="46"
                    alt=""
                  />
                </div>
              </div>
            </div>
            <div className="m-2">
              <Button
                style={{ width: '100%' }}
                hidden={!showButton}
                onClick={(e) => {
                  submitTechnicianMedia();
                }}
                className="primary-btn m-1"
              >
                {loading ? <Spinner /> : 'آپلود فایل ها'}
              </Button>
            </div>
          </div>
          {followUpList &&
            followUpList.length > 0 &&
            followUpList.map((item: IFollowUpList, index: number) => {
              return (
                <div className="card">
                  <div className="details-bar">
                    <p className="white-space-nowrap">تاریخ و زمان</p>
                    <p className="white-space-nowrap">
                      {' '}
                      {DateHelper.splitTime(item.createDateTime)} - {DateHelper.isoDateTopersian(item.createDateTime)}
                    </p>
                  </div>
                  <div className="mt-4">{item.description}</div>
                </div>
              );
            })}
        </div>
      </div>
      <ShowImageModal display={displayImage} src={imageSrc} handleDisplay={handleDisplay} description={imageDescription} />
      <FollowUpModal
        closeModal={closeModal}
        followUpModalVisible={followUpModalVisible}
        AddFollowUp={AddFollowUp}
        loading={loading}
        onChange={(e: any) => setFollowUpDescription(e.currentTarget.value)}
        nextTrackingDateTime={(date: any) => {
          const selectedDate = date.toDate();
          setNextTrackingDateTime(selectedDate.toISOString());
        }}
      />
      <SuspendCauseModal
        closeModal={closeModal}
        suspendReasonModalVisible={suspendReasonModalVisible}
        missionDetail={missionDetail}
        statusList={statusList}
        onChange={(e: any) => {
          setFollowUpDescription((Array.isArray(e) ? e.map((x) => x.label) : []).toString());
          setSuspendCasueList(Array.isArray(e) ? e.map((x) => x.value) : []);
        }}
        onClick={() => {
          UpdateStatus(2, suspendCauseList), AddFollowUp();
        }}
        loading={loading}
      />

      <ProgressCauseModal
        closeModal={closeModal}
        missionDetail={missionDetail}
        statusList={statusList}
        progressReasonModalVisible={progressReasonModalVisible}
        onChange={(e: any) => {
          setFollowUpDescription((Array.isArray(e) ? e.map((x) => x.label) : []).toString());
          setProgressCasueList(Array.isArray(e) ? e.map((x) => x.value) : []);
        }}
        onClick={() => {
          UpdateStatus(5, progressCauseList);
          AddFollowUp();
        }}
        loading={loading}
      />
      <ConfirmModal
        closeModal={closeModal}
        confirmModalVisible={confirmModalVisible}
        accept={() => {
          setConfirmModalVisible(false), UpdateStatus(statusValue!);
        }}
        reject={() => {
          setConfirmModalVisible(false);
        }}
      />
      <CallModal
        callModalVisible={displayCallModal}
        closeModal={handleCallModal}
        phoneNumbers={[missionDetail?.consumerPhoneNumber, missionDetail?.userName]}
      />
      <ImageLabelModal
        labelModalVisible={displayLabelImage}
        closeModal={() => setDisplayLabelImage(!displayLabelImage)}
        submit={(imgData: any) => {
          onImageFileChange(imgData[0]); //file
          setDisplayLabelImage(!displayLabelImage);
          setImageLabel([...imageLabel, imgData[1]]); //label
        }}
      />
    </>
  );
};

export default technicianMissionDetail;
