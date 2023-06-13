import { FunctionComponent, useEffect, useState } from 'react';
import PrevHeader from '@src/layout/Headers/PrevHeader';
import UAParser from 'ua-parser-js';
import { IOutputResult } from '@src/models/output/IOutputResult';
import { useToast } from '@src/hooks/useToast';
import useHttpRequest from '@src/hooks/useHttpRequest';
import { IGetTokenList } from '@src/models/output/profile/IGetTokenListResultModel';
import { APIURL_DELETE_TOKENS, APIURL_GET_TOKENS } from '@src/configs/apiConfig/apiUrls';
import LoadingComponent from '@src/components/spinner/LoadingComponent';
import { DateHelper } from '@src/utils/dateHelper';
import { useSelector } from 'react-redux';
import { RootStateType } from '@src/redux/Store';

interface ActiveSessionProps {}

const ActiveSession: FunctionComponent<ActiveSessionProps> = () => {
  const color = useSelector((state: RootStateType) => state.theme.color);
  const httpRequest = useHttpRequest();
  const toast = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const [tokens, setTokens] = useState<IGetTokenList[]>();
  const [currentUserAgent, setCurrentUserAgent] = useState<string>();

  const GetTokens = () => {
    setLoading(true);
    httpRequest
      .getRequest<IOutputResult<IGetTokenList[]>>(`${APIURL_GET_TOKENS}`)
      .then((result) => {
        setTokens(result.data.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const userAgentData = (userAgent: string) => {
    const parser = new UAParser();
    const result = parser.setUA(userAgent!).getResult();
    return result;
  };

  const deleteToken = (tokenGuid: string[]) => {
    setLoading(true);
    httpRequest
      .deleteRequest<IOutputResult<any>>(`${APIURL_DELETE_TOKENS}`, tokenGuid)
      .then((result) => {
        toast.showSuccess(result.data.message);
        GetTokens();
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    GetTokens();
    setCurrentUserAgent(navigator.userAgent.toLowerCase());
  }, []);

  return (
    <>
      <PrevHeader />
      <div>
        <div className="liked-devices-page">
          <div className="header-image">
            <img src={require(`@src/scss/images/${color}-linked-devices-header.png`)} alt="" className="liked-devices-header" />
          </div>
          <div className="liked-devices-section">
            <div className="liked-devices-title">سیستم فعال</div>
            <div className="liked-devices-details">
              <div className="icon">
                {userAgentData(currentUserAgent!).os.name == 'windows' && (
                  <img src={require('@src/scss/images/icons/windows.svg')} alt="" />
                )}
                {userAgentData(currentUserAgent!).os.name == 'iOS' && (
                  <img src={require('@src/scss/images/icons/ios.svg')} alt="" />
                )}
                {userAgentData(currentUserAgent!).os.name == 'android' && (
                  <img src={require('@src/scss/images/icons/android.svg')} alt="" />
                )}
              </div>
              <div>
                <div className="device-name">
                  {userAgentData(currentUserAgent!).device.type == 'mobile' ? 'موبایل' : 'دسکتاپ'}
                </div>
                <div className="device-subtile">{userAgentData(currentUserAgent!).browser.name}</div>
                <div className="device-position">
                  {DateHelper.isoDateTopersian(new Date())} - {DateHelper.splitTime(new Date().toString()).slice(5)}
                </div>
              </div>
            </div>
          </div>

          <div className="liked-devices-section">
            <a
              className="liked-devices-details"
              onClick={() => {
                tokens && deleteToken(tokens.map((item: IGetTokenList) => item.guid));
              }}
            >
              <div className="icon">
                <img src={require('@src/scss/images/icons/hand.svg')} alt="" />
              </div>
              <div>
                <div className="device-name master-color">خروج از تمامی دستگاه‌ها</div>
              </div>
            </a>
          </div>

          <div className="liked-devices-section border-none">
            <div className="liked-devices-title">دستگاه های فعال</div>
            {loading ? (
              <LoadingComponent />
            ) : (
              <div className="liked-devices-details">
                <ul>
                  {tokens &&
                    tokens.length > 0 &&
                    tokens.map((tokens: IGetTokenList, index: number) => {
                      return (
                        <>
                          <li className="liked-devices-details">
                            <div className="icon ">
                              {userAgentData(tokens.browserName!).os.name === 'Windows' && (
                                <img src={require('@src/scss/images/icons/windows.svg')} alt="" />
                              )}
                              {userAgentData(tokens.browserName!).os.name === 'Android' && (
                                <img src={require('@src/scss/images/icons/android.svg')} alt="" />
                              )}
                              {userAgentData(tokens.browserName!).os.name === 'iOS' && (
                                <img src={require('@src/scss/images/icons/ios.svg')} alt="" />
                              )}
                            </div>
                            <div className="device-details-section">
                              {/* <div className="device-name">Samsung GALAXY S20</div> */}
                              <div className="">
                                <div className="device-name">شماره توکن {tokens.id}</div>
                                <div className="device-subtile">{userAgentData(tokens.browserName!).browser.name}</div>
                                <div className="device-position">
                                  {DateHelper.splitTime(tokens.issueDateTime!)} -{' '}
                                  {DateHelper.isoDateTopersian(tokens.issueDateTime)}
                                </div>
                              </div>
                              <div>
                                <img
                                  className="pointer linked-device-removable "
                                  onClick={() => {
                                    deleteToken([tokens.guid]);
                                  }}
                                  width={50}
                                  height={50}
                                  src={require(`@src/scss/images/icons/${color}-delete.svg`)}
                                  alt=""
                                />
                              </div>
                            </div>
                          </li>
                        </>
                      );
                    })}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ActiveSession;
