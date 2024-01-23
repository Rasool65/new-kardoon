import { APIURL_GET_TECHNICIAN_MISSIONS } from '@src/configs/apiConfig/apiUrls';
import IPageProps from '@src/configs/routerConfig/IPageProps';
import useHttpRequest from '@src/hooks/useHttpRequest';
import { IMissionsResultModel, ITechnicianMissionList } from '@src/models/output/mission/IMissionResultModel';
import { RootStateType } from '@src/redux/Store';
import { DateHelper } from '@src/utils/dateHelper';
import { FunctionComponent, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Spinner } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { IEServiceTypeId, IEStatusId, IEStatusMissionId } from '@src/models/output/order/IOrderListResultModel';
import { URL_HOME_WARRANTY, URL_TECHNICIAN_MISSION_DETAIL } from '@src/configs/urls';
import InfiniteScroll from 'react-infinite-scroll-component';
import { IPageListOutputResult } from '@src/models/output/IPageListOutputResult';
import Header from '@src/layout/Headers/Header';
import Filter from './Filter';
import Footer from '@src/layout/Footer';
import { useNotification } from '@src/hooks/useNotification';
import TechnicianMissionLoading from '@src/loading/technicianMissionLoading';
import { useQuery } from 'react-query';

const TechnicianMission: FunctionComponent<IPageProps> = (props) => {
  const TechnicianId = useSelector((state: RootStateType) => state.authentication.userData?.userId);
  const color = useSelector((state: RootStateType) => state.theme.color);
  const [loading, setLoading] = useState<boolean>(false);
  const httpRequest = useHttpRequest();
  const { getStatusMissionCount, getWalletBalance } = useNotification();
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [technicianMissionList, setTechnicianMissionList] = useState<ITechnicianMissionList[]>([]);
  const [withoutFilter, setWithout] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [serviceType, setServiceType] = useState<any>([]);
  const [productType, setProductType] = useState<any>([]);
  const [consumer, setConsumer] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [status, setStatus] = useState<any>([1, 5]);
  const navigate = useNavigate();

  const getCurrentTimeMinusOneHour = (dateTime: string) => {
    const currentDate = new Date();
    const oneHourAgo = new Date(currentDate.getTime() - 60 * 60 * 1000);
    let missionDateTime = new Date(dateTime);
    return missionDateTime < oneHourAgo ? true : false;
  };

  const handleClickFilter = () => {
    setShowFilter(!showFilter);
  };
  const handleServiceTypeChange = (e: any) => {
    setServiceType(Array.isArray(e) ? e.map((x) => x.value) : []);
  };
  const handleProductTypeChange = (e: any) => {
    setProductType(Array.isArray(e) ? e.map((x) => x.value) : []);
  };
  const handleStatusChange = (e: any) => {
    setStatus(Array.isArray(e) ? e.map((x) => x.value) : []);
  };
  const handleConsumerChange = (e: any) => {
    e ? setConsumer(e.value) : setConsumer(undefined);
  };

  const handleSubmit = async (withoutFilter: boolean, pageNumber: number) => {
    const body = {
      pageNumber: pageNumber,
      recordsPerPage: 10,
      status: status,
      serviceTypeIds: serviceType,
      productIds: productType,
      consumerId: consumer,
      technicianId: TechnicianId,
    };
    withoutFilter && delete body.consumerId && delete body.productIds && delete body.serviceTypeIds && delete body.status;
    if (!loading) {
      httpRequest
        .postRequest<IPageListOutputResult<IMissionsResultModel>>(`${APIURL_GET_TECHNICIAN_MISSIONS}`, body)
        .then((result) => {
          setLoading(false);
          result.data.data.technicianMissionList && result.data.data.technicianMissionList.length > 0
            ? (setTechnicianMissionList(technicianMissionList?.concat(result.data.data.technicianMissionList)), setHasMore(true))
            : setHasMore(false);
        });
    }
  };
  // const { data, error, isError, isLoading } = useQuery('getMissions', () => handleSubmit(false, pageNumber));

  const onClickFilter = () => {
    setLoading(true);
    setTechnicianMissionList([]);
    setPageNumber(1);
    setHasMore(true);
    setWithout(false);
    handleSubmit(false, 1);
  };
  const onClickNoFilter = () => {
    setLoading(true);
    setTechnicianMissionList([]);
    setPageNumber(1);
    setHasMore(true);
    setWithout(true);
    handleSubmit(true, 1);
  };

  useEffect(() => {
    setLoading(true);
    setPageNumber(1);
    setHasMore(true);
    setWithout(false);
    handleSubmit(false, 1);
    getStatusMissionCount();
    getWalletBalance();
  }, []);

  // useEffect(() => {
  // technicianMissionList && technicianMissionList?.length > 0 && setTechnicianMissionList(data);
  // }, [technicianMissionList]);

  useEffect(() => {
    document.title = props.title;
  }, [props.title]);

  return (
    <>
      <Header />
      <>
        <Footer activePage={1} />
        <div className="home-container technician-mission">
          <div className="container">
            <section>
              <div className="container mt-md-4">
                <div>
                  {loading ? (
                    <TechnicianMissionLoading />
                  ) : (
                    <InfiniteScroll
                      className="row"
                      dataLength={technicianMissionList?.length ? technicianMissionList?.length : 1}
                      next={() => {
                        setPageNumber(pageNumber + 1);
                        handleSubmit(withoutFilter, pageNumber + 1);
                      }}
                      hasMore={hasMore!}
                      loader={<Spinner style={{ position: 'fixed', top: '50%', left: '50%' }}>درحال بارگذاری...</Spinner>}
                    >
                      {technicianMissionList &&
                        technicianMissionList.length > 0 &&
                        technicianMissionList.map((mission: ITechnicianMissionList, index: number) => {
                          return (
                            <>
                              <div className="col-md-6">
                                <div
                                  className={`mission-card pointer ${
                                    getCurrentTimeMinusOneHour(mission?.presenceDateTime!) && mission.statusId === 1 && 'too-late'
                                  } ${IEServiceTypeId[mission.serviceTypeId!]} ${IEStatusMissionId[mission.statusId!]}`}
                                  // اگر از نوع هوم وارانتی بود وارد اکشن نشو
                                  onClick={() =>
                                    mission.serviceTypeId == 14
                                      ? navigate(URL_HOME_WARRANTY, { state: { requestDetailId: mission.requestDetailId } })
                                      : navigate(`${URL_TECHNICIAN_MISSION_DETAIL}?id=${mission.requestDetailId}`)
                                  }
                                >
                                  <div className="mission-item">
                                    <p className="mission-title">
                                      {mission.serviceTypeTitle}-{mission.productTitle}
                                    </p>
                                    <p className="mission-amount">
                                      {mission.presenceShift?.slice(0, 3)} {DateHelper.isoDateTopersian(mission.presenceDateTime)}
                                    </p>
                                    {mission.isUrgent ? <span className="sos-box">SOS</span> : ''}
                                    <img
                                      className="seemore-btn"
                                      src={require(`@src/scss/images/icons/${color}-info.svg`)}
                                      alt="VectorI344"
                                    />
                                  </div>
                                  <div className="mission-item">
                                    <p className="mission-info">
                                      مشتری:{' '}
                                      <span>
                                        {mission.consumerFirstName} {mission.consumerLastName}
                                      </span>
                                    </p>
                                    {/*//! for Recording style */}
                                    <div className="mission-status-box">
                                      {getCurrentTimeMinusOneHour(mission?.presenceDateTime!) && mission.statusId === 1 && (
                                        <div className="recording-box">
                                          <div className="d-flex">
                                            <div className="recording" />
                                          </div>
                                        </div>
                                      )}

                                      <span className={IEStatusId[mission.statusId!]}>{mission.statusTitle}</span>
                                    </div>
                                    {/* <div className={`mission-status-box`}>
                                      <span className={IEStatusId[mission.statusId!]}>{mission.statusTitle}</span>
                                    </div> */}
                                    <p className="mission-amount">{mission.address}</p>
                                  </div>
                                  <div className="d-flex justify-content-between">
                                    {/* <p className="mission-info">
                                    شماره درخواست: <span>{mission.requestNumber}</span>
                                  </p> */}
                                  </div>
                                </div>
                              </div>
                            </>
                          );
                        })}
                    </InfiniteScroll>
                  )}
                  <Filter
                    showModal={showFilter}
                    handleClick={handleClickFilter}
                    handleStatusChange={handleStatusChange}
                    handleServiceTypeChange={handleServiceTypeChange}
                    handleProductTypeChange={handleProductTypeChange}
                    handleConsumerChange={handleConsumerChange}
                    pageNumber={pageNumber}
                    loading={loading}
                    onClickFilter={onClickFilter}
                    onClickNoFilter={onClickNoFilter}
                    emptyList={() => setTechnicianMissionList([])}
                  />
                </div>
              </div>
            </section>
          </div>
        </div>
      </>
    </>
  );
};

export default TechnicianMission;
