import LoadingComponent from '@src/components/spinner/LoadingComponent';
import { APIURL_GET_PROVINES } from '@src/configs/apiConfig/apiUrls';
import { IPageProps } from '@src/configs/routerConfig/IPageProps';
import { URL_CITY } from '@src/configs/urls';
import useHttpRequest from '@src/hooks/useHttpRequest';
import { IProvinceResultModel } from '@src/models/output/countryDivision/IProvinceResultModel';
import { IOutputResult } from '@src/models/output/IOutputResult';
import { RootStateType } from '@src/redux/Store';
import { FunctionComponent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const ProvinceList: FunctionComponent<IPageProps> = ({ title }) => {
  const color = useSelector((state: RootStateType) => state.theme.color);
  const [loading, setLoading] = useState<boolean>(false);
  const [province, setProvince] = useState<IProvinceResultModel[]>();
  const httpRequest = useHttpRequest();
  const { t }: any = useTranslation();
  const navigate = useNavigate();

  const GetProvincesList = () => {
    setLoading(true);
    httpRequest
      .getRequest<IOutputResult<IProvinceResultModel[]>>(`${APIURL_GET_PROVINES}?ParentId=1`)
      .then((result) => {
        setProvince(result.data.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const handleSearch = (value: string) => {
    let findData = province?.filter((el: IProvinceResultModel) => el.label?.match(value));
    value ? setProvince(findData) : GetProvincesList();
  };
  useEffect(() => {
    GetProvincesList();
  }, []);
  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <>
      <div className="home-container">
        <div className="select-city">
          <div className="search-city">
            <div className="container">
              <h2>استان محل سکونت خود را انتخاب کنید.</h2>
              <div className="search-boxer">
                <input
                  dir="rtl"
                  onChange={(e) => handleSearch(e.target.value)}
                  className="sort-input"
                  type="text"
                  placeholder="انتخاب استان ..."
                />
                <a className="saerch-icon-sort">
                  <img src={require(`@src/scss/images/icons/${color}-search3449-7ho.svg`)} />
                </a>
              </div>
            </div>
          </div>
          <div className="container">
            <div className="city-item">
              <div className="title">همه استان ها</div>
              {loading ? (
                <LoadingComponent />
              ) : (
                <ul>
                  {province &&
                    province.length > 0 &&
                    province.map((city: IProvinceResultModel, index: number) => {
                      return (
                        <>
                          <li>
                            <a onClick={() => navigate(URL_CITY, { state: { city: city } })}>{city.label}</a>
                          </li>
                        </>
                      );
                    })}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProvinceList;
