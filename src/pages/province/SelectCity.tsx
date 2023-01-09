import { FunctionComponent, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useHttpRequest from '@src/hooks/useHttpRequest';
import { IOutputResult } from '@src/models/output/IOutputResult';
import { APIURL_GET_CITIES, APIURL_GET_PROVINES } from '@src/configs/apiConfig/apiUrls';
import { useTranslation } from 'react-i18next';
import Select from 'react-select';
import { useSelector, useDispatch } from 'react-redux';
import { RootStateType } from '@src/redux/Store';
import { APIURL_UPDATE_RESIDENCE_CITY } from '../../configs/apiConfig/apiUrls';
import { updateUserData } from '@src/redux/reducers/authenticationReducer';
import { URL_MAIN } from '@src/configs/urls';
import { IProvinceResultModel } from '@src/models/output/countryDivision/IProvinceResultModel';
import { ICitiesResultModel } from '@src/models/output/countryDivision/ICitiesResultModel';

const SelectCity: FunctionComponent = (props) => {
  const userData = useSelector((state: RootStateType) => state.authentication.userData);
  const auth = useSelector((state: RootStateType) => state.authentication.isAuthenticate);
  const [result, setResult] = useState<any>();
  const httpRequest = useHttpRequest();
  const [open, setOpen] = useState<boolean>();
  const { t }: any = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const GetProvincesList = () => {
    httpRequest.getRequest<IOutputResult<IProvinceResultModel>>(`${APIURL_GET_PROVINES}?ParentId=1`).then((result) => {
      setResult(result.data.data);
    });
  };

  const GetCitiesList = (provinesId: number) => {
    provinesId &&
      httpRequest.getRequest<IOutputResult<ICitiesResultModel>>(`${APIURL_GET_CITIES}?ParentId=${provinesId}`).then((result) => {
        setResult(result.data.data);
      });
  };

  const UpdateResidenceCity = (userId: number, cityId: number) => {
    const body = {
      userId: userId,
      cityId: cityId,
    };
    httpRequest.updateRequest<IOutputResult<any>>(APIURL_UPDATE_RESIDENCE_CITY, body).then((result) => {
      let NewProfile = { ...userData?.profile };
      NewProfile['residenceCityId'] = result.data.data.user.profile.residenceCityId;
      NewProfile['residenceCityName'] = result.data.data.user.profile.residenceCityName;
      let NewUserData = { ...userData };
      //@ts-ignore
      NewUserData['profile'] = NewProfile;
      dispatch(updateUserData(NewUserData));
      navigate(URL_MAIN);
      history.go(0);
    });
  };
  const onchange = (e: any) => {
    switch (e.length) {
      case 0:
        GetProvincesList();
        break;
      case 1:
        GetCitiesList(e[0].value);
        setOpen(true);
        break;
      case 2:
        auth
          ? UpdateResidenceCity(userData?.userId ? userData.userId : 0, e[1].value)
          : (localStorage.setItem('city', JSON.stringify(e[1])), navigate(URL_MAIN), history.go(0));
        break;
    }
  };
  useEffect(() => {
    GetProvincesList();
  }, []);

  return (
    <>
      <Select
        menuIsOpen={open}
        className="search-select"
        options={result}
        isSearchable={true}
        onChange={(e: any) => {
          onchange(e);
        }}
        placeholder={
          auth
            ? userData?.profile.residenceCityName
            : localStorage.getItem('city') && JSON.parse(localStorage.getItem('city')!).label
        }
        isMulti
      />
    </>
  );
};

export default SelectCity;
