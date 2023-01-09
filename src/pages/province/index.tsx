import { FunctionComponent, useEffect, useState } from 'react';
import IPageProps from '../../configs/routerConfig/IPageProps';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import useHttpRequest from '@src/hooks/useHttpRequest';
import { IProvinceResultModel } from '@src/models/output/countryDivision/IProvinceResultModel';
import { RootStateType } from '@src/redux/Store';
import { IOutputResult } from '@src/models/output/IOutputResult';
import { APIURL_GET_PROVINES } from '@src/configs/apiConfig/apiUrls';
import { URL_CITY, URL_PROVINCE_LIST } from '@src/configs/urls';
import LoadingComponent from '@src/components/spinner/LoadingComponent';

const Province: FunctionComponent<IPageProps> = (props) => {
  const [province, setProvince] = useState<IProvinceResultModel[]>();
  const [loading, setLoading] = useState<boolean>(false);

  const color = useSelector((state: RootStateType) => state.theme.color);
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
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    GetProvincesList();
  }, []);

  useEffect(() => {
    document.title = props.title;
  }, [props.title]);

  return (
    <>
      {loading ? (
        <LoadingComponent />
      ) : (
        <div className="body-city-selector">
          <img
            className="header-logo"
            src={require(`@src/scss/images/icons/${color}-kardoonfinallogo11i344-lw34.svg`)}
            alt="KardoonFinallogo11I344"
          />
          <div className="city-selector">
            <h2>شهر خود را انتخاب کنید</h2>

            <ul className="city-list">
              <li className="box">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <a
                  onClick={() => {
                    navigate(URL_CITY, { state: { city: province?.find((c) => c.label == 'تهران') } });
                  }}
                >
                  <img src={require(`@src/scss/images/icons/${color}-city-tehran.svg`)} alt="" />
                  <p>تهران</p>
                </a>
              </li>

              <li className="box">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <a
                  onClick={() => {
                    navigate(URL_CITY, {
                      state: { city: province?.find((c) => c.label == 'اصفهان') },
                    });
                  }}
                >
                  <img src={require(`@src/scss/images/icons/${color}-city-esfahan.svg`)} alt="" />
                  <p>اصفهان</p>
                </a>
              </li>

              <li className="box">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <a
                  onClick={() => {
                    navigate(URL_CITY, { state: { city: province?.find((c) => c.label == 'البرز') } });
                  }}
                >
                  <img src={require(`@src/scss/images/icons/${color}-city-karaj.svg`)} alt="" />
                  <p>کرج</p>
                </a>
              </li>

              <li className="box">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <a
                  onClick={() => {
                    navigate(URL_CITY, { state: { city: province?.find((c) => c.label == 'گیلان') } });
                  }}
                >
                  <img src={require(`@src/scss/images/icons/${color}-city-rasht.svg`)} alt="" />
                  <p>رشت</p>
                </a>
              </li>

              <li className="box">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <a
                  onClick={() => {
                    navigate(URL_CITY, { state: { city: province?.find((c) => c.label == 'فارس') } });
                  }}
                >
                  <img src={require(`@src/scss/images/icons/${color}-city-shiraz.svg`)} alt="" />
                  <p>شیراز</p>
                </a>
              </li>

              <li className="box">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <a
                  onClick={() => {
                    navigate(URL_CITY, { state: { city: province?.find((c) => c.label == 'آذربایجان شرقی') } });
                  }}
                >
                  <img src={require(`@src/scss/images/icons/${color}-city-tabriz.svg`)} alt="" />
                  <p>تبریز</p>
                </a>
              </li>

              <li className="box">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <a
                  onClick={() => {
                    navigate(URL_CITY, { state: { city: province?.find((c) => c.label == 'خراسان رضوی') } });
                  }}
                >
                  <img src={require(`@src/scss/images/icons/${color}-city-mashhad.svg`)} alt="" />
                  <p>مشهد</p>
                </a>
              </li>

              <li className="box">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <a
                  onClick={() => {
                    navigate(URL_CITY, { state: { city: province?.find((c) => c.label == 'خوزستان') } });
                  }}
                >
                  <img src={require(`@src/scss/images/icons/${color}-city-ahvaz.svg`)} alt="" />
                  <p>اهواز</p>
                </a>
              </li>

              <li className="box">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <a
                  onClick={() => {
                    navigate(URL_CITY, { state: { city: province?.find((c) => c.label == 'اردبیل') } });
                  }}
                >
                  <img src={require(`@src/scss/images/icons/city-ardabil.svg`)} alt="" />
                  <p>اردبیل</p>
                </a>
              </li>
            </ul>

            <a className="more-city-link" onClick={() => navigate(URL_PROVINCE_LIST)}>
              <svg
                width="24px"
                height="24px"
                viewBox="0 0 24 24"
                version="1.2"
                baseProfile="tiny"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M17.657 5.304c-3.124-3.073-8.189-3.073-11.313 0-3.124 3.074-3.124 8.057 0 11.13l5.656 5.565 5.657-5.565c3.124-3.073 3.124-8.056 0-11.13zm-5.657 8.195c-.668 0-1.295-.26-1.768-.732-.975-.975-.975-2.561 0-3.536.472-.472 1.1-.732 1.768-.732s1.296.26 1.768.732c.975.975.975 2.562 0 3.536-.472.472-1.1.732-1.768.732z" />
              </svg>
              سایر شهر ها ...
            </a>
          </div>
        </div>
      )}
    </>
  );
};

export default Province;
