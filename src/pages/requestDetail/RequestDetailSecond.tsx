import { FunctionComponent, useEffect, useState } from 'react';
import { Col, Row } from 'reactstrap';
import useHttpRequest from '@src/hooks/useHttpRequest';
import { useSelector } from 'react-redux';
import { RootStateType } from '@src/redux/Store';
import { APIURL_GET_ADDRESSES, APIURL_POST_DELETE_USER_ADDRESS } from '@src/configs/apiConfig/apiUrls';
import { IOutputResult } from '@src/models/output/IOutputResult';
import { IRequestDetailPageProp, IRequestDetailSecond } from './IRequestDetailProp';
import WeekPicker from '@src/components/weekPicker/WeekPicker';
import Picker from 'react-mobile-picker';
import { IAddressesResultModel } from '@src/models/output/requestDetail/IAddressesResultModel';
import AddAddressModal from './AddAddressModal';
import { useTranslation } from 'react-i18next';
import EditAddressModal from './EditAddressModal';
import { DateHelper } from '@src/utils/dateHelper';
import PrevHeader from '@src/layout/Headers/PrevHeader';
import LoadingComponent from '@src/components/spinner/LoadingComponent';
import ConfirmDeleteModal from './ConfirmDeleteModal';

const RequestDetailConfirm: FunctionComponent<IRequestDetailPageProp> = ({ handleClickMore, handleSubmit, isLoading }) => {
  const [selectDate, setSelectDate] = useState<string>('');
  const [addressList, setAddressList] = useState<IAddressesResultModel[]>();
  const [currentAddress, setCurrentAddress] = useState<IAddressesResultModel>();
  const [refKey, setRefKey] = useState<number>();
  const [isUrgent, setIsUrgent] = useState<boolean>(false);
  const [active, setActive] = useState<boolean>();
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [editAddressModalVisible, setEditAddressModalVisible] = useState<boolean>(false);
  const [addAddressModalVisible, setAddAddressModalVisible] = useState<boolean>(false);
  const userData = useSelector((state: RootStateType) => state.authentication.userData);
  const color = useSelector((state: RootStateType) => state.theme.color);
  const [shift, setShift] = useState<number>(1);
  const [shiftTime, setShiftTime] = useState<any>({
    isUrgent: isUrgent,
    valueGroups: { title: 'ظهر ۱۶-۱۲' },
    optionGroups: { title: ['صبح ۱۲-۸', 'ظهر ۱۶-۱۲', 'عصر ۲۰-۱۶', 'شب ۲۴-۲۰'] },
  });
  const httpRequest = useHttpRequest();
  const { t }: any = useTranslation();

  const getIndex = (value: any) => {
    const arr = optionGroups.title;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] == value) {
        return i;
      }
    }
    return -1;
  };
  const handleChange = (name: any, value: any) => {
    setShiftTime(({ valueGroups }: any) => ({
      valueGroups: {
        ...valueGroups,
        [name]: value,
      },
      optionGroups: { title: ['صبح ۱۲-۸', 'ظهر ۱۶-۱۲', 'عصر ۲۰-۱۶', 'شب ۲۴-۲۰'] },
    }));
  };
  const handleDeleteModal = () => {
    setDeleteModalVisible(!deleteModalVisible);
  };
  const handleEditAddressModal = () => {
    setEditAddressModalVisible(!editAddressModalVisible);
  };
  const handleAddAddressModal = () => {
    setAddAddressModalVisible(!addAddressModalVisible);
  };
  const GetAddresses = () => {
    setLoading(true);
    httpRequest
      .getRequest<IOutputResult<IAddressesResultModel[]>>(`${APIURL_GET_ADDRESSES}?UserName=${userData?.userName}`)
      .then((result) => {
        setAddressList(result.data.data);
        setLoading(false);
      });
  };
  const chbOnChange = (e: any) => {
    e.target.checked ? setIsUrgent(true) : setIsUrgent(false);
  };

  const deleteAddress = (refKey: number) => {
    setLoading(true);
    handleDeleteModal();
    const body = {
      userName: userData?.userName,
      refkey: refKey,
    };
    httpRequest.postRequest<IOutputResult<IAddressesResultModel[]>>(`${APIURL_POST_DELETE_USER_ADDRESS}`, body).then((result) => {
      setAddressList(result.data.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    GetAddresses();
  }, []);

  const { optionGroups, valueGroups } = shiftTime;
  return (
    <>
      <PrevHeader />
      <div className="page-content select-time">
        <div className="container">
          {/* <div className="page-title pointer mt-4 mb-4">جزئیات سفارش</div> */}
          <div className="row align-items-stretch">
            <div className="col-12 col-md-6 mt-4">
              <div className="card p-0 h-100">
                <div className="card-header">
                  <h6>انتخاب زمان مراجعه</h6>
                </div>
                <div className="card-body p-4">
                  <Row>
                    {!isUrgent ? (
                      <>
                        <Col xs={7}>
                          <WeekPicker
                            onSelectDateTime={(value: string) => {
                              setSelectDate(value);
                            }}
                            selectedDate={selectDate}
                            questionId={3}
                            isUrgent={isUrgent}
                            //  isUrgentMessage={(e) => isUrgentMessage(e)}
                          />
                        </Col>
                        <Col xs={5}>
                          <Picker
                            isUrgent={isUrgent}
                            optionGroups={optionGroups}
                            valueGroups={valueGroups}
                            onChange={(name: string, value: string) => {
                              handleChange(name, value);
                              setShift(getIndex(value));
                            }}
                          />
                        </Col>
                      </>
                    ) : (
                      <>
                        <p>در تاریخ {DateHelper.isoDateTopersian(new Date())}مراجعه فوری انجام خواهد شد</p>
                      </>
                    )}
                  </Row>

                  <div className="form-check ">
                    <input className="form-check-input" type="checkbox" value="" id="check2" onChange={(e) => chbOnChange(e)} />
                    <label className="form-check-label" htmlFor="check2">
                      مراجعه فوری
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6 mt-4">
              <div className="card p-0 h-100">
                <div className="card-header">
                  <h6>انتخاب آدرس</h6>
                  <button onClick={() => handleAddAddressModal()} className="green-btn">
                    + افزودن آدرس
                  </button>
                </div>
                <div className="card-body p-4">
                  {loading ? (
                    <LoadingComponent />
                  ) : (
                    addressList &&
                    addressList.length &&
                    addressList.map((item: IAddressesResultModel, index: number) => {
                      return (
                        <div
                          className={`address-box ${active && 'active'}`}
                          onClick={() => {
                            setActive(true);
                          }}
                        >
                          <label className="" htmlFor={`radio${index}`}>
                            <div className="d-flex align-items-center">
                              <input
                                className="form-check-input chackbox"
                                type="radio"
                                name="inlineRadioOptions"
                                onClick={(e) => {
                                  // handleActive(index)

                                  setRefKey(item.refkey);
                                }}
                                value=""
                                id={`radio${index}`}
                              />
                              {/* <div className='address-title'>محل کار | 02185858585</div> */}
                              <div className="address-title">
                                {item.title?.label} | {item.homeTel}
                              </div>
                            </div>

                            <div className="d-flex align-items-center mt-2 mb-2">
                              <div>
                                <img
                                  className="location-icon"
                                  src={require(`@src/scss/images/icons/${color}-location-select.svg`)}
                                  alt="VectorI344"
                                />
                              </div>

                              <div className="address-title">{item.address}</div>
                            </div>

                            {/* <div className="row mb-2">
                              <div className="col-12">{item.address}</div>
                              <div className="col-6">کد پستی</div>
                              <div className="col-6">{item.zipCode}</div>
                            </div> */}
                          </label>
                          <div className="d-flex">
                            <img
                              src={require(`@src/scss/images/icons/${color}-delete.svg`)}
                              className="delete-icon pointer"
                              onClick={() => {
                                setRefKey(item.refkey!);
                                setDeleteModalVisible(true);
                              }}
                              width="46"
                              height="46"
                              alt=""
                            />
                            <img
                              src={require(`@src/scss/images/icons/more.svg`)}
                              className="delete-icon pointer mr-2"
                              onClick={() => {
                                setCurrentAddress(item);
                                setRefKey(item.refkey!);
                                setEditAddressModalVisible(true);
                              }}
                              width="46"
                              height="46"
                              alt=""
                            />
                            {/* <button
                              onClick={() => {
                                setCurrentAddress(item);
                                setRefKey(item.refkey!);
                                setEditAddressModalVisible(true);
                              }}
                              className="more-dtails-btn"
                            >
                              جزییات
                            </button> */}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
            <div className="col-12 mt-4">
              <button
                onClick={(e) => {
                  const body: IRequestDetailSecond = {
                    refkey: refKey!,
                    presenceDate: selectDate,
                    presenceShift: shift,
                    isUrgent: isUrgent,
                  };
                  isUrgent &&
                    //  delete body.presenceDate &&
                    delete body.presenceShift;
                  handleSubmit(body);
                }}
                className="btn-info"
              >
                {isLoading ? <LoadingComponent /> : 'تایید و ادامه'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDeleteModal
        accept={() => deleteAddress(refKey!)}
        reject={handleDeleteModal}
        confirmModalVisible={deleteModalVisible}
      />
      <EditAddressModal
        reject={handleEditAddressModal}
        GetAddresses={GetAddresses}
        CurrentAddress={currentAddress!}
        EditAddressModalVisible={editAddressModalVisible}
      />
      <AddAddressModal
        GetAddresses={GetAddresses}
        reject={handleAddAddressModal}
        AddAddressModalVisible={addAddressModalVisible}
      />
    </>
  );
};

export default RequestDetailConfirm;
