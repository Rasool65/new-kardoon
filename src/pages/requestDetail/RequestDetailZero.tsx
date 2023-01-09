import Form, { AjvError, IChangeEvent, ISubmitEvent, UiSchema } from '@rjsf/core';
import { FunctionComponent, useEffect, useState } from 'react';
import { Button } from 'reactstrap';
import useHttpRequest from '@src/hooks/useHttpRequest';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootStateType } from '@src/redux/Store';
import { IOutputResult } from '@src/models/output/IOutputResult';
import { IRequestDetailPageProp } from './IRequestDetailProp';
import type { JSONSchema7 } from 'json-schema';
import { APIURL_GET_PRODUCTS_ATTRIBUTES } from '@src/configs/apiConfig/apiUrls';
import LoadingComponent from '@src/components/spinner/LoadingComponent';
import PrevHeader from '@src/layout/Headers/PrevHeader';

const RequestDetailZero: FunctionComponent<IRequestDetailPageProp> = ({ handleClickNextToFirst }) => {
  const cityId = useSelector((state: RootStateType) => state.authentication.userData?.profile.residenceCityId);
  const httpRequest = useHttpRequest();
  const userData = useSelector((state: RootStateType) => state.authentication.userData);
  const { t }: any = useTranslation();
  const { state }: any = useLocation();
  const [loading, setLoading] = useState<boolean>(false);
  const [schema, setSchema] = useState<JSONSchema7>();
  // const [Ui, setUi] = useState<UiSchema>();
  const checkRole = (normalizedName: string) => {
    return userData?.roles ? userData?.roles.some((roleName) => roleName.normalizedName === normalizedName) : false;
  };
  const GetFormSchema = () => {
    setLoading(true);
    httpRequest
      .getRequest<IOutputResult<JSONSchema7>>(
        `${APIURL_GET_PRODUCTS_ATTRIBUTES}?CityId=${cityId}&ProductId=${state.ProductId}&ServiceTypeId=${state.ServiceTypeId}`
      )
      .then((result) => {
        !checkRole('TECHNICIAN') && delete result.data.data.required;
        setSchema(result.data.data);
        !result.data.data && handleClickNextToFirst();
        setLoading(false);
      });
  };
  const uiSchema = {
    'ui:widget': 'checkboxes',
  };
  // const GetFormUI = () => {
  //   setLoading(true);
  //   httpRequest.getRequest<IOutputResult<UiSchema>>('http://127.0.0.1:2500/getFormUI').then((result) => {
  //     setUi(result.data.data);
  //     setLoading(false);
  //   });
  // };
  useEffect(() => {
    // GetFormUI();
    GetFormSchema();
  }, []);

  const onSubmit = (data: ISubmitEvent<unknown>) => {
    handleClickNextToFirst(data);
  };

  return (
    <>
      <PrevHeader />
      <div
        className="page-content request-details-1"
        style={{
          paddingBottom: '0px',
        }}
      >
        {/* <div className="page-title pointer">فرم ساز</div> */}

        <div className="container">
          <div className="card p-4 mt-4">
            {loading ? (
              <>
                <LoadingComponent />
              </>
            ) : (
              <div>
                {schema && (
                  <Form schema={schema} uiSchema={uiSchema} onSubmit={onSubmit}>
                    <Button className="btn btn-info w-100" type="submit">
                      ادامه
                    </Button>
                  </Form>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default RequestDetailZero;
