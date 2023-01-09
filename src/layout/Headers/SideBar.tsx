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
} from '@src/configs/urls';
import { handleLogout } from '@src/redux/reducers/authenticationReducer';
import { FunctionComponent, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatePath, useNavigate } from 'react-router-dom';
import { RootStateType } from '@src/redux/Store';
import ChangePassword from '@src/pages/changePassword';
import { UtilsHelper } from '@src/utils/GeneralHelpers';

interface SideBarProps {
  displayMenu: boolean;
  handleDisplayMenu: any;
}

const SideBar: FunctionComponent<SideBarProps> = ({ displayMenu, handleDisplayMenu }) => {
  const color = useSelector((state: RootStateType) => state.theme.color);
  const userData = useSelector((state: RootStateType) => state.authentication.userData);
  const auth = useSelector((state: RootStateType) => state.authentication.isAuthenticate);
  const walletBalance = useSelector((state: RootStateType) => state.message.walletBalance);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showSubMenu, setShowSubMenu] = useState<boolean>(false);
  const [displayChangePassword, setDisplayChangePassword] = useState<boolean>(false);

  function checkRole(normalizedName: string) {
    return userData?.roles?.some((roleName) => roleName.normalizedName === normalizedName);
  }

  const handleCloseModal = () => {
    setDisplayChangePassword(!displayChangePassword);
    handleDisplayMenu();
  };
  const HandleClickSubMenu = () => {
    setShowSubMenu(!showSubMenu);
  };

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
                dispatch(handleLogout()), navigate(URL_MAIN);
              }}
            >
              <img src={require(`@src/scss/images/icons/${color}-menu-exit.svg`)} alt="" />
              خروج از حساب کاربری
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
              <a>
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
                  dispatch(handleLogout()), navigate(URL_MAIN);
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
