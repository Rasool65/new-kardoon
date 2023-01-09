import { FunctionComponent, ComponentType, useState, useEffect } from 'react';
import { IPageProps } from '@src/configs/routerConfig/IPageProps';
import CurrentBlog from './CurrentBlog';
import ArchiveBlog from './ArchiveBlog';
import PrevHeader from '@src/layout/Headers/PrevHeader';
import FooterCard from '@src/layout/Footer';
import { useNotification } from '@src/hooks/useNotification';

export type IBlogTabs = {
  id: number;
  title: string;
  Component: ComponentType<any>;
};

const BlogTabs: IBlogTabs[] = [
  {
    id: 0,
    title: 'اخبار جدید',
    Component: CurrentBlog,
  },
  {
    id: 1,
    title: 'آرشیو اخبار',
    Component: ArchiveBlog,
  },
];

const Blog: FunctionComponent<IPageProps> = (props) => {
  const [active, setActive] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [CurrentTab, setCurrentTab] = useState(BlogTabs[activeTab]);
  const { getCountBlogMessage } = useNotification();
  const handleClickTab = (tabNumber: number) => {
    setActiveTab(tabNumber);
    setCurrentTab(BlogTabs[tabNumber]);
  };
  useEffect(() => {
    getCountBlogMessage();
  }, []);
  useEffect(() => {
    document.title = BlogTabs[activeTab].title;
    activeTab == 0 ? setActive(false) : setActive(true);
  }, [CurrentTab]);

  return (
    <>
      <PrevHeader />
      <FooterCard />
      <div className="container">
        <div className="px-2 w-100">
          <div className="account-box">
            <h4
              className={`account-item pointer ${!active && 'active'}`}
              onClick={() => {
                handleClickTab(0);
              }}
            >
              <a>اخبار جدید</a>
            </h4>
            <h4
              className={`account-item pointer ${active && 'active'}`}
              onClick={() => {
                handleClickTab(1);
              }}
            >
              <a>آرشیو خبرها</a>
            </h4>
          </div>
        </div>
      </div>
      <CurrentTab.Component handleClickTab={handleClickTab} />
    </>
  );
};

export default Blog;
