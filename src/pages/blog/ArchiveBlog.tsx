import { FunctionComponent, useEffect, useState } from 'react';
import parse from 'html-react-parser';
import useHttpRequest from '@src/hooks/useHttpRequest';
import { IBlogResultModel, IChangeList } from '@src/models/output/blog/IBlogResultModel';
import { IPageListOutputResult } from '@src/models/output/IPageListOutputResult';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Spinner } from 'reactstrap';
import { APIURL_GET_ARCHIVE_SYSTEM_MESSAGE } from '@src/configs/apiConfig/apiUrls';
import { DateHelper } from '@src/utils/dateHelper';
import BlogLoading from '@src/loading/blogLoading';
interface IArchiveBlog {}
const ArchiveBlog: FunctionComponent<IArchiveBlog> = () => {
  const httpRequest = useHttpRequest();
  const [loading, setLoading] = useState<boolean>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [changeList, setChangeList] = useState<IChangeList[]>([]);

  const GetArchiveBlog = (page: number) => {
    httpRequest
      .getRequest<IPageListOutputResult<IBlogResultModel>>(
        `${APIURL_GET_ARCHIVE_SYSTEM_MESSAGE}?PageNumber=${page}&RecordsPerPage=100`
      )
      .then((result) => {
        setLoading(false);
        result.data.data.changeList && result.data.data.changeList.length > 0
          ? (setChangeList(changeList?.concat(result.data.data.changeList)), setHasMore(true))
          : setHasMore(false);
      });
  };

  useEffect(() => {
    setLoading(true);
    GetArchiveBlog(pageNumber);
  }, []);
  return (
    <>
      {loading ? (
        <BlogLoading />
      ) : (
        <div className="container">
          <InfiniteScroll
            className="newslatter-box"
            dataLength={changeList?.length ? changeList?.length : 1}
            next={() => {
              setPageNumber(pageNumber + 1);
              GetArchiveBlog(pageNumber + 1);
            }}
            hasMore={hasMore!}
            loader={<Spinner style={{ position: 'fixed', top: '50%', left: '50%' }}>درحال بارگذاری...</Spinner>}
          >
            {changeList &&
              changeList.length > 0 &&
              changeList.map((item: IChangeList, index: number) => {
                return (
                  <>
                    {/* <li className="news-list force-news"> */}
                    <li className="news-list">
                      <div className="newslatter-descriptions-line">
                        <div className="newslatter-title">{item.title}</div>
                        <div className="newslatter-subtitle">
                          {item.summary}{' '}
                          <img src={require(`@src/scss/images/icons/newslatter.svg`)} className="newslatter-icon" />
                        </div>
                      </div>
                      <div className="newslatter-news">{parse(`${item.content}`)}</div>
                      <div className="news-create-date">{DateHelper.isoDateTopersian(item.issueDateTime)}</div>
                    </li>
                  </>
                );
              })}
          </InfiniteScroll>
        </div>
      )}
    </>
  );
};

export default ArchiveBlog;
