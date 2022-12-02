import { useToast } from '@src/hooks/useToast';
import { RootStateType } from '@src/redux/Store';
import { FunctionComponent, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import SideBar from './SideBar';

const PrevHeader: FunctionComponent = () => {
  const color = useSelector((state: RootStateType) => state.theme.color);
  const navigate = useNavigate();
  const toast = useToast();
  const auth = useSelector((state: RootStateType) => state.authentication.isAuthenticate);
  const [displayMenu, setDisplayMenu] = useState<boolean>(false);
  const handleDisplayMenu = () => {
    auth ? setDisplayMenu(!displayMenu) : toast.showError('لطفأ وارد شوید');
  };
  return (
    <>
      <nav>
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
          </a>        </div>
        <div className="login-box">
          <img
            src={require(`@src/scss/images/icons/${color}-back-icon.svg`)}
            onClick={() => {
              navigate(-1);
            }}
            alt="back-icon"
            className="login-icon"
          />
        </div>
      </nav>
      <SideBar displayMenu={displayMenu} handleDisplayMenu={handleDisplayMenu} />
    </>
  );
};

export default PrevHeader;
