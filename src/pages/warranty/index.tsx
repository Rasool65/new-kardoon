import { FunctionComponent, useEffect, useRef, useState } from 'react';
import { IPageProps } from '@src/configs/routerConfig/IPageProps';
import Select from 'react-select';
import { UtilsHelper } from '@src/utils/GeneralHelpers';
import { IHomeWarrantyProductsModelResult } from '@src/models/output/warranty/IHomeWarrantyProductsModelResult';
import useHttpRequest from '@src/hooks/useHttpRequest';
import { useToast } from '@src/hooks/useToast';
import { IOutputResult } from '@src/models/output/IOutputResult';
import {
  APIURL_GET_HOME_WARRANTY,
  APIURL_POST_ADD_HOME_WARRANTY,
  APIURL_POST_CALC_WARRANTY_ORDER_INFO,
} from '@src/configs/apiConfig/apiUrls';
import {
  IGetHomeWarrantyOrderInfo,
  IGetHomeWarrantyOrderInfoResultModel,
  IHomeWarrantyOrdersModelResult,
} from '@src/models/output/warranty/IHomeWarrantyOrdersModelResult';
import LoadingComponent from '@src/components/spinner/LoadingComponent';
import { useSelector } from 'react-redux';
import { RootStateType } from '@src/redux/Store';
import { ICalculationsHomeWarrantyOrderPrice } from './../../models/output/warranty/IHomeWarrantyOrdersModelResult';
import PrevHeader from '@src/layout/Headers/PrevHeader';
import { Button, Input, Spinner } from 'reactstrap';
import { resizeFile } from '@src/utils/ImageHelpers';

const Warranty: FunctionComponent<IPageProps> = ({ title }) => {
  const userData = useSelector((state: RootStateType) => state.authentication.userData);
  const httpRequest = useHttpRequest();
  const toast = useToast();
  const [homeWarrantyProducts, setHomeWarrantyProducts] = useState<IHomeWarrantyProductsModelResult[]>([]);
  const [OrderInfo, setOrderInfo] = useState<IGetHomeWarrantyOrderInfo[]>([]);
  const [calcResult, setCalcResult] = useState<ICalculationsHomeWarrantyOrderPrice>();
  const [loading, setLoading] = useState<boolean>(false);
  const selectRef = useRef<any>([]);

  const [imgSrcList, setImgSrcList] = useState<string[][]>([
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
  ]);
  // const [imageFile, setImageFile] = useState<any[][]>([[]]);

  const onImageFileChange = (e: any, row: number, col: number) => {
    debugger;
    const showfiles = e.target.files;
    ResizeAndSave(e, row);
    const reader = new FileReader();
    reader.onload = function () {
      debugger;
      let serviceTypeImg = [...imgSrcList[row], reader.result];
      // setImgSrcList([...imageSrc, imgSrcList]);
      setImgSrcList([imgSrcList[row], serviceTypeImg[serviceTypeImg.length + 1]]);
    };
    reader.readAsDataURL(showfiles[0]);
    // setImageDisplay('flex');
  };
  const ResizeAndSave = async (e: any, index: number) => {
    const file = e.target.files[0];
    await resizeFile(file).then((result: any) => {
      // setImageFile([...[...imageFile[index], result], imageFile[index]]);
    });
  };
  const GetWarrantyInfo = () => {
    setLoading(true);
    httpRequest.getRequest<IOutputResult<IHomeWarrantyProductsModelResult[]>>(APIURL_GET_HOME_WARRANTY).then((result) => {
      setHomeWarrantyProducts(result.data.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    GetWarrantyInfo();
  }, []);

  const handleRemove = (id: number) => {
    const updatedData = OrderInfo.filter((item) => item.productId !== id);
    setOrderInfo(updatedData);
  };

  const handleUpdateEstimated = (productId: number, value: number) => {
    const index = OrderInfo.findIndex((i) => i.productId === productId);
    if (index === -1) {
      // const inputSelectBox = document.getElementById(`estimated#${productId.toString()}`);
      toast.showError('ابتدا مورد تحت پوشش را انتخاب نمایید');
      //@ts-ignore
      // inputSelectBox!.currentTarget.value = ''; // free combo box
    } else {
      OrderInfo[index].estimatedValue = value;
    }
  };

  const handleUpdateActiveWarranty = (productId: number, value: boolean) => {
    const index = OrderInfo.findIndex((item) => item.productId === productId);
    if (index === -1) {
      const inputCheckBox = document.getElementById(`gaurantee#${productId.toString()}`);
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
        setCalcResult(result.data.data.calculations);
      });
  };
  const AddHomeWarranty = () => {
    if (OrderInfo.length < 3) return toast.showWarning('انتخاب حداقل 3 مورد اجباریست');
    setLoading(true);
    const body = {
      mobileNumber: userData?.userName,
      productList: OrderInfo,
    };
    httpRequest
      .postRequest<IOutputResult<IHomeWarrantyOrdersModelResult[]>>(APIURL_POST_ADD_HOME_WARRANTY, body)
      .then((result) => {
        debugger;
        setLoading(false);
        if (!result.data.isSuccess) return toast.showError(result.data.message);
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
          {/* <div className="col-12 col-lg-6">
            <div className="label-over-box">
              <Select isDisabled className="w-100 p-3" placeholder={'نوع خدمت'} />
              <label htmlFor="form1a" className="ml-2 space-nowrap">
                نوع خدمات
              </label>
            </div>
          </div>

          <div className="col-12 col-lg-6">
            <div className="label-over-box">
              <Select isDisabled className="w-100 p-3" placeholder={'گروه خدمات'} />
              <label htmlFor="form1a" className="ml-2 space-nowrap">
                گروه خدمات
              </label>
            </div>
          </div> */}
          <div className="col-12 col-lg-6">
            <div className="section-title">
              <span>موارد تحت پوشش</span>
            </div>
            {homeWarrantyProducts &&
              homeWarrantyProducts.length > 0 &&
              homeWarrantyProducts.map((item: IHomeWarrantyProductsModelResult, index: number) => {
                return (
                  <div id={`accordion${index}`} className={`warranty-selector-card close-box`}>
                    <div className="warranty-selector-header">
                      <div className="card-title">
                        <div>{item.title}</div>
                      </div>

                      <div className="toggle-center mr-auto ml-2">
                        <input
                          onChange={(e) => {
                            e.currentTarget.checked
                              ? (handleRemove(item.id),
                                //@ts-ignore
                                (document.getElementById(`gaurantee#${item.id.toString()}`)!.checked = false),
                                document.getElementById(`accordion${index}`)?.classList.add('close-box'),
                                selectRef.current[index].clearValue())
                              : //remove
                                (document.getElementById(`accordion${index}`)?.classList.remove('close-box'),
                                setOrderInfo([
                                  ...OrderInfo,
                                  {
                                    productId: item.id,
                                    activeWarranty: false,
                                    estimatedValue: 0,
                                    count: 1,
                                  },
                                ])); // add
                          }}
                          id={item.id?.toString()}
                          defaultChecked={true}
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
                              id={`estimated#${item.id}`}
                              onChange={(e) => {
                                e ? handleUpdateEstimated(item.id, e.value) : handleUpdateEstimated(item.id, 0);
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
                              id={`gaurantee#${item.id}`}
                              defaultChecked={false}
                              type="checkbox"
                              onChange={(e) => {
                                handleUpdateActiveWarranty(item.id, e.currentTarget.checked);
                                OrderInfo.length > 0 && GetCalcData();
                              }}
                            />
                          </div>
                        </li>

                        <div className="col-12 col-md-6 col-lg-4 upload-service-images">
                          <div className="service-image-item column-item">
                            <div className="d-flex justify-content-between w-100">
                              <img src={require(`@src/scss/images/icons/blue-camera-icon.svg`)} alt="" className="icon" />
                              <p className="title ml-auto"> تصاویر دستگاه </p>
                              <div className="imagebox" style={{ backgroundImage: "url('src/scss/images/4.jpg')" }}>
                                <label htmlFor={`"imgList"${index}`} className="upload-btn">
                                  <a className="upload-btn">
                                    <img src={require(`@src/scss/images/icons/upload.svg`)} />
                                  </a>
                                </label>
                                <Input
                                  onChange={(e) => {
                                    debugger;
                                    onImageFileChange(e, index);
                                  }}
                                  style={{ display: 'none' }}
                                  id={`"imgList"${index}`}
                                  type="file"
                                  accept="image/*"
                                />
                              </div>
                            </div>
                            <div className="image-gallery">
                              {imgSrcList[index] &&
                                imgSrcList[index].length > 0 &&
                                imgSrcList[index].map((item: string, index: number) => {
                                  return (
                                    <>
                                      <div className="imagebox" style={{ backgroundImage: `url(${item})` }}>
                                        <label htmlFor="" className="upload-btn">
                                          <a className="upload-btn"></a>
                                        </label>
                                        <a>
                                          {/* remove from array */}
                                          <img
                                            src={require(`@src/scss/images/icons/delete.svg`)}
                                            onClick={(e) => {
                                              setImgSrcList([...imgSrcList.slice(0, index), ...imgSrcList.slice(index + 1)]);
                                              // setImageFile([...imageFile.slice(0, index), ...imageFile.slice(index + 1)]);
                                            }}
                                          />
                                        </a>
                                      </div>
                                    </>
                                  );
                                })}
                            </div>
                          </div>
                        </div>

                        {/* <li className="upload-images active">
                          <span>آپلود تصاویر محصول</span>
                          <div className="upload-service-images">
                            <div className="service-image-item">
                              map
                              <div className="imagebox" style={{ backgroundImage: `url(${behindSrc})` }}>
                                <label htmlFor="behindd" className="upload-btn">
                                  <a className="upload-btn">{!behindSrc && 'رو'}</a>
                                </label>
                                <Input
                                  onChange={(e) => {
                                    // setBehindFiles(e.target.files);
                                    // ResizeAndSave(e, 'behind');
                                    const reader = new FileReader();
                                    reader.onload = function () {
                                      setBehindSrc(reader.result);
                                    };
                                    reader.readAsDataURL(e.target.files![0]);
                                  }}
                                  style={{ display: 'none' }}
                                  id="behindd"
                                  type="file"
                                  accept="image/*"
                                />
                                <a>
                                  {behindSrc && (
                                    <img
                                      src={require(`@src/scss/images/icons/delete.svg`)}
                                      onClick={() => {
                                        // setBehindSrc(undefined), setBehindFiles(undefined);
                                      }}
                                    />
                                  )}
                                </a>
                              </div>
                            </div>
                          </div>
                        </li> */}
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
                AddHomeWarranty();
              }}
            >
              {loading ? <Spinner /> : 'تسویه حساب'}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Warranty;
