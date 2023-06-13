import { IJwtConfig } from '@src/configs/jwt/IJwtConfig';
import jwtDefaultConfig from '@src/configs/jwt/jwtDefaultConfig';
import themeConfig from '@src/configs/theme/themeConfig';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosRequestHeaders, AxiosResponse } from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../configs/apiConfig/apiBaseUrl';
import { URL_LOGIN } from '../configs/urls';
import { RequestDataType } from './useHttpRequest';
import { useTokenAuthentication } from './useTokenAuthentication';

export const useAxios = (dataType: RequestDataType = RequestDataType.json) => {
  const navigate = useNavigate();
  const authToken = useTokenAuthentication();

  const jwtConfig: IJwtConfig = { ...jwtDefaultConfig };

  let instance: AxiosInstance;
  const token = authToken.getToken();

  let subscribers: any[] = [];
  var isAlreadyFetchingAccessToken = false;

  let headers: AxiosRequestHeaders = {};

  if (dataType == RequestDataType.json) {
    headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'accept-language': 'fa-IR',
    };
  } else if (dataType == RequestDataType.formData) {
    headers = {
      'Content-Type': 'multipart/form-data',
      'accept-language': 'fa-IR',
    };
  } else if (dataType == RequestDataType.urlencoded) {
    headers = {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      'accept-language': 'fa-IR',
    };
  }

  if (token && token != '') {
    headers['Authorization'] = `${jwtConfig.tokenType} ${token}`.trim();
  }

  instance = axios.create({
    withCredentials: false,
    baseURL: API_BASE_URL,
    headers,
  });

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      const { config, response } = error;
      const originalRequest = config;

      if (response && response.status === 401) {
        if (!themeConfig.app.useRefreshToken) {
          navigate(URL_LOGIN);
        }
        if (!isAlreadyFetchingAccessToken) {
          isAlreadyFetchingAccessToken = true;
          refreshToken().then((r) => {
            isAlreadyFetchingAccessToken = false;
            authToken.saveLoginToken(r.data.accessToken, r.data.refreshToken, 'currentTokenGuid');
            subscribers = subscribers.filter((callback) => callback(r.data.accessToken));
          });
        } else {
          navigate(URL_LOGIN);
        }
        const retryOriginalRequest = new Promise((resolve) => {
          addSubscriber((accessToken: string) => {
            originalRequest.headers.Authorization = `${jwtConfig.tokenType} ${accessToken}`;
            resolve(axios(originalRequest));
          });
        });
        return retryOriginalRequest;
      }
      return Promise.reject(error);
    }
  );

  const addSubscriber = (callback: any) => {
    subscribers.push(callback);
  };

  const refreshToken = () => {
    return axios.post(jwtConfig.refreshEndpoint, {
      refreshToken: authToken.getRefreshToken(),
    });
  };

  const get = <T extends object>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return instance.get<T>(url, config);
  };

  const post = <T extends object>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return instance.post<T>(url, data, config);
  };

  const put = <T extends object>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return instance.put<T>(url, data, config);
  };

  const remove = <T extends object>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return instance.delete<T>(url, config);
  };

  return {
    get,
    post,
    put,
    remove,
  };
};
