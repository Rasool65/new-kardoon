import { FunctionComponent, useEffect, useState } from 'react';
import Select from 'react-select';
import { Col, Form, FormFeedback, Input, Row, Button, Label, Spinner } from 'reactstrap';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootStateType } from '@src/redux/Store';
import { Controller, useForm } from 'react-hook-form';
import { IRequestDetailPageProp } from './IRequestDetailProp';
import { yupResolver } from '@hookform/resolvers/yup';
import { IRequestDetail, RequestDetailModelSchema } from '@src/models/input/requestDetail/IRequestDetail';
import { useRecorder } from '@src/hooks/useRecorder';
import useHttpRequest from '@src/hooks/useHttpRequest';
import { IOutputResult } from '@src/models/output/IOutputResult';
import { IProductProblemsResultModel } from '@src/models/output/requestDetail/IProductProblemsResultModel';
import { APIURL_GET_PROBLEM_LIST } from '@src/configs/apiConfig/apiUrls';
import PrevHeader from '@src/layout/Headers/PrevHeader';
import { resizeFile } from '@src/utils/ImageHelpers';

const RequestDetailFirst: FunctionComponent<IRequestDetailPageProp> = ({ handleClickNextToSecond, handleClickMore }) => {
  let { audioData, audioURL, isRecording, startRecording, stopRecording } = useRecorder();
  const color = useSelector((state: RootStateType) => state.theme.color);
  const { t }: any = useTranslation();
  const { state }: any = useLocation();
  const httpRequest = useHttpRequest();
  const [audioDisplay, setAudioDisplay] = useState<string>('none');
  const [imageDisplay, setImageDisplay] = useState<string>('none');
  const [videoDisplay, setVideoDisplay] = useState<string>('none');
  const [imgSrcList, setImgSrcList] = useState<any[]>([]);
  const [imageFile, setImageFile] = useState<any[]>([]);
  const [problemsList, setProblemsList] = useState<any>();
  const [audioFile, setAudioFile] = useState<any>();
  const [videoFile, setVideoFile] = useState<any>();
  const [more, setMore] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [recordTime, setRecordTime] = useState<number>(0);

  const {
    register,
    control,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm<IRequestDetail>({ mode: 'onChange', resolver: yupResolver(RequestDetailModelSchema) });

  const onSubmit = (data: IRequestDetail) => {
    const body: IRequestDetail = {
      serviceTypeId: state.ServiceTypeId,
      productCategoryId: state.ProductId,
      requestDescription: data.requestDescription,
      problemList: data.problemList,
      audioMessage: audioFile,
      imageMessage: imageFile,
      videoMessage: videoFile,
    };
    more ? handleClickMore(body) : handleClickNextToSecond(body);
  };
  const GetProblems = () => {
    setLoading(true);
    httpRequest
      .getRequest<IOutputResult<IProductProblemsResultModel[]>>(
        `${APIURL_GET_PROBLEM_LIST}?productCategoryId=${state.ProductId}&ServiceTypeId=${state.ServiceTypeId}`
      )
      .then((result) => {
        setProblemsList(result.data.data);
        setLoading(false);
      });
  };

  useEffect(() => {
    GetProblems();
  }, []);

  useEffect(() => {
    setAudioFile(audioData);
  }, [audioData]);

  const onImageFileChange = async (e: any) => {
    const files = e.target.files;
    // files.length > 1 ? setImageFile(files) : setImageFile([...imageFile, files[0]]);
    await resizeFile(files[0]).then((result: any) => {
      setImageFile([...imageFile, result]);
    });

    const reader = new FileReader();
    reader.onload = function () {
      setImgSrcList([...imgSrcList, reader.result]);
    };
    reader.readAsDataURL(files[0]);
    setImageDisplay('flex');
  };

  const onVideoFileChange = (e: any) => {
    let file = e.target.files[0];
    setVideoFile(file);
    let blobURL = URL.createObjectURL(file);
    document.querySelector('video')!.src = blobURL;
    setVideoDisplay('flex');
  };

  useEffect(() => {
    recordTime != 0 &&
      isRecording &&
      setTimeout(() => {
        setRecordTime(recordTime + 1);
      }, 1000);
  }, [recordTime]);
  return (
    <div>
      <PrevHeader />
      <div className="page-content request-details-1">
        <div className="container">
          <div className="page-title pointer mt-3 mb-3">جزئیات سفارش</div>

          <div className="">
            <div className="">
              <>
                <Form onSubmit={handleSubmit(onSubmit)}>
                  {' '}
                  <div className="">
                    <div className="card mb-2">
                      لطفا جزئیات سفارش خود را مشخص کنید.
                      <Controller
                        name="problemList"
                        control={control}
                        render={({ field }) => (
                          <>
                            {problemsList && problemsList.length > 0 && (
                              <Select
                                isMulti
                                noOptionsMessage={() => t('ListIsEmpty')}
                                isClearable
                                className=""
                                placeholder={t('SelectProblems')}
                                options={problemsList}
                                isSearchable={true}
                                {...field}
                              />
                            )}
                          </>
                        )}
                      />
                      <Controller
                        name="requestDescription"
                        control={control}
                        render={({ field }: any) => (
                          <>
                            <Input
                              className="mt-2"
                              type="textarea"
                              placeholder={t('EnterRequestDescription')}
                              autoComplete="off"
                              invalid={errors.requestDescription && true}
                              {...field}
                            />
                            <FormFeedback>{errors.requestDescription?.message}</FormFeedback>
                          </>
                        )}
                      />
                    </div>

                    <div className="upload-section">
                      <div className="card mb-2 p-2 px-3">
                        <Row>
                          <Col xs={12} style={{ textAlign: 'right', padding: '0 12px 0 2px' }}>
                            در صورت تمایل می توانید درخواست خود را در قالب یک پیام صوتی حداکثر دو دقیقه ای ارسال کنید.
                          </Col>

                          <Col xs={12}>
                            <div className="d-flex">
                              <div hidden={isRecording} className="icon-bg">
                                <img
                                  className="pointer"
                                  src={require(`@src/scss/images/icons/${color}-voice.svg`)}
                                  onClick={() => {
                                    startRecording();
                                    setRecordTime(1);
                                    setAudioDisplay('flex');
                                  }}
                                  width="46"
                                  height="46"
                                  alt=""
                                />
                              </div>
                              <div>
                                <img
                                  hidden={!isRecording}
                                  className="pointer stop-recording"
                                  src={require(`@src/scss/images/icons/red-stop.svg`)}
                                  onClick={() => {
                                    stopRecording();
                                    setRecordTime(0);
                                  }}
                                  width="46"
                                  height="46"
                                  alt=""
                                />
                              </div>
                              <p>ضبط صدا</p>
                            </div>
                            {
                              <div className="recording-box" hidden={!isRecording}>
                                <div className="d-flex">
                                  <div hidden={!isRecording} className="recording"></div>
                                  <span hidden={!isRecording}>در حال ضبط</span>
                                  <div>
                                    <span className="time-count"> {recordTime}</span> ثانیه
                                  </div>
                                </div>
                                <div className="record-line" hidden={!isRecording}>
                                  <span></span>
                                </div>
                              </div>
                            }
                          </Col>
                        </Row>
                        <div
                          style={{
                            display: `${audioDisplay}`,
                          }}
                          className="align-items-center"
                        >
                          <div className="w-100">
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

                      <div className="card mb-2 p-2 px-3">
                        <Row>
                          <Col xs={12}>با افزودن عکس، متخصصان ما می توانند بهتر شما را راهنمایی کنند.</Col>
                          <Col xs={12}>
                            <label htmlFor="img">
                              <div className="d-flex">
                                <div className="icon-bg">
                                  <img
                                    className="pointer"
                                    src={require(`@src/scss/images/icons/${color}-camera.svg`)}
                                    width="46"
                                    height="46"
                                    alt=""
                                  />
                                </div>
                                <p>آپلود عکس</p>
                              </div>
                            </label>
                            <Input
                              onChange={onImageFileChange}
                              style={{ display: 'none' }}
                              id="img"
                              type="file"
                              accept="image/*"
                            />
                          </Col>
                        </Row>
                        <div
                          style={{
                            display: `${imageDisplay}`,
                          }}
                          className="image-box"
                        >
                          <div className="image-gallery">
                            {imgSrcList &&
                              imgSrcList.length > 0 &&
                              imgSrcList.map((item: any, index: number) => {
                                return (
                                  <div className="imagebox" style={{ backgroundImage: `url(${item})` }}>
                                    <label htmlFor="" className="upload-btn">
                                      <a className="upload-btn"></a>
                                    </label>
                                    <a>
                                      {/* remove from array */}
                                      <img
                                        src={require(`@src/scss/images/icons/delete.svg`)}
                                        onClick={(e) => {
                                          setImgSrcList([...imgSrcList.slice(0, index), ...imgSrcList.slice(index + 1)]);
                                          setImageFile([...imageFile.slice(0, index), ...imageFile.slice(index + 1)]);
                                        }}
                                      />
                                    </a>
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      </div>

                      <div className="card mb-2 p-2 px-3">
                        <Row>
                          <Col xs={12}>با افزودن ویدئو، متخصصان ما می توانند بهتر شما را راهنمایی کنند.</Col>
                          <Col xs={12}>
                            <label htmlFor="video">
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
                                <p>آپلود ویدیو</p>
                              </div>
                            </label>
                            <Input
                              onChange={onVideoFileChange}
                              style={{ display: 'none' }}
                              id="video"
                              type="file"
                              accept="video/*"
                            />
                          </Col>
                        </Row>
                        <Row
                          style={{
                            display: `${videoDisplay}`,
                            alignItems: 'center',
                            textAlign: 'center',
                            padding: '0 0 0 0',
                            marginBottom: '0',
                          }}
                          className="align-items-center"
                        >
                          <Col xs={10}>
                            <video id="video" width="200" height="240" controls>
                              مرور گر شما از ویدیو پشتیبانی نمیکند
                            </video>
                          </Col>
                          <Col xs={2}>
                            <img
                              className="delete-btn"
                              style={{ zIndex: '1', cursor: 'pointer' }}
                              src={require(`@src/scss/images/icons/${color}-delete.svg`)}
                              onClick={() => {
                                setVideoFile(null);
                                setVideoDisplay('none');
                              }}
                              width="46"
                              height="46"
                              alt=""
                            />
                          </Col>
                        </Row>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex">
                    <Button
                      type="submit"
                      onClick={() => {
                        setMore(false);
                      }}
                      className="btn btn-info btn btn-secondary m-1"
                    >
                      ادامه
                    </Button>
                    <Button
                      type="submit"
                      onClick={(e) => {
                        setMore(true);
                      }}
                      className="btn outline-btn m-1"
                    >
                      ثبت سفارش دیگر{' '}
                    </Button>
                  </div>
                </Form>
              </>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestDetailFirst;
