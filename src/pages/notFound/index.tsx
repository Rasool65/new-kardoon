import { FunctionComponent, useEffect } from 'react';
import { IPageProps } from '@src/configs/routerConfig/IPageProps';
import { RootStateType } from '@src/redux/Store';
import { useSelector } from 'react-redux';
import Footer from '@src/layout/Footer';

const NotFound: FunctionComponent<IPageProps> = ({ title }) => {
  const color = useSelector((state: RootStateType) => state.theme.color);
  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <>
      <div className="page-404 has-footer">
        <Footer />
        <div className="data-box">
          <img src={require(`@src/scss/images/icons/${color}-404-image.svg`)} alt="" />

          <div className="subtitle">متاسفم ، صفحه ی مور نظر پیدا نشد</div>
          <p>
            ما نتوانستیم صفحه ی مورد نظر شما را پیدا کنیم. شما میتوانید لیست صفحات را از{' '}
            <a href="https://kardoon.ir">منوی صفحه اصلی</a> مشاهده کنید.
          </p>
          <a href="https://tech.kardoon.ir/">www.tech.kardoon.ir</a>
        </div>
      </div>
    </>
  );
};

export default NotFound;
