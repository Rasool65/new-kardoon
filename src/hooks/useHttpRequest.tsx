import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { useAxios } from './useAxios';
import { useToast } from './useToast';
import { useNavigate } from 'react-router-dom';
import { useTokenAuthentication } from './useTokenAuthentication';
import { URL_LOGIN } from '@src/configs/urls';

export enum RequestDataType {
  json,
  formData,
  urlencoded,
}
let delayBetweenErrors: number;
let lastErrorTime: number = 0;

const useHttpRequest = (dataType: RequestDataType = RequestDataType.json) => {
  const navigate = useNavigate();
  const authToken = useTokenAuthentication();
  const { get, post, remove, put } = useAxios(dataType);
  const toast = useToast();

  const getRequest = <T extends object>(
    url: string,
    onError?: Function,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    return new Promise(async (resolve, reject) => {
      try {
        const res: AxiosResponse = await get<T>(url, {
          validateStatus: (status: number): boolean => {
            if (status == 500) return false;
            return true;
          },
          ...config,
        });
        delayBetweenErrors = Date.now() - lastErrorTime;
        lastErrorTime = Date.now();
        if (res.status >= 200 && res.status <= 204) resolve(res);
        else if (res.status == 401 && delayBetweenErrors > 500) {
          toast.showError('لطفا مجدد وارد حساب کاربری خود شوید');
          authToken.deleteLogoutToken();
          navigate(URL_LOGIN);
        } else {
          toast.showError(res.data.message);
          if (onError) onError(res);
          reject(res);
        }
      } catch (error: any) {
        toast.showError('خطای سرور');
        // toast.showError(error.message);
        reject(error);
      }
    });
  };

  const postRequest = <T extends object>(
    url: string,
    body: any,
    onError?: Function,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    return new Promise(async (resolve, reject) => {
      try {
        const res: AxiosResponse = await post<T>(url, body, {
          validateStatus: (status: number): boolean => {
            if (status == 500) return false;
            return true;
          },
          ...config,
        });
        if (res.status >= 200 && res.status <= 204) resolve(res);
        else if (res.status == 401 && delayBetweenErrors > 500) {
          toast.showError(res.data.message);
          reject(res);
          authToken.deleteLogoutToken();
          navigate(URL_LOGIN);
        } else {
          toast.showError(res.data.message);
          if (onError) onError(res);
          reject(res);
        }
      } catch (error: any) {
        // toast.showError(error.message);
        toast.showError('خطای سرور');
        reject(error);
      }
    });
  };

  const deleteRequest = <T extends object>(url: string, body?: any, onError?: Function): Promise<AxiosResponse<T>> => {
    return new Promise(async (resolve, reject) => {
      try {
        const res: AxiosResponse = await remove<T>(url, {
          validateStatus: (status: number): boolean => {
            if (status == 500) return false;
            return true;
          },
          data: body,
        });
        if (res.status >= 200 && res.status <= 204) resolve(res);
        else if (res.status == 401 && delayBetweenErrors > 500) {
          toast.showError('لطفا مجدد وارد حساب کاربری خود شوید');
          authToken.deleteLogoutToken();
          navigate(URL_LOGIN);
        } else {
          toast.showError(res.data.message);
          if (onError) onError(res);
          reject(res);
        }
      } catch (error: any) {
        toast.showError(error.message);
        toast.showError('خطای سرور');
        reject(error);
      }
    });
  };

  const updateRequest = <T extends object>(url: string, body?: any, onError?: Function): Promise<AxiosResponse<T>> => {
    return new Promise(async (resolve, reject) => {
      try {
        const res: AxiosResponse = await put<T>(url, body, {
          validateStatus: (status: number): boolean => {
            if (status == 500) return false;
            return true;
          },
        });
        if (res.status >= 200 && res.status <= 204) resolve(res);
        else if (res.status == 401 && delayBetweenErrors > 500) {
          toast.showError('لطفا مجدد وارد حساب کاربری خود شوید');
          authToken.deleteLogoutToken();
          navigate(URL_LOGIN);
        } else {
          toast.showError(res.data.message);
          if (onError) onError(res);
          reject(res);
        }
      } catch (error: any) {
        // toast.showError(error.message);
        toast.showError('خطای سرور');
        reject(error);
      }
    });
  };

  return {
    getRequest,
    postRequest,
    deleteRequest,
    updateRequest,
  };
};

export default useHttpRequest;
