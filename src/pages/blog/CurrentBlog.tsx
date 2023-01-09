import { FunctionComponent, useEffect, useState } from 'react';
import parse from 'html-react-parser';
import useHttpRequest from '@src/hooks/useHttpRequest';
import { APIURL_GET_SYSTEM_MESSAGE } from '@src/configs/apiConfig/apiUrls';
import { IPageListOutputResult } from '@src/models/output/IPageListOutputResult';
import { IBlogResultModel, IChangeList } from '@src/models/output/blog/IBlogResultModel';
import { DateHelper } from '@src/utils/dateHelper';
import BlogLoading from '@src/loading/blogLoading';

interface ICurrentBlog {}

const CurrentBlog: FunctionComponent<ICurrentBlog> = () => {
  const httpRequest = useHttpRequest();
  const [currentBlog, setCurrentBlog] = useState<IBlogResultModel>();
  const [loading, setLoading] = useState<boolean>();

  const GetCurrentBlog = () => {
    httpRequest
      .getRequest<IPageListOutputResult<IBlogResultModel>>(`${APIURL_GET_SYSTEM_MESSAGE}?PageNumber=1&RecordsPerPage=100`)
      .then((result) => {
        setLoading(false);
        setCurrentBlog(result.data.data);
      });
  };

  useEffect(() => {
    setLoading(true);
    GetCurrentBlog();
  }, []);
  return (
    <>
      {loading ? (
        <BlogLoading />
      ) : (
        <div className="container">
          <ul className="newslatter-box">
            {/* <li className='force-news'> */}
            {currentBlog?.changeList &&
              currentBlog?.changeList.length > 0 &&
              currentBlog?.changeList.map((item: IChangeList, index: number) => {
                return (
                  <>
                    <li className="news-list">
                      <div className="newslatter-descriptions-line">
                        <div className="newslatter-title">{item.title}</div>
                        <div className="newslatter-subtitle">
                          {item.summary}
                          <img src={require(`@src/scss/images/icons/newslatter.svg`)} className="newslatter-icon" />
                        </div>
                      </div>
                      <div className="newslatter-news">{parse(`${item.content}`)}</div>
                      <div className="news-create-date">{DateHelper.isoDateTopersian(item.issueDateTime)}</div>
                    </li>
                  </>
                );
              })}
          </ul>
        </div>
      )}
    </>
  );
};

export default CurrentBlog;
