import { FunctionComponent, useEffect, useRef, useState } from 'react';
import { IPageProps } from '@src/configs/routerConfig/IPageProps';
import Select from 'react-select';
import { UtilsHelper } from '@src/utils/GeneralHelpers';
import { IHomeWarrantyProductsModelResult, IProductTagList } from '@src/models/output/warranty/IHomeWarrantyProductsModelResult';
import useHttpRequest, { RequestDataType } from '@src/hooks/useHttpRequest';
import { useToast } from '@src/hooks/useToast';
import { IOutputResult } from '@src/models/output/IOutputResult';
import * as uuid from 'uuid';
import {
  APIURL_GET_HOME_WARRANTY,
  APIURL_POST_ADD_HOME_WARRANTY,
  APIURL_POST_ADD_HOME_WARRANTY_ACTION_LIST,
  APIURL_POST_CALC_WARRANTY_ORDER_INFO,
} from '@src/configs/apiConfig/apiUrls';
import {
  IGetHomeWarrantyOrderInfo,
  IGetHomeWarrantyOrderInfoResultModel,
  IHomeWarrantyOrdersModelResult,
  IImagesHomeWarranty,
} from '@src/models/output/warranty/IHomeWarrantyOrdersModelResult';
import LoadingComponent from '@src/components/spinner/LoadingComponent';
import { useSelector } from 'react-redux';
import { RootStateType } from '@src/redux/Store';
import { ICalculationsHomeWarrantyOrderPrice } from './../../models/output/warranty/IHomeWarrantyOrdersModelResult';
import PrevHeader from '@src/layout/Headers/PrevHeader';
import { Button, Input, Spinner } from 'reactstrap';
import { resizeFile } from '@src/utils/ImageHelpers';
import { useLocation } from 'react-router-dom';

const Warranty: FunctionComponent<IPageProps> = ({ title }) => {
  const userData = useSelector((state: RootStateType) => state.authentication.userData);
  const { state }: any = useLocation();
  const httpRequest = useHttpRequest();
  const httpRequestFormData = useHttpRequest(RequestDataType.formData);
  const toast = useToast();
  const [homeWarrantyProducts, setHomeWarrantyProducts] = useState<IHomeWarrantyProductsModelResult[]>([]);
  const [OrderInfo, setOrderInfo] = useState<IGetHomeWarrantyOrderInfo[]>([]);
  const [calcResult, setCalcResult] = useState<ICalculationsHomeWarrantyOrderPrice>();
  const [loading, setLoading] = useState<boolean>(false);
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const selectRef = useRef<any>([]);
  const [btnDisabled, setBtnDisabled] = useState<boolean>(true);
  const [imgFiles, setImgFiles] = useState<any[][]>([]);
  const [imgSrc, setImgSrc] = useState<string[][]>([]);
  const [imgTags, setImgTags] = useState<number[][]>([]);
  const [imgDescription, setImgDescription] = useState<string[][]>([]);
  const [progress, setProgress] = useState<number>();

  const updateImgFiles = (rowIndex: number, colIndex: number, newValue: string) => {
    setImgFiles((prevList) => {
      const newList = [...prevList];
      newList[rowIndex][colIndex] = newValue;
      return newList;
    });
  };

  const updateImgTags = (rowIndex: number, colIndex: number, newValue: number, newLabel: string) => {
    setImgTags((prevList) => {
      const newList = [...prevList];
      newList[rowIndex][colIndex] = newValue;
      return newList;
    });
    setImgDescription((prevList) => {
      const newList = [...prevList];
      newList[rowIndex][colIndex] = newLabel;
      return newList;
    });
  };

  const deleteImgFiles = (rowIndex: number, colIndex: number) => {
    setImgFiles((prevList) => {
      const newList = [...prevList];
      newList[rowIndex].splice(colIndex, 1, '');
      return newList;
    });
    setImgSrc((prevList) => {
      const newList = [...prevList];
      newList[rowIndex].splice(colIndex, 1, '');
      return newList;
    });
  };

  const ResizeAndSave = async (e: any, row: number, col: number) => {
    const file = e.target.files[0];
    await resizeFile(file).then((result: any) => {
      updateImgFiles(row, col, file);
    });
  };
  const config = {
    onUploadProgress: (progressEvent: any) => setProgress(Math.round((100 * progressEvent.loaded) / progressEvent.total)),
  };
  const GetWarrantyInfo = () => {
    setLoading(true);
    httpRequest
      .getRequest<IOutputResult<IHomeWarrantyProductsModelResult[]>>(
        // 'http://127.0.0.1:2500/getData'
        `${APIURL_GET_HOME_WARRANTY}?requestDetailId=${state.requestDetailId}`
      )
      .then((result) => {
        result.data.data.forEach((element) => {
          imgSrc.push(Array(element.productTagList.length).fill(''));
          imgFiles.push(Array(element.productTagList.length).fill(''));
          imgTags.push(Array(element.productTagList.length).fill(''));
          imgDescription.push(Array(element.productTagList.length).fill(''));
          result.data.data.forEach((items: IHomeWarrantyProductsModelResult, rowIndex: number) => {
            items.productTagList.forEach((item: IProductTagList, colIndex: number) => {
              updateImgTags(rowIndex, colIndex, item.value, item.label);
            });
          });
        });
        //! add uuid !!
        var newResult = result.data.data;
        newResult.forEach((element) => {
          element.uuid = uuid.v4();
        });
        setHomeWarrantyProducts(newResult);
        //! if required fill up array
        result.data.data &&
          result.data.data.length > 0 &&
          result.data.data.map((items: IHomeWarrantyProductsModelResult, index: number) => {
            items.required &&
              OrderInfo.push({
                uuid: items.uuid!,
                actionId: items.actionId,
                productId: items.id,
                activeWarranty: false,
                estimatedValue: 0,
                count: 1,
                priceAfterReduction_Addition: 0,
              });
          });
        setLoading(false);
      });
  };

  useEffect(() => {
    GetWarrantyInfo();
  }, []);

  const handleRemove = (uuid: string) => {
    const updatedData = OrderInfo.filter((item) => item.uuid !== uuid);
    setOrderInfo(updatedData);
  };

  const handleUpdateEstimated = (uuid: string, value: number) => {
    const index = OrderInfo.findIndex((i) => i.uuid === uuid);
    if (index === -1) {
      // const inputSelectBox = document.getElementById(`estimated#${productId.toString()}`);
      toast.showError('ابتدا مورد تحت پوشش را انتخاب نمایید');
      //@ts-ignore
      // inputSelectBox!.currentTarget.value = ''; // free combo box
    } else {
      OrderInfo[index].estimatedValue = value;
    }
  };

  const handleUpdateActiveWarranty = (uuid: string, value: boolean) => {
    const index = OrderInfo.findIndex((item) => item.uuid === uuid);
    if (index === -1) {
      const inputCheckBox = document.getElementById(`gaurantee#${uuid.toString()}`);
      //@ts-ignore
      inputCheckBox!.checked = false;
      toast.showError('ابتدا مورد تحت پوشش را انتخاب نمایید');
    } else {
      OrderInfo[index].activeWarranty = value;
    }
  };

  const GetCalcData = () => {
    setLoading(true);
    httpRequest
      .postRequest<IOutputResult<IGetHomeWarrantyOrderInfoResultModel>>(APIURL_POST_CALC_WARRANTY_ORDER_INFO, OrderInfo)
      .then((result) => {
        setLoading(false);
        if (!result.data.isSuccess) return toast.showError(result.data.message);
        result.data.data.products.forEach((element, index: number) => {
          OrderInfo[index].priceAfterReduction_Addition = element.priceAfterReduction_Addition;
        });
        setCalcResult(result.data.data.calculations);
      });
  };

  useEffect(() => {
    document.title = title;
  }, [title]);

  const AddHomeWarranty = () => {
    if (OrderInfo.length < 3) return toast.showWarning('انتخاب حداقل 3 مورد اجباریست');
    const updateImgFiles = imgFiles.filter((row) => row.some((e) => e !== ''));
    setBtnLoading(true);
    const formData = new FormData();
    formData.append(`id`, state.requestDetailId);
    OrderInfo.forEach((orderInfo: IGetHomeWarrantyOrderInfo, index: number) => {
      formData.append(`action[${index}]`, orderInfo.actionId.toString());
      formData.append(`price[${index}]`, orderInfo.priceAfterReduction_Addition.toString());
      formData.append(`count[${index}]`, orderInfo.count.toString());
      formData.append(`estimatedValue[${index}]`, orderInfo.estimatedValue.toString());
      formData.append(`discountAmount[${index}]`, '0');
      formData.append(`sourceCost[${index}]`, '0'); //! consumer
      for (var col = 0; col < updateImgFiles[index].length; col++) {
        formData.append(`files[${index}].images[${col}].file`, updateImgFiles[index][col]);
        formData.append(`files[${index}].images[${col}].fileType`, 'image');
        formData.append(`files[${index}].tag[${col}]`, imgTags[index][col].toString());
        formData.append(`files[${index}].description[${col}]`, imgDescription[index][col]);
      }
    });
    httpRequestFormData
      .postRequest<IOutputResult<IHomeWarrantyOrdersModelResult[]>>(
        APIURL_POST_ADD_HOME_WARRANTY_ACTION_LIST,
        formData,
        () => {},
        config
      )
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
    OrderInfo.length > 0 && GetCalcData();
  }, [OrderInfo]);

  return (
    <>
      <PrevHeader />
      {loading && <LoadingComponent />}
      <div className="home-warranty-selector">
        <div className="row">
          <div className="col-12 col-lg-6">
            <div className="section-title">
              <span>موارد تحت پوشش</span>
            </div>
            {homeWarrantyProducts &&
              homeWarrantyProducts.length > 0 &&
              homeWarrantyProducts.map((item: IHomeWarrantyProductsModelResult, index: number) => {
                return (
                  <div id={`accordion${index}`} className={`warranty-selector-card ${!item.required && 'close-box'}`}>
                    <div className="warranty-selector-header">
                      <div className="card-title">
                        <div>{item.title}</div>
                      </div>

                      <div className="toggle-center mr-auto ml-2">
                        <input
                          onChange={(e) => {
                            e.currentTarget.checked
                              ? (handleRemove(item.uuid!),
                                //@ts-ignore
                                (document.getElementById(`gaurantee#${item.uuid.toString()}`)!.checked = false),
                                document.getElementById(`accordion${index}`)?.classList.add('close-box'),
                                imgFiles[index].map((item, col) => {
                                  deleteImgFiles(index, col);
                                }),
                                selectRef.current[index].clearValue())
                              : //remove
                                (document.getElementById(`accordion${index}`)?.classList.remove('close-box'),
                                setOrderInfo([
                                  ...OrderInfo,
                                  {
                                    uuid: item.uuid!,
                                    actionId: item.actionId,
                                    productId: item.id,
                                    activeWarranty: false,
                                    estimatedValue: 0,
                                    count: 1,
                                    priceAfterReduction_Addition: 0,
                                  },
                                ])); // add
                          }}
                          id={item.uuid?.toString()}
                          defaultChecked={!item.required}
                          // disabled={item.isRequired}
                          type="checkbox"
                          className="toggle-checkbox form-check-input disable-toggle"
                        />
                      </div>
                    </div>

                    <div className="warranty-selector-details">
                      <ul>
                        <li>
                          <span>ارزش پایه</span>
                          <div> {UtilsHelper.threeDigitSeparator(item.baseValue)}</div>
                        </li>
                        <li>
                          <span>خطرات بیمه ای</span>
                          <div>{UtilsHelper.threeDigitSeparator(item.insuranceRisksValue)}</div>
                        </li>
                        <li>
                          <span>خطرات گارانتی</span>
                          <div>{UtilsHelper.threeDigitSeparator(item.warrantyRisksValue)}</div>
                        </li>
                        <li>
                          <span>پوشش جامع</span>
                          <div>{UtilsHelper.threeDigitSeparator(item.comprehensiveCoverageValue)}</div>
                        </li>
                        <li>
                          <span>ارزش تخمینی</span>
                          <div>
                            <Select
                              ref={(e) => (selectRef.current[index] = e)}
                              id={`estimated#${item.uuid}`}
                              onChange={(e) => {
                                e ? handleUpdateEstimated(item.uuid!, e.value) : handleUpdateEstimated(item.uuid!, 0);
                                OrderInfo.length > 0 && GetCalcData();
                              }}
                              defaultValue={item.estimatedValues[0]}
                              options={item.estimatedValues}
                              placeholder="ارزش تخمینی"
                            />
                          </div>
                        </li>
                        <li>
                          <span>گارانتی فعال</span>
                          <div>
                            <input
                              id={`gaurantee#${item.uuid}`}
                              defaultChecked={false}
                              type="checkbox"
                              onChange={(e) => {
                                handleUpdateActiveWarranty(item.uuid!, e.currentTarget.checked);
                                OrderInfo.length > 0 && GetCalcData();
                              }}
                            />
                          </div>
                        </li>
                        <li className="upload-images active">
                          <span>آپلود تصاویر محصول</span>
                          <div className="upload-service-images">
                            <div className="service-image-item">
                              {item.productTagList &&
                                item.productTagList.length > 0 &&
                                item.productTagList.map((imageTag: IProductTagList, col: number) => {
                                  return (
                                    <>
                                      <div className="imagebox" style={{ backgroundImage: `url(${imgSrc[index][col]})` }}>
                                        <label htmlFor={`"imageTag"${index}${col}`} className="upload-btn">
                                          <a className="upload-btn">{!imgSrc[index][col] && imageTag.label}</a>
                                        </label>
                                        <Input
                                          onChange={(e) => {
                                            ResizeAndSave(e, index, col);
                                            const reader = new FileReader();
                                            reader.onload = function () {
                                              setImgSrc((prevSrc: any) => {
                                                const updatedSrc = [...prevSrc];
                                                updatedSrc[index][col] = reader.result;
                                                return updatedSrc;
                                              });
                                            };
                                            reader.readAsDataURL(e.target.files![0]);
                                          }}
                                          style={{ display: 'none' }}
                                          id={`"imageTag"${index}${col}`}
                                          type="file"
                                          accept="image/*"
                                        />
                                        <a>
                                          {imgSrc[index][col] && (
                                            <img
                                              src={require(`@src/scss/images/icons/delete.svg`)}
                                              onClick={() => {
                                                setImgSrc((prevSrc: any) => {
                                                  const updatedSrc = [...prevSrc];
                                                  updatedSrc[index][col] = undefined;
                                                  return updatedSrc;
                                                });
                                                deleteImgFiles(index, col);
                                              }}
                                            />
                                          )}
                                        </a>
                                      </div>
                                    </>
                                  );
                                })}
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                );
              })}
          </div>
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
              <div
                className="form-check "
                onClick={() => {
                  setBtnDisabled(!btnDisabled);
                }}
              >
                <input className="form-check-input" type="checkbox" value="" id="check2" />
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
      </div>
    </>
  );
};

export default Warranty;
