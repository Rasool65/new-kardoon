import {
  URL_CONVERSATION,
  URL_LOGIN,
  URL_MAIN,
  URL_MY_ORDERS,
  URL_TECHNICIAN_MISSION,
  URL_TECHNICIAN_REGISTER_REQUEST,
  URL_USER_PROFILE,
} from '@src/configs/urls';
import { handleLogout } from '@src/redux/reducers/authenticationReducer';
import { FunctionComponent, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootStateType } from '@src/redux/Store';
import { useToast } from '@src/hooks/useToast';
import ChangePassword from '@src/pages/changePassword';

interface SideBarProps {
  displayMenu: boolean;
  handleDisplayMenu: any;
}

const SideBar: FunctionComponent<SideBarProps> = ({ displayMenu, handleDisplayMenu }) => {
  const color = useSelector((state: RootStateType) => state.theme.color);
  const auth = useSelector((state: RootStateType) => state.authentication.isAuthenticate);
  const userData = useSelector((state: RootStateType) => state.authentication.userData);
  const toast = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [displayChangePassword, setDisplayChangePassword] = useState<boolean>(false);

  function checkRole(normalizedName: string) {
    return userData?.roles?.some((roleName) => roleName.normalizedName === normalizedName);
  }

  const handleCloseModal = () => {
    setDisplayChangePassword(!displayChangePassword);
    handleDisplayMenu();
  };

  return (
    <>
      <div className={`footage ${displayMenu ? 'active' : ''}`} onClick={handleDisplayMenu}></div>
      <div className={`overlay ${displayMenu ? 'menu-active' : ''}`} style={{ zIndex: '12' }}>
        {/* <a className="closebtn" onClick={handleDisplayMenu}>
          &times;
        </a> */}
        <img src={require(`@src/scss/images/icons/close-slidebar.svg`)} alt="" className="closebtn" onClick={handleDisplayMenu} />
        <div className="user-profie">
          {/* <img src={userData?.profile.avatar} /> */}
          <div
            className="profile-image"
            style={{
              backgroundImage: `url(${
                userData?.profile?.profileImageUrl
                  ? userData?.profile?.profileImageUrl
                  : require('@src/scss/images/profile-defult-img.png')
              }`,
            }}
          ></div>
          <div className="user-name">
            {userData?.profile?.firstName || ''} {userData?.profile?.lastName || ''}
          </div>
        </div>

        <ul className="overlay-content">
          <li>
            <a onClick={() => navigate(URL_CONVERSATION)}>
              <img src={require(`@src/scss/images/icons/${color}-chat.svg`)} alt="" />
              لیست پیام ها
            </a>
          </li>

          {checkRole('TECHNICIAN') && (
            <>
              <li>
                <a onClick={() => navigate(URL_TECHNICIAN_MISSION)}>
                  <img src={require(`@src/scss/images/icons/${color}-missions.svg`)} alt="" />
                  ماموریت های من
                </a>
              </li>
              {/* <li>
                <a onClick={() => navigate(URL_TECHNICIAN_REGISTER_REQUEST)}>
                  <img src={require(`@src/scss/images/icons/${color}-missions.svg`)} alt="" />
                  ثبت نام و درخواست برای مشتری
                </a>
              </li> */}
            </>
          )}

          <li>
            <a onClick={() => navigate(URL_MY_ORDERS)}>
              <img src={require(`@src/scss/images/icons/${color}-myServices2.svg`)} alt="" />
              سفارشات من
            </a>
          </li>

          <li onClick={() => navigate(URL_USER_PROFILE)} className="">
            <a>
              <img src={require(`@src/scss/images/icons/${color}-user-profile.svg`)} alt="" />
              پروفایل کاربری
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
