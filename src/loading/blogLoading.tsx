import { FunctionComponent } from 'react';

interface BlogLoadingProps {}

const BlogLoading: FunctionComponent<BlogLoadingProps> = () => {
  return (
    <>
      <div className="skeleton-page">
        <div className="conversation">

          <div className="container">
            <div className="d-flex mt-4">
                <div className="bullet skeleton ml-2 mt-1"></div>
                <div className="title skeleton mr-0"></div>
            </div>
            <div className="d-flex align-items-center">
                <div className="circle skeleton mr-4"></div>
                <div className="mini-title skeleton mr-2 ml-auto mb-0"></div>
            </div>
            <div className="mr-4">
                <div className="text skeleton mt-4"></div>
                <div className="text skeleton mt-2"></div>
                <div className="text skeleton mt-2"></div>
                <div className="text skeleton mt-2"></div>
            </div>
            <div className="mini-title skeleton mt-4 ml-0"></div>
            <hr/>
            <div className="d-flex mt-4">
                <div className="bullet skeleton ml-2 mt-1"></div>
                <div className="title skeleton mr-0"></div>
            </div>
            <div className="d-flex align-items-center">
                <div className="circle skeleton mr-4"></div>
                <div className="mini-title skeleton mr-2 ml-auto mb-0"></div>
            </div>
            <div className="mr-4">
                <div className="text skeleton mt-4"></div>
                <div className="text skeleton mt-2"></div>
                <div className="text skeleton mt-2"></div>
                <div className="text skeleton mt-2"></div>
            </div>
            <div className="mini-title skeleton mt-4 ml-0"></div>
            <hr/>
            <div className="d-flex mt-4">
                <div className="bullet skeleton ml-2 mt-1"></div>
                <div className="title skeleton mr-0"></div>
            </div>
            <div className="d-flex align-items-center">
                <div className="circle skeleton mr-4"></div>
                <div className="mini-title skeleton mr-2 ml-auto mb-0"></div>
            </div>
            <div className="mr-4">
                <div className="text skeleton mt-4"></div>
                <div className="text skeleton mt-2"></div>
                <div className="text skeleton mt-2"></div>
                <div className="text skeleton mt-2"></div>
            </div>
            <div className="mini-title skeleton mt-4 ml-0"></div>
            <hr/>
            

          </div>
        </div>
      </div>
    </>
  );
};

export default BlogLoading;
