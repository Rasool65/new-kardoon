import { useSelector, useDispatch } from 'react-redux';
import { RootStateType } from '@src/redux/Store';
import { generatePath, useNavigate } from 'react-router-dom';
import { URL_CONVERSATION, URL_LOGIN, URL_TECHNICIAN_MISSION } from '@src/configs/urls';
import { handleLogout } from '@src/redux/reducers/authenticationReducer';
import { useState, useEffect } from 'react';
import { useToast } from '@src/hooks/useToast';
import SideBar from './SideBar';
import { URL_BLOG, URL_CHAT } from './../../configs/urls';

const Header = () => {
  const color = useSelector((state: RootStateType) => state.theme.color);
  const userData = useSelector((state: RootStateType) => state.authentication.userData);
  const messageCount = useSelector((state: RootStateType) => state.message.newMessageCount);
  const messageBlogCount = useSelector((state: RootStateType) => state.message.newMessageBlogCount);
  const auth = useSelector((state: RootStateType) => state.authentication.isAuthenticate);
  const walletBalance = useSelector((state: RootStateType) => state.message.walletBalance);
  const assignedMissionCount = useSelector((state: RootStateType) =>
    state.message.statusMission && state.message.statusMission.length > 0
      ? state.message.statusMission[1].count! // assigned
      : // state.missionStatus[2].count! + // cancelAwaiting
        // state.missionStatus[5].count! + // pending
        // state.missionStatus[0].count! + // open
        // state.missionStatus[6].count! // invoiceIssuance
        0
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const [displayMenu, setDisplayMenu] = useState<boolean>(false);
  const handleDisplayMenu = () => {
    auth ? setDisplayMenu(!displayMenu) : toast.showError('لطفأ وارد شوید');
  };
  function checkRole(normalizedName: string) {
    return userData?.roles?.some((roleName) => roleName.normalizedName === normalizedName);
  }

  return (
    <>
      <nav className="mobile-menu">
        <div className="menu-box">
          <img
            src={require(`@src/scss/images/icons/${color}-antdesignmenuoutlinedi344-6jwd.svg`)}
            alt="antdesignmenuoutlinedI344"
            className="menu-icon"
            onClick={() => handleDisplayMenu()}
          />
          <a href=".">
            <img
              className="header-logo"
              src={require(`@src/scss/images/icons/${color}-kardoonfinallogo11i344-lw34.svg`)}
              alt="KardoonFinallogo11I344"
            />
          </a>
        </div>

        <div className={`login-box ${checkRole('TECHNICIAN') && 'technesian-login'}`}>
          <img
            className="technesian-profile"
            style={{
              //! debugg Style
              backgroundImage: `url(${
                userData?.profile?.profileImageUrl
                  ? userData?.profile?.profileImageUrl
                  : require('@src/scss/images/profile-defult-img.png')
              }`,
            }}
          />
          <div className="call-box">
            <p className="menu-item">02147100</p>
            <img
              className="pointer"
              onClick={() => window.open(`tel:02147100`)}
              src={require(`@src/scss/images/icons/${color}-vectori344-6d8t.svg`)}
              alt="VectorI344"
            />
          </div>
          {assignedMissionCount > 0 && (
            <div className="login-box ml-2">
              <a onClick={() => navigate(URL_TECHNICIAN_MISSION)} className="alert-box">
                <div className="menu-item">
                  <span>{assignedMissionCount}</span>
                </div>
                <img width={24} height={24} src={require('@src/scss/images/icons/mission-assign.svg')} alt="" />
              </a>
            </div>
          )}
          {messageCount > 0 && (
            <div className="login-box ml-2">
              <a onClick={() => navigate(generatePath(URL_CHAT, { id: '0' }))} className="alert-box">
                <div className="menu-item">
                  <span>{messageCount}</span>
                </div>
                <img
                  src={require(`@src/scss/images/icons/message-box.svg`)}
                  style={{ width: '25px', height: '26px', padding: '2px' }}
                  className=""
                />
              </a>
            </div>
          )}
          {messageBlogCount > 0 && checkRole('TECHNICIAN') && (
            <div className="login-box ml-2">
              <a onClick={() => navigate(URL_BLOG)} className="alert-box">
                <div className="menu-item">
                  <span>{messageBlogCount}</span>
                </div>
                <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M6.0278 8.63259L6.7517 8.82873L6.7517 8.82873L6.0278 8.63259ZM10.1584 4.30223L9.92711 3.58877L10.1584 4.30223ZM5.98297 8.79804L5.25907 8.6019L5.25907 8.6019L5.98297 8.79804ZM5.78956 12.8674L6.5288 12.7409V12.7409L5.78956 12.8674ZM5.81207 12.9989L5.07282 13.1255L5.07282 13.1255L5.81207 12.9989ZM6.28759 17.4572L6.43731 16.7223L6.28759 17.4572ZM6.65518 17.5321L6.8049 16.7971H6.8049L6.65518 17.5321ZM17.3448 17.5321L17.1951 16.7971H17.1951L17.3448 17.5321ZM17.7124 17.4572L17.8621 18.1921L17.7124 17.4572ZM18.1922 12.9737L18.9315 13.1003V13.1003L18.1922 12.9737ZM18.2161 12.8343L17.4769 12.7077V12.7077L18.2161 12.8343ZM18.0417 8.82624L17.3163 9.01657V9.01658L18.0417 8.82624ZM17.9793 8.58835L18.7047 8.39802V8.39802L17.9793 8.58835ZM13.9671 4.30838L14.2023 3.59621V3.59621L13.9671 4.30838ZM18.353 13.3008L17.9868 13.9553L18.353 13.3008ZM5.66797 13.2892L5.3088 12.6308L5.66797 13.2892ZM12.75 3C12.75 2.58579 12.4142 2.25 12 2.25C11.5858 2.25 11.25 2.58579 11.25 3H12.75ZM11.25 4.00474C11.25 4.41895 11.5858 4.75474 12 4.75474C12.4142 4.75474 12.75 4.41895 12.75 4.00474H11.25ZM9.0091 17.9034L9.09289 17.1581L8.19556 17.0572L8.26108 17.9578L9.0091 17.9034ZM14.9909 17.9034L15.7389 17.9578L15.8044 17.0572L14.9071 17.1581L14.9909 17.9034ZM14.9001 18.4772L15.6285 18.6563L14.9001 18.4772ZM14.8182 18.8106L14.0899 18.6315L14.8182 18.8106ZM12.7039 20.917L12.8784 21.6464H12.8784L12.7039 20.917ZM11.2961 20.917L11.1216 21.6464H11.1216L11.2961 20.917ZM9.18182 18.8106L8.45352 18.9896L9.18182 18.8106ZM9.09985 18.4772L9.82816 18.2981H9.82816L9.09985 18.4772ZM6.7517 8.82873C7.23925 7.02931 8.62052 5.58915 10.3896 5.01568L9.92711 3.58877C7.67951 4.31734 5.92499 6.14416 5.3039 8.43645L6.7517 8.82873ZM6.70687 8.99418L6.7517 8.82873L5.3039 8.43645L5.25907 8.6019L6.70687 8.99418ZM6.5288 12.7409C6.3153 11.4939 6.37608 10.215 6.70687 8.99418L5.25907 8.6019C4.87128 10.0331 4.80004 11.5322 5.05032 12.994L6.5288 12.7409ZM6.55131 12.8723L6.5288 12.7409L5.05032 12.994L5.07282 13.1255L6.55131 12.8723ZM5.25 15.2604C5.25 14.6932 5.56385 14.2003 6.02714 13.9476L5.3088 12.6308C4.38074 13.137 3.75 14.1251 3.75 15.2604H5.25ZM6.43731 16.7223C5.74893 16.582 5.25 15.9725 5.25 15.2604H3.75C3.75 16.6807 4.74616 17.9085 6.13787 18.1921L6.43731 16.7223ZM6.8049 16.7971L6.43731 16.7223L6.13787 18.1921L6.50547 18.267L6.8049 16.7971ZM17.1951 16.7971C13.7666 17.4956 10.2334 17.4956 6.8049 16.7971L6.50547 18.267C10.1316 19.0057 13.8684 19.0057 17.4945 18.267L17.1951 16.7971ZM17.5627 16.7223L17.1951 16.7971L17.4945 18.267L17.8621 18.1921L17.5627 16.7223ZM18.75 15.2604C18.75 15.9725 18.2511 16.582 17.5627 16.7223L17.8621 18.1921C19.2538 17.9085 20.25 16.6807 20.25 15.2604H18.75ZM17.9868 13.9553C18.4425 14.2103 18.75 14.6989 18.75 15.2604H20.25C20.25 14.1365 19.6319 13.157 18.7192 12.6463L17.9868 13.9553ZM17.4769 12.7077L17.453 12.8471L18.9315 13.1003L18.9554 12.9608L17.4769 12.7077ZM17.3163 9.01658C17.6323 10.2211 17.6871 11.4799 17.4769 12.7077L18.9554 12.9608C19.2017 11.5223 19.1375 10.0474 18.7672 8.63591L17.3163 9.01658ZM17.2539 8.77868L17.3163 9.01657L18.7672 8.63591L18.7047 8.39802L17.2539 8.77868ZM13.7319 5.02054C15.4622 5.592 16.7887 7.00574 17.2539 8.77868L18.7047 8.39802C18.1113 6.13594 16.4174 4.32779 14.2023 3.59621L13.7319 5.02054ZM10.3896 5.01568C11.474 4.66418 12.6528 4.66417 13.7319 5.02054L14.2023 3.59621C12.8171 3.13872 11.3114 3.14004 9.92711 3.58877L10.3896 5.01568ZM18.7192 12.6463C18.8626 12.7265 18.966 12.8988 18.9315 13.1003L17.453 12.8471C17.3735 13.3114 17.6116 13.7453 17.9868 13.9553L18.7192 12.6463ZM5.07282 13.1255C5.03579 12.9092 5.14712 12.719 5.3088 12.6308L6.02714 13.9476C6.39669 13.746 6.62845 13.3228 6.55131 12.8723L5.07282 13.1255ZM11.25 3V4.00474H12.75V3H11.25ZM8.92531 18.6487C10.9687 18.8784 13.0313 18.8784 15.0747 18.6487L14.9071 17.1581C12.9751 17.3753 11.0249 17.3753 9.09289 17.1581L8.92531 18.6487ZM15.6285 18.6563C15.6849 18.4268 15.7218 18.1932 15.7389 17.9578L14.2429 17.849C14.2319 18.0003 14.2081 18.1506 14.1718 18.2981L15.6285 18.6563ZM15.5465 18.9896L15.6285 18.6563L14.1718 18.2981L14.0899 18.6315L15.5465 18.9896ZM12.8784 21.6464C14.1945 21.3315 15.223 20.3052 15.5465 18.9896L14.0899 18.6315C13.8997 19.4047 13.2965 20.004 12.5294 20.1875L12.8784 21.6464ZM11.1216 21.6464C11.6991 21.7845 12.3009 21.7845 12.8784 21.6464L12.5294 20.1875C12.1813 20.2708 11.8187 20.2708 11.4706 20.1875L11.1216 21.6464ZM8.45352 18.9896C8.77701 20.3052 9.80549 21.3315 11.1216 21.6464L11.4706 20.1875C10.7035 20.004 10.1003 19.4047 9.91013 18.6315L8.45352 18.9896ZM8.37155 18.6563L8.45352 18.9896L9.91013 18.6315L9.82816 18.2981L8.37155 18.6563ZM8.26108 17.9578C8.2782 18.1932 8.31512 18.4268 8.37155 18.6563L9.82816 18.2981C9.79188 18.1506 9.76814 18.0003 9.75712 17.849L8.26108 17.9578Z"
                    fill="#363853"
                  />
                </svg>
              </a>
            </div>
          )}
          {auth ? (
            <img
              src={require(`@src/scss/images/icons/${color}-logout.svg`)}
              alt="exit"
              className="login-icon"
              onClick={() => {
                dispatch(handleLogout()), navigate(URL_LOGIN);
              }}
            />
          ) : (
            <img
              src={require(`@src/scss/images/icons/${color}-logini344-kt0r.svg`)}
              alt="loginI344"
              className="login-icon"
              onClick={() => navigate(URL_LOGIN)}
            />
          )}
        </div>
      </nav>
      <nav className="desktop-menu">
        <div className="container menu-bar">
          <div className="logo">
            <a href=".">
              <img
                className="header-logo"
                src={require(`@src/scss/images/icons/${color}-kardoonfinallogo11i344-lw34.svg`)}
                alt="KardoonFinallogo11I344"
              />
            </a>{' '}
          </div>
          <ul className="menu-link">
            <li>
              <a>صفحه اصلی</a>
            </li>
            {auth && (
              <li className="has-children">
                <a> حساب کاربری</a>
                <ul className="children-items">
                  <li>
                    <a>کیف پول</a>
                  </li>
                  <li>
                    <a>آدرس های من</a>
                  </li>
                  <li>
                    <a>تماس با ما</a>
                  </li>
                  <li className="disable">
                    <a>قوانین و شرایط استفاده</a>
                  </li>
                  <li>
                    <a
                      onClick={() => {
                        dispatch(handleLogout()), navigate(URL_LOGIN);
                      }}
                    >
                      خروج از حساب کاربری
                    </a>
                  </li>
                </ul>
              </li>
            )}
            <li className={`${!auth && 'disable'}`}>
              <a>سفارشات</a>
            </li>
            <li>
              <a>تماس با ما</a>
            </li>
            <li>
              <a>درباره ما </a>
            </li>
          </ul>

          {messageCount > 0 && (
            <div className="login-box ml-2">
              <a onClick={() => navigate(URL_CONVERSATION)} className="alert-box">
                <div className="menu-item">
                  <span>{messageCount}</span>
                </div>
                <img
                  src={require(`@src/scss/images/icons/message-box.svg`)}
                  style={{ width: '26px', height: '26px', padding: '2px' }}
                  className=""
                />
              </a>
            </div>
          )}
          {messageBlogCount > 0 && checkRole('TECHNICIAN') && (
            <div className="login-box">
              <a onClick={() => navigate(URL_BLOG)} className="alert-box">
                <div className="menu-item">
                  <span>{messageBlogCount}</span>
                </div>
                <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M6.0278 8.63259L6.7517 8.82873L6.7517 8.82873L6.0278 8.63259ZM10.1584 4.30223L9.92711 3.58877L10.1584 4.30223ZM5.98297 8.79804L5.25907 8.6019L5.25907 8.6019L5.98297 8.79804ZM5.78956 12.8674L6.5288 12.7409V12.7409L5.78956 12.8674ZM5.81207 12.9989L5.07282 13.1255L5.07282 13.1255L5.81207 12.9989ZM6.28759 17.4572L6.43731 16.7223L6.28759 17.4572ZM6.65518 17.5321L6.8049 16.7971H6.8049L6.65518 17.5321ZM17.3448 17.5321L17.1951 16.7971H17.1951L17.3448 17.5321ZM17.7124 17.4572L17.8621 18.1921L17.7124 17.4572ZM18.1922 12.9737L18.9315 13.1003V13.1003L18.1922 12.9737ZM18.2161 12.8343L17.4769 12.7077V12.7077L18.2161 12.8343ZM18.0417 8.82624L17.3163 9.01657V9.01658L18.0417 8.82624ZM17.9793 8.58835L18.7047 8.39802V8.39802L17.9793 8.58835ZM13.9671 4.30838L14.2023 3.59621V3.59621L13.9671 4.30838ZM18.353 13.3008L17.9868 13.9553L18.353 13.3008ZM5.66797 13.2892L5.3088 12.6308L5.66797 13.2892ZM12.75 3C12.75 2.58579 12.4142 2.25 12 2.25C11.5858 2.25 11.25 2.58579 11.25 3H12.75ZM11.25 4.00474C11.25 4.41895 11.5858 4.75474 12 4.75474C12.4142 4.75474 12.75 4.41895 12.75 4.00474H11.25ZM9.0091 17.9034L9.09289 17.1581L8.19556 17.0572L8.26108 17.9578L9.0091 17.9034ZM14.9909 17.9034L15.7389 17.9578L15.8044 17.0572L14.9071 17.1581L14.9909 17.9034ZM14.9001 18.4772L15.6285 18.6563L14.9001 18.4772ZM14.8182 18.8106L14.0899 18.6315L14.8182 18.8106ZM12.7039 20.917L12.8784 21.6464H12.8784L12.7039 20.917ZM11.2961 20.917L11.1216 21.6464H11.1216L11.2961 20.917ZM9.18182 18.8106L8.45352 18.9896L9.18182 18.8106ZM9.09985 18.4772L9.82816 18.2981H9.82816L9.09985 18.4772ZM6.7517 8.82873C7.23925 7.02931 8.62052 5.58915 10.3896 5.01568L9.92711 3.58877C7.67951 4.31734 5.92499 6.14416 5.3039 8.43645L6.7517 8.82873ZM6.70687 8.99418L6.7517 8.82873L5.3039 8.43645L5.25907 8.6019L6.70687 8.99418ZM6.5288 12.7409C6.3153 11.4939 6.37608 10.215 6.70687 8.99418L5.25907 8.6019C4.87128 10.0331 4.80004 11.5322 5.05032 12.994L6.5288 12.7409ZM6.55131 12.8723L6.5288 12.7409L5.05032 12.994L5.07282 13.1255L6.55131 12.8723ZM5.25 15.2604C5.25 14.6932 5.56385 14.2003 6.02714 13.9476L5.3088 12.6308C4.38074 13.137 3.75 14.1251 3.75 15.2604H5.25ZM6.43731 16.7223C5.74893 16.582 5.25 15.9725 5.25 15.2604H3.75C3.75 16.6807 4.74616 17.9085 6.13787 18.1921L6.43731 16.7223ZM6.8049 16.7971L6.43731 16.7223L6.13787 18.1921L6.50547 18.267L6.8049 16.7971ZM17.1951 16.7971C13.7666 17.4956 10.2334 17.4956 6.8049 16.7971L6.50547 18.267C10.1316 19.0057 13.8684 19.0057 17.4945 18.267L17.1951 16.7971ZM17.5627 16.7223L17.1951 16.7971L17.4945 18.267L17.8621 18.1921L17.5627 16.7223ZM18.75 15.2604C18.75 15.9725 18.2511 16.582 17.5627 16.7223L17.8621 18.1921C19.2538 17.9085 20.25 16.6807 20.25 15.2604H18.75ZM17.9868 13.9553C18.4425 14.2103 18.75 14.6989 18.75 15.2604H20.25C20.25 14.1365 19.6319 13.157 18.7192 12.6463L17.9868 13.9553ZM17.4769 12.7077L17.453 12.8471L18.9315 13.1003L18.9554 12.9608L17.4769 12.7077ZM17.3163 9.01658C17.6323 10.2211 17.6871 11.4799 17.4769 12.7077L18.9554 12.9608C19.2017 11.5223 19.1375 10.0474 18.7672 8.63591L17.3163 9.01658ZM17.2539 8.77868L17.3163 9.01657L18.7672 8.63591L18.7047 8.39802L17.2539 8.77868ZM13.7319 5.02054C15.4622 5.592 16.7887 7.00574 17.2539 8.77868L18.7047 8.39802C18.1113 6.13594 16.4174 4.32779 14.2023 3.59621L13.7319 5.02054ZM10.3896 5.01568C11.474 4.66418 12.6528 4.66417 13.7319 5.02054L14.2023 3.59621C12.8171 3.13872 11.3114 3.14004 9.92711 3.58877L10.3896 5.01568ZM18.7192 12.6463C18.8626 12.7265 18.966 12.8988 18.9315 13.1003L17.453 12.8471C17.3735 13.3114 17.6116 13.7453 17.9868 13.9553L18.7192 12.6463ZM5.07282 13.1255C5.03579 12.9092 5.14712 12.719 5.3088 12.6308L6.02714 13.9476C6.39669 13.746 6.62845 13.3228 6.55131 12.8723L5.07282 13.1255ZM11.25 3V4.00474H12.75V3H11.25ZM8.92531 18.6487C10.9687 18.8784 13.0313 18.8784 15.0747 18.6487L14.9071 17.1581C12.9751 17.3753 11.0249 17.3753 9.09289 17.1581L8.92531 18.6487ZM15.6285 18.6563C15.6849 18.4268 15.7218 18.1932 15.7389 17.9578L14.2429 17.849C14.2319 18.0003 14.2081 18.1506 14.1718 18.2981L15.6285 18.6563ZM15.5465 18.9896L15.6285 18.6563L14.1718 18.2981L14.0899 18.6315L15.5465 18.9896ZM12.8784 21.6464C14.1945 21.3315 15.223 20.3052 15.5465 18.9896L14.0899 18.6315C13.8997 19.4047 13.2965 20.004 12.5294 20.1875L12.8784 21.6464ZM11.1216 21.6464C11.6991 21.7845 12.3009 21.7845 12.8784 21.6464L12.5294 20.1875C12.1813 20.2708 11.8187 20.2708 11.4706 20.1875L11.1216 21.6464ZM8.45352 18.9896C8.77701 20.3052 9.80549 21.3315 11.1216 21.6464L11.4706 20.1875C10.7035 20.004 10.1003 19.4047 9.91013 18.6315L8.45352 18.9896ZM8.37155 18.6563L8.45352 18.9896L9.91013 18.6315L9.82816 18.2981L8.37155 18.6563ZM8.26108 17.9578C8.2782 18.1932 8.31512 18.4268 8.37155 18.6563L9.82816 18.2981C9.79188 18.1506 9.76814 18.0003 9.75712 17.849L8.26108 17.9578Z"
                    fill="#363853"
                  />
                </svg>
              </a>
            </div>
          )}
        </div>
      </nav>
      <SideBar displayMenu={displayMenu} handleDisplayMenu={handleDisplayMenu} />
    </>
  );
};
export default Header;
