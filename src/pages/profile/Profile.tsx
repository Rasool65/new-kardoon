import { yupResolver } from '@hookform/resolvers/yup';
import { APIURL_GET_INTRODUCTIONS, APIURL_GET_USER_INFO, APIURL_UPDATE_PROFILE_FORMDATA } from '@src/configs/apiConfig/apiUrls';
import useHttpRequest from '@src/hooks/useHttpRequest';
import { useToast } from '@src/hooks/useToast';
import Footer from '@src/layout/Footer';
import Select from 'react-select';
import { IUpdateProfileModel, UpdateProfileModelSchema } from '@src/models/input/profile/IUpdateProfileModel';
import { IOutputResult } from '@src/models/output/IOutputResult';
import { IUpdateProfileResultModel } from '@src/models/output/profile/IUpdateProfileResultModel';
import { FunctionComponent, useState, useEffect } from 'react';
import { Form, FormFeedback, Input } from 'reactstrap';
import InputIcon from 'react-multi-date-picker/components/input_icon';
import DatePicker, { DateObject } from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import { useSelector, useDispatch } from 'react-redux';
import { RootStateType } from '@src/redux/Store';
import { reloadUserData } from '@src/redux/reducers/authenticationReducer';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { IIntroductionResultModel } from '@src/models/output/profile/IIntroductionResultModel';
import Header from '@src/layout/Headers/Header';
import { IProfilePageProp } from './IProfilePageProp';
import CreditInfo from './CreditInfo';
import { IUserInfoResultModel } from './../../models/output/profile/IUserInfoResultModel';
import LoadingComponent from '@src/components/spinner/LoadingComponent';
import UserProfileLoading from '@src/loading/userProfileLoading';
import { useQuery } from 'react-query';
import { introductionSelect, userInfo } from '@src/configs/apiConfig/cachNames';

const Profile: FunctionComponent<IProfilePageProp> = ({ handleClickTab }) => {
  const color = useSelector((state: RootStateType) => state.theme.color);
  const userData = useSelector((state: RootStateType) => state.authentication.userData);
  const dispatch = useDispatch();
  const { t }: any = useTranslation();
  const toast = useToast();
  const [imageSrc, setImageSrc] = useState<any>(userData?.profile?.profileImageUrl);
  const [imageFile, setImageFile] = useState<any>();
  const [gender, setGender] = useState<number>(userData?.profile.gender!);
  const [isPublicEmail, setIsPublicEmail] = useState<boolean>(userData?.profile.isPublicEmail!);
  const [loading, setLoading] = useState<boolean>(false);
  const httpRequest = useHttpRequest();
  const [introMethodId, setIntroMethodId] = useState<any>(userData?.profile.intrductionInfo?.introMethodId!);
  const weekDays = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];

  const fetchIntroductions = async () => {
    const response = await httpRequest.getRequest<IOutputResult<IIntroductionResultModel>>(`${APIURL_GET_INTRODUCTIONS}`);
    return response.data.data;
  };
  const introductionsQuery: any = useQuery(introductionSelect, fetchIntroductions);

  const fetchUserInfo = async () => {
    const body = {
      userName: userData?.userName,
      userId: userData?.userId,
    };
    const response = await httpRequest.postRequest<IOutputResult<IUserInfoResultModel>>(`${APIURL_GET_USER_INFO}`, body);
    return response.data.data;
  };
  const userInfoQuery = useQuery(userInfo, fetchUserInfo);

  const {
    register,
    control,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm<IUpdateProfileModel>({ mode: 'onChange', resolver: yupResolver(UpdateProfileModelSchema) });

  const onSubmit = (data: IUpdateProfileModel) => {
    setLoading(true);
    var formData = new FormData();
    formData.append('userName', userData?.userName!);
    formData.append('firstName', data.firstName);
    formData.append('lastName', data.lastName);
    formData.append('email', data.email);
    formData.append('IsPublicEmail', isPublicEmail.toString());
    formData.append('birthDate', data.birthDate);
    formData.append('nationalCode', data.nationalCode);
    formData.append('gender', gender.toString());
    formData.append('introductionInfo.introductionCode', data.introductionInfo?.introductionCode!);
    formData.append('introductionInfo.refKey', '0');
    formData.append('introductionInfo.introMethodId', introMethodId);
    if (imageFile) formData.append('profileImage', imageFile[0]);
    formData.append('phoneNumber', data.phoneNumber);
    formData.append('workAddress', data.workAddress || '');
    formData.append('homeAddress', data.homeAddress || '');

    if (!loading) {
      httpRequest
        .postRequest<IOutputResult<IUpdateProfileResultModel>>(APIURL_UPDATE_PROFILE_FORMDATA, formData)
        .then((result) => {
          setLoading(false);
          dispatch(reloadUserData(result));
          toast.showInfo(result.data.message);
        })
        .finally(() => setLoading(false));
    }
  };

  return (
    <>
      {userInfoQuery.isLoading ? (
        <UserProfileLoading />
      ) : (
        <div className="home-container mb-5">
          <Header />
          <Footer activePage={3} />
          <div className="container mb-4">
            <div className="px-2 w-100">
              <div className="account-box">
                <h4 className="account-item active">
                  <a
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      handleClickTab(0);
                    }}
                  >
                    حساب کاربری
                  </a>
                </h4>
                <h4 className="account-item">
                  <a
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      handleClickTab(1);
                    }}
                  >
                    کیف پول
                  </a>
                </h4>
              </div>
            </div>

            <section className="profile-section">
              <div className="account-profile">
                {/* background-image: url("@src/scss/images/profile-defult-img.png"); */}
                <div
                  className="profile-image"
                  style={{ backgroundImage: `url(${imageSrc ? imageSrc : require('@src/scss/images/profile-defult-img.png')}` }}
                >
                  <Input
                    type="file"
                    className="upload-image-input"
                    accept="image/*"
                    onChange={(e) => {
                      setImageFile(e.target.files);
                      const reader = new FileReader();
                      reader.onload = function () {
                        setImageSrc(reader.result);
                      };
                      reader.readAsDataURL(e.target.files![0]);
                    }}
                  />
                  <img
                    // src={require(`@src/scss/images/icons/changeimage.svg`)}
                    src={require(`@src/scss/images/icons/${color}-rieditcirclefill3648-zhtk.svg`)}
                    alt="rieditcirclefill3648"
                    className="change-image-icon"
                  />
                </div>
              </div>
              <div className="user-info">
                <h3>
                  {userInfoQuery.data?.user.profile?.firstName} {userInfoQuery.data?.user.profile?.lastName}
                </h3>
                <p>{userData?.profile.email}</p>
              </div>
            </section>

            <section className="account-data p-30">
              <Form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                  <div className="col-12">
                    <p />
                    <div className="gender">
                      <img
                        src={require(`@src/scss/images/icons/red-famel-icon.svg`)}
                        className={`${gender && 'disable'} gender-icon`}
                        alt=""
                      />
                      <div className="toggle-center">
                        <Input
                          {...register('gender', { required: true })}
                          name="gender"
                          defaultChecked={gender == 0 ? true : false}
                          onChange={(e) => {
                            e.currentTarget.checked ? setGender(0) : setGender(1);
                          }}
                          type="checkbox"
                          className="toggle-checkbox"
                        />
                      </div>
                      <img
                        src={require(`@src/scss/images/icons/${color}-male-icon.svg`)}
                        className={`${!gender && 'disable'} gender-icon`}
                        alt=""
                      />
                    </div>
                  </div>

                  <div className="col-12 col-md-6 col-lg-3">
                    <p className="item-label">
                      نام<span className="color-danger">*</span>
                    </p>
                    <Controller
                      name="firstName"
                      control={control}
                      defaultValue={userInfoQuery.data?.user?.profile?.firstName || ''}
                      render={({ field }) => (
                        <>
                          <Input
                            className="account-data-input"
                            type="text"
                            placeholder={t('Name')}
                            autoComplete="off"
                            invalid={errors.firstName && true}
                            {...field}
                          />
                          <FormFeedback>{errors.firstName?.message}</FormFeedback>
                        </>
                      )}
                    />
                  </div>
                  <div className="col-12 col-md-6 col-lg-3">
                    <p className="item-label">
                      نام خانوادگی<span className="color-danger">*</span>
                    </p>
                    <Controller
                      name="lastName"
                      control={control}
                      defaultValue={userInfoQuery.data?.user.profile?.lastName || ''}
                      render={({ field }) => (
                        <>
                          <Input
                            className="account-data-input"
                            type="text"
                            placeholder={t('Family')}
                            autoComplete="off"
                            invalid={errors.lastName && true}
                            {...field}
                          />
                          <FormFeedback>{errors.lastName?.message}</FormFeedback>
                        </>
                      )}
                    />
                  </div>
                  <div className="col-12 col-md-6 col-lg-3">
                    <p className="item-label">
                      ایمیل<span className="color-danger">*</span>
                    </p>
                    <Controller
                      name="email"
                      control={control}
                      defaultValue={userInfoQuery.data?.user?.profile?.email || ''}
                      render={({ field }) => (
                        <>
                          <Input
                            className="account-data-input"
                            type="text"
                            placeholder={t('EnterEmail')}
                            autoComplete="off"
                            invalid={errors.email && true}
                            {...field}
                          />
                          <FormFeedback>{errors.email?.message}</FormFeedback>
                        </>
                      )}
                    />
                  </div>
                  <div className="col-12 col-md-6 col-lg-3">
                    <p className="item-label">کد ملی</p>
                    <Controller
                      name="nationalCode"
                      control={control}
                      defaultValue={userInfoQuery.data?.user.profile?.nationalCode || ''}
                      render={({ field }) => (
                        <>
                          <Input
                            className="account-data-input"
                            type="number"
                            placeholder={t('EnterNationalCode')}
                            autoComplete="off"
                            invalid={errors.nationalCode && true}
                            {...field}
                          />
                          <FormFeedback>{errors.nationalCode?.message}</FormFeedback>
                        </>
                      )}
                    />
                  </div>
                  <div className="col-12 col-md-6 col-lg-3">
                    <p className="item-label">تاریخ تولد</p>
                    <Controller
                      name="birthDate"
                      control={control}
                      defaultValue={userInfoQuery.data?.user?.profile?.birthDate}
                      render={({ field: { onChange, name, value } }) => (
                        <>
                          <DatePicker
                            render={<InputIcon style={{ height: 'calc(2.4em + 0.75rem - 6px)', width: '100%' }} />}
                            weekDays={weekDays}
                            inputClass="form-control"
                            onChange={(date: DateObject) => {
                              const selectedDate: Date = date.toDate();
                              onChange(selectedDate.toISOString());
                            }}
                            value={new Date(value)}
                            format="YYYY/MM/DD"
                            calendar={persian}
                            locale={persian_fa}
                            calendarPosition="bottom-right"
                          />
                          <FormFeedback className="d-block">{errors.birthDate?.message}</FormFeedback>
                        </>
                      )}
                    />
                  </div>
                  <div className="col-12 col-md-6 col-lg-3">
                    <p className="item-label">شماره تماس ضروری</p>
                    <Controller
                      name="phoneNumber"
                      control={control}
                      defaultValue={userInfoQuery.data?.user?.profile?.phoneNumber || ''}
                      render={({ field }) => (
                        <>
                          <Input
                            className="account-data-input"
                            type="number"
                            placeholder={'شماره تماس ضروری را وارد نمایید'}
                            autoComplete="off"
                            invalid={errors.phoneNumber && true}
                            {...field}
                          />
                          <FormFeedback className="d-block">{errors.phoneNumber?.message}</FormFeedback>
                        </>
                      )}
                    />
                  </div>
                  <div className="col-12 col-md-6 col-lg-3">
                    <p className="item-label">آدرس محل سکونت</p>
                    <Controller
                      name="homeAddress"
                      control={control}
                      defaultValue={userInfoQuery.data?.user.profile?.homeAddress || ''}
                      render={({ field }) => (
                        <>
                          <Input
                            className="account-data-input p-2"
                            style={{ height: '100px' }}
                            type="textarea"
                            placeholder={'آدرس محل سکونت خود را وارد نمایید'}
                            autoComplete="off"
                            invalid={errors.homeAddress && true}
                            {...field}
                          />
                          <FormFeedback>{errors.homeAddress?.message}</FormFeedback>
                        </>
                      )}
                    />
                  </div>
                  <div className="col-12 col-md-6 col-lg-3">
                    <p className="item-label">آدرس محل کار</p>
                    <Controller
                      name="workAddress"
                      control={control}
                      defaultValue={userInfoQuery.data?.user.profile?.workAddress || ''}
                      render={({ field }) => (
                        <>
                          <Input
                            className="account-data-input p-2"
                            type="textarea"
                            style={{ height: '100px' }}
                            placeholder={'آدرس محل کار خود را وارد نمایید'}
                            autoComplete="off"
                            invalid={errors.workAddress && true}
                            {...field}
                          />
                          <FormFeedback>{errors.workAddress?.message}</FormFeedback>
                        </>
                      )}
                    />
                  </div>
                  <div className="col-12 col-md-6 col-lg-3">
                    <p className="item-label">کد معرف</p>
                    <Controller
                      name="introductionInfo.introductionCode"
                      control={control}
                      defaultValue={userInfoQuery.data?.user.profile?.intrductionInfo?.introductionCode || ''}
                      render={({ field }) => (
                        <>
                          <Input
                            className="account-data-input"
                            type="text"
                            placeholder={t('EnterIntroductionCode')}
                            autoComplete="off"
                            invalid={errors.introductionInfo?.introductionCode && true}
                            {...field}
                          />
                          <FormFeedback>{errors.introductionInfo?.introductionCode?.message}</FormFeedback>
                        </>
                      )}
                    />
                  </div>
                  <div className="col-12 col-md-6 col-lg-3">
                    <p className="item-label">نحوه آشنایی</p>
                    <Controller
                      name="introductionInfo.introMethodTitle"
                      control={control}
                      render={({ field }) => (
                        <>
                          <Select
                            noOptionsMessage={() => t('ListIsEmpty')}
                            isClearable
                            placeholder={t('SelectIntroduction')}
                            options={introductionsQuery.data}
                            isSearchable={true}
                            {...field}
                            defaultInputValue={userInfoQuery.data?.user.profile?.intrductionInfo?.introMethodTitle || ''}
                            onChange={(e: any) => {
                              e ? setIntroMethodId(e.value) : setIntroMethodId(undefined);
                            }}
                          />
                          {!introMethodId ? <FormFeedback className="d-block">نحوه آشنایی اجباریست</FormFeedback> : ''}
                        </>
                      )}
                    />
                  </div>
                  <div className="col-12 mb-5">
                    <p>نمایش خصوصی / عمومی ایمیل</p>
                    <div className="gender mail-setting">
                      <div className="text-left">
                        <img
                          src={require(`@src/scss/images/icons/${color}-public-mail.svg`)}
                          className={`${!isPublicEmail && 'disable'} mail-icon`}
                          alt=""
                        />
                        {/* <p>نمایش عمومی ایمیل</p> */}
                      </div>
                      <div className="toggle-center">
                        <Input
                          {...register('isPublicEmail', { required: true })}
                          name="isPublicEmail"
                          defaultChecked={isPublicEmail}
                          onChange={(e) => {
                            e.currentTarget.checked ? setIsPublicEmail(true) : setIsPublicEmail(false);
                          }}
                          type="checkbox"
                          className="toggle-checkbox"
                        />
                      </div>
                      <div className="text-right">
                        <img
                          src={require(`@src/scss/images/icons/${color}-private-mail.svg`)}
                          className={`${isPublicEmail && 'disable'} mail-icon`}
                          alt="alt"
                        />
                      </div>
                    </div>
                  </div>
                  <button type="submit" className="primary-btn green-btn">
                    {loading ? <LoadingComponent /> : 'ویرایش اطلاعات کاربری'}
                  </button>
                </div>
              </Form>
              <CreditInfo />
            </section>
          </div>
        </div>
      )}
    </>
  );
};
export default Profile;
