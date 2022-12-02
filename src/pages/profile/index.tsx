import { FunctionComponent, ComponentType, useState, useEffect } from 'react';
import { IPageProps } from '@src/configs/routerConfig/IPageProps';
import Profile from './Profile';
import Wallet from './Wallet';
import { useLocation } from 'react-router-dom';

export type IProfileTabs = {
  id: number;
  name: string;
  Component: ComponentType<any>;
};

const ProfileTabs: IProfileTabs[] = [
  {
    id: 0,
    name: 'پروفایل کاریر',
    Component: Profile,
  },
  {
    id: 1,
    name: 'کیف پول کاربر',
    Component: Wallet,
  },
];

const UserAccount: FunctionComponent<IPageProps> = (props) => {
  const { state }: any = useLocation();
  const [activeTab] = useState<number>(state?.tabPage ? 1 : 0);
  const [CurrentTab, setCurrentTab] = useState(ProfileTabs[activeTab]);
  const handleClickTab = (tabNumber: number) => {
    setCurrentTab(ProfileTabs[tabNumber]);
  };

  useEffect(() => {
    document.title = props.title;
  }, [props.title]);

  return (
    <>
      <CurrentTab.Component handleClickTab={handleClickTab} />
    </>
  );
};

export default UserAccount;
