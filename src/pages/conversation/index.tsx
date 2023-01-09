import { FunctionComponent, useEffect, useState } from 'react';
import { IPageProps } from '@src/configs/routerConfig/IPageProps';
import { generatePath, useNavigate } from 'react-router-dom';
import { URL_CHAT } from './../../configs/urls';
import useHttpRequest from '@src/hooks/useHttpRequest';
import { IOutputResult } from '@src/models/output/IOutputResult';
import { ICategoryConversation } from './../../models/output/categoryConversation/ICategoryConversation';
import { APIURL_GET_CATEGORY_CONVERSATION } from '@src/configs/apiConfig/apiUrls';
import { useToast } from '@src/hooks/useToast';
import PrevHeader from '@src/layout/Headers/PrevHeader';
import { RootStateType } from '@src/redux/Store';
import { useSelector } from 'react-redux';
import ConversationLoading from '@src/loading/conversationLoading';

const Conversations: FunctionComponent<IPageProps> = (props) => {
  const color = useSelector((state: RootStateType) => state.theme.color);
  const [conversation, setConversation] = useState<ICategoryConversation[]>();
  const toast = useToast();
  const navigate = useNavigate();
  const httpRequest = useHttpRequest();
  const [loading, setLoading] = useState<boolean>(false);

  const GetCategories = () => {
    setLoading(true);
    httpRequest
      .getRequest<IOutputResult<ICategoryConversation[]>>(APIURL_GET_CATEGORY_CONVERSATION)
      .then((result) => {
        setConversation(result.data.data);
        setLoading(false);
      })
      .catch((result) => {
        toast.showError(result);
      });
  };

  const handleSearch = (e: any) => {
    let findData = conversation?.filter((el: any) => el.label.match(e.currentTarget.value));
    e.currentTarget.value ? setConversation(findData) : GetCategories();
  };
  useEffect(() => {
    GetCategories();
  }, []);

  useEffect(() => {
    document.title = props.title;
  }, [props.title]);
  return (
    <>
      {loading ? (
        <ConversationLoading />
      ) : (
        <div className="conversation message-header">
          <PrevHeader />
          <div className="container">
            <div className="page-content message-page">
              <div className="search-card mb-3">
                <div className="search-box">
                  <div className="saerch-icon">
                    <img
                      src={require(`@src/scss/images/icons/${color}-search3449-7ho.svg`)}
                      alt="search3449"
                      className="home-search2"
                    />
                  </div>
                  <input type="text" onChange={(e) => handleSearch(e)} className="search-input" placeholder="جستجو " />
                </div>
              </div>
              <div className="card after-search">
                <div className="content mb-n2 pb-2">
                  {conversation &&
                    conversation.length > 0 &&
                    conversation.map((item: ICategoryConversation, index: number) => {
                      return (
                        <div
                          onClick={() => navigate(generatePath(URL_CHAT, { id: item.value.toString() }))}
                          style={{ cursor: 'pointer', backgroundColor: 'aliceblue', borderRadius: '10px' }}
                          className="d-flex position-relative mb-4"
                        >
                          <div className="align-self-center me-auto m-2" style={{ fontWeight: 'bold' }}>
                            <h4 className="mb-n1 pt-1 font-600 font-16">{item.label}</h4>
                            <p className="mb-0 font-12"></p>
                          </div>
                          <div className="align-self-start ms-auto text-end m-2">
                            <span className="opacity-40 font-11"></span>
                            <br />
                            <span className="opacity-40 font-11"></span>
                            <br />
                            <span className="font-10 float-end"></span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Conversations;
