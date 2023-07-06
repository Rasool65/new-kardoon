import useHttpRequest, { RequestDataType } from '@src/hooks/useHttpRequest';
import Header from '@src/layout/Headers/Header';
import { IGetHomeWarrantyResultModel } from '@src/models/output/warranty/IGetHomeWarrantyResultModel';
import { RootStateType } from '@src/redux/Store';
import { UtilsHelper } from '@src/utils/GeneralHelpers';
import { FunctionComponent, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Spinner } from 'reactstrap';
import { IPageProps } from '@src/configs/routerConfig/IPageProps';
import { IOutputResult } from '@src/models/output/IOutputResult';
import { useToast } from '@src/hooks/useToast';
import type { JSONSchema7 } from 'json-schema';
import Form, { ISubmitEvent } from '@rjsf/core';
import { useLocation } from 'react-router-dom';
import {
  APIURL_GET_HOMEWARRANTY_PRODUCT,
  APIURL_POST_ADD_CONTROL_HOME_WARRANTY,
  APIURL_POST_CALC_WARRANTY_ORDER_INFO,
} from '@src/configs/apiConfig/apiUrls';
import { IHomeWarrantyProduct } from '@src/models/output/warranty/IHomeWarrantyProduct';
import * as uuid from 'uuid';
import {
  ICalculationsHomeWarrantyOrderPrice,
  IGetHomeWarrantyOrderInfoResultModel,
} from '@src/models/output/warranty/IHomeWarrantyOrdersModelResult';

const WarrantyDesign: FunctionComponent<IPageProps> = ({ title }) => {
  const httpRequestFormData = useHttpRequest(RequestDataType.formData);
  const toast = useToast();
  const color = useSelector((state: RootStateType) => state.theme.color);
  const userData = useSelector((state: RootStateType) => state.authentication.userData);
  const [loading, setLoading] = useState<boolean>(false);
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const [btnDisabled, setBtnDisabled] = useState<boolean>(true);
  const [homeWarranties, setHomeWarranties] = useState<IGetHomeWarrantyResultModel[]>();
  const { state }: any = useLocation();
  const [calcResult, setCalcResult] = useState<ICalculationsHomeWarrantyOrderPrice>();
  const httpRequest = useHttpRequest();
  const [progress, setProgress] = useState<number>();
  const buttonRef = useRef<any>([]);
  const formsRef = useRef<any>([]);
  const [products, setProducts] = useState<IHomeWarrantyProduct[]>([]);
  const [productBeforCalc, setProductBeforCalc] = useState<IProductCalc[]>([]);
  interface IProductCalc {
    id: string;
    productId: number;
    activeWarranty: boolean;
    estimatedValue: number;
    count: number;
  }

  const config = {
    onUploadProgress: (progressEvent: any) => setProgress(Math.round((100 * progressEvent.loaded) / progressEvent.total)),
  };

  const GetFormSchema = () => {
    setLoading(true);
    httpRequest
      .getRequest<IOutputResult<IGetHomeWarrantyResultModel[]>>(
        // 'http://127.0.0.1:2500/getData'
        `${APIURL_GET_HOMEWARRANTY_PRODUCT}?requestDetailId=${state.requestDetailId}`
      )
      .then((result) => {
        debugger;
        setHomeWarranties(result.data.data);
        setLoading(false);
      });
  };

  const handleRemove = (id: string) => {
    debugger;
    const updateProduct = products.filter((value) => value.id !== id);
    const updateProductBeforCalc = productBeforCalc.filter((value) => value.id !== id);
    setProducts(updateProduct);
    setProductBeforCalc(updateProductBeforCalc);

    getCalculation(updateProductBeforCalc);
  };

  const getCalculation = (updateProductBeforCalc: any) => {
    setLoading(true);
    httpRequest
      .postRequest<IOutputResult<IGetHomeWarrantyOrderInfoResultModel>>(
        APIURL_POST_CALC_WARRANTY_ORDER_INFO,
        updateProductBeforCalc
      )
      .then((result) => {
        setLoading(false);
        if (!result.data.isSuccess) return toast.showError(result.data.message);
        setCalcResult(result.data.data.calculations);
      });
  };

  useEffect(() => {
    document.title = title;
  }, [title]);

  const onSubmit = (data: ISubmitEvent<unknown>, actionId: number, productName: string, productId: number) => {
    debugger;
    const guid = uuid.v4();
    setLoading(true);
    const newProductBeforCalc = {
      id: guid,
      productId,
      //@ts-ignore
      estimatedValue: data.estimatedValue,
      //@ts-ignore
      activeWarranty: data.activeWarranty ?? false,
      count: 1,
    };
    setProductBeforCalc([...productBeforCalc, newProductBeforCalc]);
    debugger;
    httpRequest
      .postRequest<IOutputResult<IGetHomeWarrantyOrderInfoResultModel>>(
        APIURL_POST_CALC_WARRANTY_ORDER_INFO,
        productBeforCalc.concat(newProductBeforCalc)
      )
      .then((result) => {
        debugger;
        setLoading(false);
        if (!result.data.isSuccess) return toast.showError(result.data.message);
        const body: IHomeWarrantyProduct = {
          price: result.data.data.products[result.data.data.products.length - 1].price,
          actionId,
          id: guid,
          productId,
          //@ts-ignore
          estimatedValue: data.estimatedValue,
          //@ts-ignore
          activeWarranty: data.activeWarranty,
          title: productName,
          formGen: data,
          discountAmount: 0, //priceAfterReduction_Addition
          costSource: 0,
          count: 1,
        };
        setProducts([...products, body]);
        setCalcResult(result.data.data.calculations);
      });
  };

  const AddHomeWarranty = () => {
    if (products.length < 3) return toast.showWarning('انتخاب حداقل 3 مورد اجباریست');
    setBtnLoading(true);
    debugger;
    const body = {
      requestDetailId: state.requestDetailId,
      actionList: products,
    };
    httpRequest
      .postRequest<IOutputResult<any>>(APIURL_POST_ADD_CONTROL_HOME_WARRANTY, body, () => {}, config)
      .then((result) => {
        setBtnLoading(false);
        if (!result.data.isSuccess) return toast.showError(result.data.message);
        result.data.isSuccess && toast.showSuccess(result.data.message);
      })
      .catch(() => {
        setBtnLoading(false);
      });
  };
  useEffect(() => {
    GetFormSchema();
  }, []);
  return (
    <>
      <Header />
      <div className="container home-warranty-selector">
        <div className="account-box insurance-tabs">
          {homeWarranties &&
            homeWarranties.length > 0 &&
            homeWarranties.map((homeWarranty: IGetHomeWarrantyResultModel, index: number) => {
              return (
                <>
                  <h4
                    ref={(e) => (buttonRef.current[index] = e)}
                    className="account-item"
                    onClick={(e) => {
                      buttonRef.current.map((div: any) => {
                        div?.classList?.remove('active');
                      });
                      e.currentTarget.classList.add('active');
                      //* Forms
                      formsRef.current.map((div: any) => {
                        div?.classList?.remove('active');
                      });
                      formsRef.current[index]?.classList.add('active');
                    }}
                  >
                    <a style={{ cursor: 'pointer' }}>{homeWarranty.title}</a>
                  </h4>
                </>
              );
            })}
        </div>

        <div className="insurance-forms">
          {homeWarranties &&
            homeWarranties.length > 0 &&
            homeWarranties.map((homeWarranty: IGetHomeWarrantyResultModel, index: number) => {
              return (
                <>
                  <div ref={(e) => (formsRef.current[index] = e)} className="insurance-form">
                    {homeWarranty.propValues && homeWarranty.propsUISchema && (
                      <Form
                        schema={homeWarranty.propValues}
                        uiSchema={homeWarranty.propsUISchema}
                        onSubmit={(e: any) => onSubmit(e.formData, homeWarranty.actionId, homeWarranty.title, homeWarranty.id)}
                      >
                        <Button
                          className="btn btn-info w-100"
                          type="submit"
                          onClick={() => {
                            formsRef.current[index]?.classList.remove('active');
                          }}
                        >
                          + افزودن
                        </Button>
                      </Form>
                    )}
                  </div>
                </>
              );
            })}
        </div>
        {products && products.length > 0 && (
          <div className="col-12 col-lg-6 dashed">
            <div className="warranty-selector-card insurance-products-details">
              <div className="warranty-selector-header">
                <div className="card-title ">
                  <div>محصولات </div>
                  <div>قیمت </div>
                </div>
              </div>

              <div className="warranty-selector-details">
                <ul>
                  {products.map((product: IHomeWarrantyProduct, index: number) => {
                    return (
                      <>
                        <li>
                          <span>{product.title}</span>
                          <div>{UtilsHelper.threeDigitSeparator(product.price)}</div>
                          <img
                            onClick={() => handleRemove(product.id)}
                            className="pointer linked-device-removable "
                            width={50}
                            height={50}
                            src={require(`@src/scss/images/icons/${color}-delete.svg`)}
                            alt=""
                          />
                        </li>
                      </>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="col-12 col-lg-6 dashed">
          <div className="warranty-selector-card total-price">
            <div className="warranty-selector-header">
              <div className="card-title">
                <div>محاسبه قیمت</div>
              </div>
            </div>

            <div className="warranty-selector-details">
              <ul>
                <li>
                  <span>تخفیف و کسورات</span>
                  <div>{UtilsHelper.threeDigitSeparator(calcResult?.totalReductionValue)}</div>
                </li>
                <li>
                  <span>مبلغ</span>
                  <div>{UtilsHelper.threeDigitSeparator(calcResult?.totalPrice)}</div>
                </li>
                <li>
                  <span>مالیات و عوارض</span>
                  <div>{UtilsHelper.threeDigitSeparator(calcResult?.totalTax)}</div>
                </li>
                <li>
                  <span>مبلغ قابل پرداخت</span>
                  <div>{UtilsHelper.threeDigitSeparator(calcResult?.calculatePrice)}</div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="col-12">
          <div className="payment-price">
            مبلغ : <span>{UtilsHelper.threeDigitSeparator(calcResult?.calculatePrice)}</span> تومان
          </div>
          <div className="select-time mb-4">
            <div className="form-check ">
              <input
                className="form-check-input"
                type="checkbox"
                value=""
                id="check2"
                onClick={() => {
                  setBtnDisabled(!btnDisabled);
                }}
              />
              <label className="form-check-label" htmlFor="check2">
                به اطلاع مشتری رسیده و مورد تایید است
              </label>
            </div>
          </div>
          <Button
            disabled={btnDisabled}
            className={`add-action-btn green-btn w-100 progressbar ${btnLoading && 'active'}`}
            onClick={() => {
              AddHomeWarranty();
            }}
          >
            <span className="line" style={{ width: `${progress}%` }}></span>
            <span className="count-number">{progress}%</span>
            {loading ? <Spinner /> : 'تسویه حساب'}
          </Button>
        </div>
      </div>
    </>
  );
};

export default WarrantyDesign;
