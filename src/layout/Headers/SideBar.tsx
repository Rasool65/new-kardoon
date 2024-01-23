import {
  URL_CHAT,
  URL_CONVERSATION,
  URL_BLOG,
  URL_LOGIN,
  URL_MAIN,
  URL_MY_ORDERS,
  URL_TECHNICIAN_MISSION,
  URL_USER_PROFILE,
  URL_GUARANTEE,
  URL_TECHNICIAN_REGISTER_REQUEST,
  URL_USER_ACTIVE_SESSION,
} from '@src/configs/urls';
import { handleLogout } from '@src/redux/reducers/authenticationReducer';
import { FunctionComponent, useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatePath, useNavigate } from 'react-router-dom';
import { RootStateType } from '@src/redux/Store';
import ChangePassword from '@src/pages/changePassword';
import { UtilsHelper } from '@src/utils/GeneralHelpers';
import useHttpRequest from '@src/hooks/useHttpRequest';
import { APIURL_DELETE_TOKENS, APIURL_GET_REGISTER_OPTIONS, APIURL_POST_REGISTER } from '@src/configs/apiConfig/apiUrls';
import { IOutputResult } from '@src/models/output/IOutputResult';
import { IRegisterOptionResultModel } from '@src/models/output/authentication/IRegisterOptionResultModel';
import { useToast } from '@src/hooks/useToast';
import { BASE_URL } from '@src/configs/apiConfig/baseUrl';
import { coerceToArrayBuffer, coerceToBase64Url } from '@src/utils/site';
import LoadingComponent from '@src/components/spinner/LoadingComponent';

interface SideBarProps {
  displayMenu: boolean;
  handleDisplayMenu: any;
}

const SideBar: FunctionComponent<SideBarProps> = ({ displayMenu, handleDisplayMenu }) => {
  const color = useSelector((state: RootStateType) => state.theme.color);
  const userData = useSelector((state: RootStateType) => state.authentication.userData);
  const currentTokenGuid = useSelector((state: RootStateType) => state.authentication.currentTokenGuid);
  const walletBalance = useSelector((state: RootStateType) => state.message.walletBalance);
  const httpRequest = useHttpRequest();
  const toast = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showSubMenu, setShowSubMenu] = useState<boolean>(false);
  const [displayChangePassword, setDisplayChangePassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [publicKey, setPublicKey] = useState<IRegisterOptionResultModel>();
  const checkboxRef = useRef<any>(null);
  function checkRole(normalizedName: string) {
    return userData?.roles?.some((roleName) => roleName.normalizedName === normalizedName);
  }
  const handleDeleteToken = () => {
    //! موقت پارامتر guid پر میشود
    setLoading(true);
    httpRequest
      .deleteRequest<IOutputResult<any>>(APIURL_DELETE_TOKENS, [
        currentTokenGuid ? currentTokenGuid : '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      ])
      .then((result) => {
        setLoading(false);
        result.data.isSuccess ? (dispatch(handleLogout()), navigate(URL_LOGIN)) : toast.showError(result.data.message);
      });
  };
  const handleCloseModal = () => {
    setDisplayChangePassword(!displayChangePassword);
    handleDisplayMenu();
  };
  const HandleClickSubMenu = () => {
    setShowSubMenu(!showSubMenu);
  };

  const HandleClickBiometric = () => {
    if (!window.navigator.credentials) return toast.showError('مرورگر شما این قابلیت را پشتیبانی نمی کند');
    httpRequest.postRequest<IOutputResult<any>>(`${APIURL_GET_REGISTER_OPTIONS}`, {}).then((result) => {
      let key = JSON.parse(result.data.data);
      setPublicKey(key);
    });
  };

  const handleActivateBiometric = (checked: boolean) => {
    checked
      ? (HandleClickBiometric(), localStorage.setItem('userName', userData?.userName!))
      : localStorage.removeItem('userName');
  };

  useEffect(() => {
    let options: any;
    publicKey &&
      ((options = {
        rp: {
          id: publicKey.rp?.id,
          name: publicKey?.rp?.name,
        },
        user: {
          name: publicKey?.user?.name,
          id: coerceToArrayBuffer(publicKey?.user?.id),
          displayName: publicKey?.user?.displayName,
        },
        challenge: coerceToArrayBuffer(publicKey?.challenge),
        pubKeyCredParams: publicKey?.pubKeyCredParams,
        timeout: publicKey?.timeout,
        attestation: publicKey?.attestation,
        authenticatorSelection: {
          // requireResidentKey: publicKey?.authenticatorSelection?.requireResidentKey,
          //! for direct finger print use 'platform'
          authenticatorAttachment: 'platform',
          userVerification: publicKey?.authenticatorSelection?.userVerification,
        },
        excludeCredentials: publicKey?.excludeCredentials,
        status: publicKey?.status,
        errorMessage: publicKey?.errorMessage,
      }),
      navigator.credentials.create({ publicKey: options }).then((result: any) => {
        const body = {
          authenticatorAttachment: result.authenticatorAttachment,
          id: result.id,
          rawId: coerceToBase64Url(result.rawId),
          response: {
            attestationObject: coerceToBase64Url(result.response.attestationObject),
            clientDataJson: coerceToBase64Url(result.response.clientDataJSON),
          },
          type: 'public-key',
        };
        httpRequest.postRequest<IOutputResult<any>>(`${APIURL_POST_REGISTER}`, body).then((result) => {
          toast.showSuccess(result.data.message);
        });
      }));
  }, [publicKey]);

  useEffect(() => {
    localStorage.getItem('userName') ? (checkboxRef.current!.checked = false) : (checkboxRef.current!.checked = true);
  }, []);
  return (
    <>
      <div className={`footage ${displayMenu ? 'active' : ''}`} onClick={handleDisplayMenu}></div>
      <div className={`overlay ${displayMenu ? 'menu-active' : ''}`} style={{ zIndex: '12' }}>
        <img src={require(`@src/scss/images/icons/close-slidebar.svg`)} alt="" className="closebtn" onClick={handleDisplayMenu} />
        <div className="user-profie">
          <a
            className="profile-image"
            onClick={() => navigate(URL_USER_PROFILE)}
            style={{
              backgroundImage: `url(${
                userData?.profile?.profileImageUrl
                  ? userData?.profile?.profileImageUrl
                  : require('@src/scss/images/profile-defult-img.png')
              }`,
            }}
          ></a>
          <a className="user-name" onClick={() => navigate(URL_USER_PROFILE)}>
            {userData?.profile?.firstName || ''} {userData?.profile?.lastName || ''}
          </a>
          {walletBalance != 0 && (
            <p className={`wallet-amount ${walletBalance && walletBalance < 0 ? 'debtor-text' : 'creditor-text'}`}>
              {walletBalance
                ? UtilsHelper.threeDigitSeparator(
                    walletBalance && walletBalance < 0
                      ? '(' + walletBalance.toString().substring(1) + ') ریال بدهکاری'
                      : walletBalance.toString() + ' ریال اعتبار'
                  )
                : ''}
            </p>
          )}
        </div>

        <ul className="overlay-content">
          <li>
            {/* <a onClick={() => navigate(URL_CONVERSATION)}> */}
            <a onClick={() => navigate(generatePath(URL_CHAT, { id: '0' }))}>
              <img src={require(`@src/scss/images/icons/${color}-chat.svg`)} alt="" />
              پیام های پشتیبانی
            </a>
          </li>
          <li>
            <div className="d-flex align-items-center">
              <a className="">
                <img src={require(`@src/scss/images/icons/${color}-fingerprint.svg`)} alt="" />
                فعال سازی ورود با اثر انگشت
              </a>

              <div className="toggle-center mr-auto ml-2">
                <input
                  defaultChecked
                  onChange={(e) => handleActivateBiometric(!e.currentTarget.checked)}
                  ref={checkboxRef}
                  name="fingerprint"
                  type="checkbox"
                  className="toggle-checkbox form-check-input disable-toggle"
                />
              </div>
            </div>
          </li>
          {checkRole('TECHNICIAN') && (
            <li>
              <a onClick={() => navigate(URL_BLOG)}>
                <img src={require(`@src/scss/images/icons/${color}-notif.svg`)} alt="" />
                اطلاع رسانی
              </a>
            </li>
          )}
          {checkRole('TECHNICIAN') && (
            <>
              <li>
                <a onClick={() => navigate(URL_TECHNICIAN_MISSION)}>
                  <img src={require(`@src/scss/images/icons/${color}-missions.svg`)} alt="" />
                  ماموریت های من
                </a>
              </li>
            </>
          )}
          {checkRole('TECHNICIAN') && (
            <>
              <li>
                <a onClick={() => navigate(URL_TECHNICIAN_REGISTER_REQUEST)}>
                  <img src={require(`@src/scss/images/icons/${color}-add-technician.svg`)} alt="" />
                  ثبت نام و درخواست مشتری
                </a>
              </li>
            </>
          )}
          <li>
            <a onClick={() => navigate(URL_MY_ORDERS)}>
              <img src={require(`@src/scss/images/icons/${color}-myServices2.svg`)} alt="" />
              سفارشات من
            </a>
          </li>

          <li onClick={() => HandleClickSubMenu()} className={`collapse-menu ${showSubMenu && 'show'}`}>
            <a>
              <img src={require(`@src/scss/images/icons/${color}-user-profile.svg`)} alt="" />
              حساب کاربری
            </a>
            <ul>
              <li onClick={() => navigate(URL_USER_PROFILE)}>
                <a>
                  <img src={require(`@src/scss/images/icons/${color}-user-profile.svg`)} alt="" />
                  پروفایل
                </a>
              </li>
              <li>
                <a onClick={() => navigate(URL_USER_PROFILE, { state: { tabPage: 1 } })}>
                  <img src={require(`@src/scss/images/icons/${color}-menu-walet.svg`)} alt="" />
                  کیف پول
                </a>
              </li>

              <li className="disable">
                <a onClick={() => navigate(URL_USER_PROFILE)}>
                  <img src={require(`@src/scss/images/icons/${color}-payment.svg`)} alt="" />
                  تراکنش های من
                </a>
              </li>

              <li>
                {/* <a onClick={handleCloseModal}> */}
                <a onClick={handleCloseModal}>
                  <img src={require(`@src/scss/images/icons/${color}-changepassword.svg`)} alt="" />
                  تغییر کلمه عبور{' '}
                </a>
              </li>
              <li>
                {/* <a onClick={handleCloseModal}> */}
                <a onClick={() => navigate(URL_USER_ACTIVE_SESSION)}>
                  <img src={require(`@src/scss/images/icons/${color}-devices.svg`)} alt="" />
                  دستگاه های فعال{' '}
                </a>
              </li>
              <li>
                <a onClick={() => navigate(generatePath(URL_GUARANTEE, { id: userData?.guId }))}>
                  <img src={require(`@src/scss/images/icons/${color}-vector3449-uo2i.svg`)} alt="" />
                  گارانتی های من
                </a>
              </li>
            </ul>
          </li>
          <li>
            <a
              onClick={() => {
                !loading && handleDeleteToken();
              }}
            >
              <img src={require(`@src/scss/images/icons/${color}-menu-exit.svg`)} alt="" />
              {loading ? <LoadingComponent /> : 'خروج از حساب کاربری'}
            </a>
          </li>
        </ul>

        <div className="sidemenu-bottom">
          <div className="row">
            <div className="col-2 text-center">
              <a onClick={() => navigate(URL_CONVERSATION)}>
                <img src={require(`@src/scss/images/chat.svg`)} alt="" />
              </a>
            </div>
            <div className="col-2 text-center">
              <a onClick={() => navigate(URL_TECHNICIAN_MISSION)}>
                <img src={require(`@src/scss/images/mission.svg`)} alt="" />
              </a>
            </div>
            <div className="col-2 text-center">
              <a onClick={() => navigate(URL_MY_ORDERS)}>
                <img src={require(`@src/scss/images/order.svg`)} alt="" />
              </a>
            </div>
            <div className="col-2 text-center">
              <a onClick={() => navigate(URL_USER_PROFILE)}>
                <img src={require(`@src/scss/images/user-profile.svg`)} alt="" />
              </a>
            </div>
            <div className="col-2 text-center">
              <a onClick={() => navigate(URL_USER_PROFILE, { state: { tabPage: 1 } })}>
                <img src={require(`@src/scss/images/wallet.svg`)} alt="" />
              </a>
            </div>
            <div className="col-2 text-center">
              <a
                onClick={() => {
                  handleDeleteToken();
                }}
              >
                <img src={require(`@src/scss/images/power.svg`)} alt="" />
              </a>
            </div>
          </div>
        </div>
      </div>
      <ChangePassword displayChangePassword={displayChangePassword} handleDisplayChangePassword={handleCloseModal} />
    </>
  );
};

export default SideBar;
