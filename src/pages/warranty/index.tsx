import { FunctionComponent, useEffect, useState } from 'react';
import { IPageProps } from '@src/configs/routerConfig/IPageProps';
import useHttpRequest, { RequestDataType } from '@src/hooks/useHttpRequest';
import { useToast } from '@src/hooks/useToast';
import type { JSONSchema7 } from 'json-schema';
import LoadingComponent from '@src/components/spinner/LoadingComponent';
import { useSelector } from 'react-redux';
import { RootStateType } from '@src/redux/Store';
import PrevHeader from '@src/layout/Headers/PrevHeader';
import { useLocation } from 'react-router-dom';
import { Button, Spinner } from 'reactstrap';
import Form, { ISubmitEvent } from '@rjsf/core';
import { IOutputResult } from '@src/models/output/IOutputResult';
import { APIURL_GET_HOMEWARRANTY_PRODUCT } from '@src/configs/apiConfig/apiUrls';
import { IGetHomeWarrantyResultModel } from '@src/models/output/warranty/IGetHomeWarrantyResultModel';
import { UtilsHelper } from '@src/utils/GeneralHelpers';

const Warranty: FunctionComponent<IPageProps> = ({ title }) => {
  const httpRequestFormData = useHttpRequest(RequestDataType.formData);
  const toast = useToast();
  const color = useSelector((state: RootStateType) => state.theme.color);
  const userData = useSelector((state: RootStateType) => state.authentication.userData);
  const [loading, setLoading] = useState<boolean>(false);
  const [homeWarranties, setHomeWarranties] = useState<IGetHomeWarrantyResultModel[]>();
  const [schema, setSchema] = useState<JSONSchema7>();
  const [Uischema, setUiSchema] = useState<any>();
  const { state }: any = useLocation();
  const httpRequest = useHttpRequest();
  const [progress, setProgress] = useState<number>();
  const [submitForm, setSubmitForm] = useState<any[]>([]);

  const GetFormSchema = () => {
    setLoading(true);
    httpRequest
      .getRequest<IOutputResult<IGetHomeWarrantyResultModel[]>>(
        'http://127.0.0.1:2500/getData'
        // `${APIURL_GET_HOMEWARRANTY_PRODUCT}?requestDetailId=${state.requestDetailId}`
      )
      .then((result) => {
        setHomeWarranties(result.data.data);
        // setUiSchema(uischema);
        setLoading(false);
      });
  };

  useEffect(() => {
    document.title = title;
  }, [title]);

  const onSubmit = (data: ISubmitEvent<unknown>, actionId: number) => {
    debugger;
    const body = {
      data,
      actionId,
    };
    setSubmitForm([...submitForm, body]);
    //add to Home Warranty list [data , actionId}]
  };

  useEffect(() => {
    GetFormSchema();
  }, []);

  return (
    <>
      <PrevHeader />
      {loading ? (
        <>
          <LoadingComponent />
        </>
      ) : (
        <div className="home-warranty-selector">
          <div className="section-title">
            <span>موارد تحت پوشش</span>
          </div>
          {homeWarranties &&
            homeWarranties.length > 0 &&
            homeWarranties.map((homeWarranty: IGetHomeWarrantyResultModel, index: number) => {
              return (
                <>
                  <div
                    id={`accordion${index}`}
                    className={`warranty-selector-card warranty-selector-parent ${!homeWarranty.required && 'close-box'}`}
                  >
                    <div
                      className="warranty-selector-header"
                      onClick={(e) => {
                        document.getElementById(`accordion${index}`)?.classList.contains('close-box')
                          ? document.getElementById(`accordion${index}`)?.classList.remove('close-box')
                          : document.getElementById(`accordion${index}`)?.classList.add('close-box');
                      }}
                    >
                      <div className="card-title">
                        <div>{homeWarranty.title}</div>
                      </div>
                    </div>
                    <div className="warranty-selector-details">
                      <Form
                        schema={homeWarranty.propValues}
                        uiSchema={Uischema}
                        onSubmit={(e: any) => onSubmit(e.formData, homeWarranty.actionId)}
                      >
                        <Button className="btn btn-info w-100" type="submit">
                          + افزودن
                        </Button>
                      </Form>
                    </div>
                  </div>
                </>
              );
            })}
          <div className="col-12">
            <div className="payment-price">
              {' '}
              250,000,000 تومان
              {/* مبلغ : <span>{UtilsHelper.threeDigitSeparator(calcResult?.calculatePrice)}</span> تومان */}
            </div>
            <div className="select-time mb-4">
              <div className="form-check ">
                <input className="form-check-input" type="checkbox" value="" id="check2" />
                <label className="form-check-label" htmlFor="check2">
                  به اطلاع مشتری رسیده و مورد تایید است
                </label>
              </div>
            </div>
            <Button
              // disabled={addDisabled}
              className="add-action-btn green-btn w-100"
              onClick={() => {
                // AddHomeWarranty();
              }}
            >
              {loading ? <Spinner /> : 'تسویه حساب'}
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default Warranty;
