import { IFiles } from '@src/models/output/missionDetail/IInvoiceActionResultModel';
import { RootStateType } from '@src/redux/Store';
import { FunctionComponent, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { IRequestDetailInfo } from '../../models/output/orderDetail/IOrderDetailListResultModel';
import { ITechnicians } from '@src/models/output/orderDetail/IOrderDetailListResultModel';
import ShowImageModal from '../../components/showImageModal/ShowImageModal';
import Form from '@rjsf/core';
import { IProblemList } from '@src/models/output/missionDetail/IMissionDetailListResultModel';
import LoadingComponent from '@src/components/spinner/LoadingComponent';

interface RequestDetailInfoProps {
  requestDetailInfo: IRequestDetailInfo;
  getOrder: any;
  loading: boolean;
}

const RequestDetailInfo: FunctionComponent<RequestDetailInfoProps> = ({ requestDetailInfo, getOrder, loading }) => {
  const color = useSelector((state: RootStateType) => state.theme.color);
  const [displayImage, setDisplayImage] = useState<boolean>(false);
  const [imageSrc, setImageSrc] = useState<string>();

  const handleDisplay = () => {
    setDisplayImage(!displayImage);
  };

  const uiSchema = {
    'ui:readonly': true,
    // 'ui:widget': 'checkboxes',
  };

  const checkMedia = (fileType: string) => {
    return requestDetailInfo?.files ? requestDetailInfo?.files?.some((x) => x.fileType == fileType) : false;
  };

  return (
    <>
      {loading ? (
        <div className="mt-200">
          <LoadingComponent />
        </div>
      ) : (
        <div className="container order-details mb-5">
          <div className="p-4 mx-8 page-tabs-body">
            <div className="row">
              <div className="col-12">
                <div className="order-status">
                  <div className="title">وضعیت رسید</div>
                  <span>{requestDetailInfo?.statusTitle}</span>
                </div>
              </div>
              {requestDetailInfo?.attributes && (
                <div className="col-12 mt-4">
                  <Form
                    children={true}
                    schema={requestDetailInfo.attributes.attributes}
                    formData={requestDetailInfo.attributes.attributeValues}
                    uiSchema={uiSchema}
                  />
                </div>
              )}
              {requestDetailInfo?.problemList && (
                <div className="col-12">
                  <div className="title mt-4">علت درخواست</div>

                  <ul>
                    {requestDetailInfo?.problemList &&
                      requestDetailInfo?.problemList.length > 0 &&
                      requestDetailInfo?.problemList.map((problems: IProblemList, index: number) => {
                        return <li>{problems.label}</li>;
                      })}
                  </ul>
                </div>
              )}

              {checkMedia('Image') && (
                <div className="col-12">
                  <div className="title mt-4">تصاویر</div>
                  <div className="gallery-box">
                    {requestDetailInfo?.files &&
                      requestDetailInfo?.files.length > 0 &&
                      requestDetailInfo?.files.map((media: IFiles, index: number) => {
                        return (
                          <>
                            {media.fileType == 'Image' && (
                              <div
                                className="gallery-image pointer"
                                onClick={() => {
                                  setImageSrc(media.fileUrl), setDisplayImage(true);
                                }}
                                style={{ backgroundImage: `url(${media.fileUrl})` }}
                              />
                            )}
                          </>
                        );
                      })}
                  </div>
                </div>
              )}
              {checkMedia('Video') && (
                <div className="col-12">
                  <div className="title mt-4">ویدیوها</div>
                  <div className="gallery-box">
                    {requestDetailInfo?.files &&
                      requestDetailInfo?.files.length > 0 &&
                      requestDetailInfo?.files.map((media: IFiles, index: number) => {
                        return <>{media.fileType == 'Video' && <video controls src={media?.fileUrl} />}</>;
                      })}
                  </div>
                </div>
              )}
              {checkMedia('Audio') && (
                <div className="col-12">
                  <div className="title mt-4 mb-3">پیام صوتی</div>
                  {requestDetailInfo?.files &&
                    requestDetailInfo?.files.length > 0 &&
                    requestDetailInfo?.files.map((media: IFiles, index: number) => {
                      return <>{media.fileType == 'Audio' && <audio src={media.fileUrl} controls />}</>;
                    })}
                </div>
              )}
              <div className="col-12 pb-5">
                <div className="title mt-4 mb-3">اسامی تکنسین ها</div>
                <ul className="technician-list">
                  {requestDetailInfo?.technicianList &&
                    requestDetailInfo?.technicianList.length > 0 &&
                    requestDetailInfo?.technicianList.map((technician: ITechnicians, index: number) => {
                      return (
                        <>
                          <li>
                            <div className="technician-name">
                              {technician.firstName} {technician.lastName}
                            </div>
                            <a href={`tel:${technician.phoneNumber}`} className="phonenumber">
                              {' '}
                              <span>{technician.phoneNumber}</span>{' '}
                              <img src={require(`@src/scss/images/icons/${color}-phone.svg`)} alt="" />
                            </a>
                          </li>
                        </>
                      );
                    })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
      <ShowImageModal display={displayImage} src={imageSrc} handleDisplay={handleDisplay} />
    </>
  );
};

export default RequestDetailInfo;
