// import { FunctionComponent, useEffect, useRef, useState } from 'react';
// import { IPageProps } from '@src/configs/routerConfig/IPageProps';
// import Select from 'react-select';
// import { UtilsHelper } from '@src/utils/GeneralHelpers';
// import { IHomeWarrantyProductsModelResult } from '@src/models/output/warranty/IHomeWarrantyProductsModelResult';
// import useHttpRequest, { RequestDataType } from '@src/hooks/useHttpRequest';
// import { useToast } from '@src/hooks/useToast';
// import { IOutputResult } from '@src/models/output/IOutputResult';
// import {
//   APIURL_GET_HOME_WARRANTY,
//   APIURL_POST_ADD_HOME_WARRANTY,
//   APIURL_POST_CALC_WARRANTY_ORDER_INFO,
// } from '@src/configs/apiConfig/apiUrls';
// import {
//   IGetHomeWarrantyOrderInfo,
//   IGetHomeWarrantyOrderInfoResultModel,
//   IHomeWarrantyOrdersModelResult,
// } from '@src/models/output/warranty/IHomeWarrantyOrdersModelResult';
// import LoadingComponent from '@src/components/spinner/LoadingComponent';
// import { useSelector } from 'react-redux';
// import { RootStateType } from '@src/redux/Store';
// import { ICalculationsHomeWarrantyOrderPrice } from '../../models/output/warranty/IHomeWarrantyOrdersModelResult';
// import PrevHeader from '@src/layout/Headers/PrevHeader';
// import { Button, Input, Spinner } from 'reactstrap';
// import { resizeFile } from '@src/utils/ImageHelpers';

// const Warranty: FunctionComponent<IPageProps> = ({ title }) => {
//   const userData = useSelector((state: RootStateType) => state.authentication.userData);
//   const httpRequest = useHttpRequest();
//   const httpRequestFormData = useHttpRequest(RequestDataType.formData);
//   const toast = useToast();
//   const [homeWarrantyProducts, setHomeWarrantyProducts] = useState<IHomeWarrantyProductsModelResult[]>([]);
//   const [OrderInfo, setOrderInfo] = useState<IGetHomeWarrantyOrderInfo[]>([]);
//   const [calcResult, setCalcResult] = useState<ICalculationsHomeWarrantyOrderPrice>();
//   const [loading, setLoading] = useState<boolean>(false);
//   const selectRef = useRef<any>([]);
//   const [behindSrc, setBehindSrc] = useState<string[]>([]);
//   const [frontSrc, setFrontSrc] = useState<string[]>(['', '', '', '', '']);
//   const [leftSrc, setLeftSrc] = useState<string[]>([]);
//   const [rightSrc, setRightSrc] = useState<string[]>([]);
//   const [locationSrc, setLocationSrc] = useState<string[]>([]);
//   const [imgFiles, setImgFiles] = useState<any[][]>([
//     ['', '', '', '', ''],
//     ['', '', '', '', ''],
//     ['', '', '', '', ''],
//     ['', '', '', '', ''],
//     ['', '', '', '', ''],
//     ['', '', '', '', ''],
//   ]);

//   const updateImgFiles = (rowIndex: number, colIndex: number, newValue: string) => {
//     setImgFiles((prevList) => {
//       const newList = [...prevList];
//       newList[rowIndex][colIndex] = newValue;
//       return newList;
//     });
//   };

//   const deleteImgFiles = (rowIndex: number, colIndex: number) => {
//     setImgFiles((prevList) => {
//       const newList = [...prevList];
//       newList[rowIndex].splice(colIndex, 1);
//       return newList;
//     });
//   };

//   const ResizeAndSave = async (e: any, row: number, col: number) => {
//     const file = e.target.files[0];
//     await resizeFile(file).then((result: any) => {
//       updateImgFiles(row, col, file);
//     });
//   };

//   const GetWarrantyInfo = () => {
//     setLoading(true);
//     httpRequest
//       .getRequest<IOutputResult<IHomeWarrantyProductsModelResult[]>>(
//         // 'http://127.0.0.1:2500/getData'
//         APIURL_GET_HOME_WARRANTY
//       )
//       .then((result) => {
//         setHomeWarrantyProducts(result.data.data);
//         setLoading(false);
//       });
//   };

//   useEffect(() => {
//     GetWarrantyInfo();
//   }, []);

//   const handleRemove = (id: number) => {
//     const updatedData = OrderInfo.filter((item) => item.productId !== id);
//     setOrderInfo(updatedData);
//   };

//   const handleUpdateEstimated = (productId: number, value: number) => {
//     const index = OrderInfo.findIndex((i) => i.productId === productId);
//     if (index === -1) {
//       // const inputSelectBox = document.getElementById(`estimated#${productId.toString()}`);
//       toast.showError('ابتدا مورد تحت پوشش را انتخاب نمایید');
//       //@ts-ignore
//       // inputSelectBox!.currentTarget.value = ''; // free combo box
//     } else {
//       OrderInfo[index].estimatedValue = value;
//     }
//   };

//   const handleUpdateActiveWarranty = (productId: number, value: boolean) => {
//     const index = OrderInfo.findIndex((item) => item.productId === productId);
//     if (index === -1) {
//       const inputCheckBox = document.getElementById(`gaurantee#${productId.toString()}`);
//       //@ts-ignore
//       inputCheckBox!.checked = false;
//       toast.showError('ابتدا مورد تحت پوشش را انتخاب نمایید');
//     } else {
//       OrderInfo[index].activeWarranty = value;
//     }
//   };

//   const GetCalcData = () => {
//     setLoading(true);
//     httpRequest
//       .postRequest<IOutputResult<IGetHomeWarrantyOrderInfoResultModel>>(APIURL_POST_CALC_WARRANTY_ORDER_INFO, OrderInfo)
//       .then((result) => {
//         setLoading(false);
//         setCalcResult(result.data.data.calculations);
//       });
//   };
//   const AddHomeWarranty = () => {
//     if (OrderInfo.length < 3) return toast.showWarning('انتخاب حداقل 3 مورد اجباریست');
//     setLoading(true);
//     const formData = new FormData();
//     formData.append(`mobileNumber`, userData?.userName!);
//     debugger;
//     for (var i = 0; i < OrderInfo.length; i++) {
//       OrderInfo[i].front = imgFiles[i][0];
//       OrderInfo[i].behind = imgFiles[i][1];
//       OrderInfo[i].left = imgFiles[i][2];
//       OrderInfo[i].right = imgFiles[i][3];
//       OrderInfo[i].location = imgFiles[i][4];
//     }
//     OrderInfo.forEach((orderInfo: IGetHomeWarrantyOrderInfo, index: number) => {
//       formData.append(`activeWarranty[${index}]`, orderInfo.activeWarranty.toString());
//       formData.append(`count[${index}]`, orderInfo.count.toString());
//       formData.append(`estimatedValue[${index}]`, orderInfo.estimatedValue.toString());
//       formData.append(`productId[${index}]`, orderInfo.productId.toString());
//       formData.append(`productImage[${index}].front`, orderInfo.front);
//       formData.append(`productImage[${index}].behind`, orderInfo.behind);
//       formData.append(`productImage[${index}].left`, orderInfo.left);
//       formData.append(`productImage[${index}].right`, orderInfo.right);
//       formData.append(`productImage[${index}].location`, orderInfo.location);
//     });
//     debugger;
//     // const body = {
//     //   mobileNumber: userData?.userName,
//     //   productList: OrderInfo,
//     // };
//     httpRequestFormData
//       .postRequest<IOutputResult<IHomeWarrantyOrdersModelResult[]>>(APIURL_POST_ADD_HOME_WARRANTY, formData)
//       .then((result) => {
//         setLoading(false);
//         if (!result.data.isSuccess) return toast.showError(result.data.message);
//       });
//   };
//   useEffect(() => {
//     OrderInfo.length > 0 && GetCalcData();
//   }, [OrderInfo]);

//   return (
//     <>
//       <PrevHeader />
//       {loading && <LoadingComponent />}
//       <div className="home-warranty-selector">
//         <div className="row">
//           {/* <div className="col-12 col-lg-6">
//             <div className="label-over-box">
//               <Select isDisabled className="w-100 p-3" placeholder={'نوع خدمت'} />
//               <label htmlFor="form1a" className="ml-2 space-nowrap">
//                 نوع خدمات
//               </label>
//             </div>
//           </div>

//           <div className="col-12 col-lg-6">
//             <div className="label-over-box">
//               <Select isDisabled className="w-100 p-3" placeholder={'گروه خدمات'} />
//               <label htmlFor="form1a" className="ml-2 space-nowrap">
//                 گروه خدمات
//               </label>
//             </div>
//           </div> */}
//           <div className="col-12 col-lg-6">
//             <div className="section-title">
//               <span>موارد تحت پوشش</span>
//             </div>
//             {homeWarrantyProducts &&
//               homeWarrantyProducts.length > 0 &&
//               homeWarrantyProducts.map((item: IHomeWarrantyProductsModelResult, index: number) => {
//                 return (
//                   <div id={`accordion${index}`} className={`warranty-selector-card close-box`}>
//                     <div className="warranty-selector-header">
//                       <div className="card-title">
//                         <div>{item.title}</div>
//                       </div>

//                       <div className="toggle-center mr-auto ml-2">
//                         <input
//                           onChange={(e) => {
//                             e.currentTarget.checked
//                               ? (handleRemove(item.id),
//                                 //@ts-ignore
//                                 (document.getElementById(`gaurantee#${item.id.toString()}`)!.checked = false),
//                                 document.getElementById(`accordion${index}`)?.classList.add('close-box'),
//                                 selectRef.current[index].clearValue())
//                               : //remove
//                                 (document.getElementById(`accordion${index}`)?.classList.remove('close-box'),
//                                 setOrderInfo([
//                                   ...OrderInfo,
//                                   {
//                                     productId: item.id,
//                                     activeWarranty: false,
//                                     estimatedValue: 0,
//                                     count: 1,
//                                   },
//                                 ])); // add
//                           }}
//                           id={item.id?.toString()}
//                           defaultChecked={true}
//                           // disabled={item.isRequired}
//                           type="checkbox"
//                           className="toggle-checkbox form-check-input disable-toggle"
//                         />
//                       </div>
//                     </div>

//                     <div className="warranty-selector-details">
//                       <ul>
//                         <li>
//                           <span>ارزش پایه</span>
//                           <div> {UtilsHelper.threeDigitSeparator(item.baseValue)}</div>
//                         </li>
//                         <li>
//                           <span>خطرات بیمه ای</span>
//                           <div>{UtilsHelper.threeDigitSeparator(item.insuranceRisksValue)}</div>
//                         </li>
//                         <li>
//                           <span>خطرات گارانتی</span>
//                           <div>{UtilsHelper.threeDigitSeparator(item.warrantyRisksValue)}</div>
//                         </li>
//                         <li>
//                           <span>پوشش جامع</span>
//                           <div>{UtilsHelper.threeDigitSeparator(item.comprehensiveCoverageValue)}</div>
//                         </li>
//                         <li>
//                           <span>ارزش تخمینی</span>
//                           <div>
//                             <Select
//                               ref={(e) => (selectRef.current[index] = e)}
//                               id={`estimated#${item.id}`}
//                               onChange={(e) => {
//                                 e ? handleUpdateEstimated(item.id, e.value) : handleUpdateEstimated(item.id, 0);
//                                 OrderInfo.length > 0 && GetCalcData();
//                               }}
//                               defaultValue={item.estimatedValues[0]}
//                               options={item.estimatedValues}
//                               placeholder="ارزش تخمینی"
//                             />
//                           </div>
//                         </li>
//                         <li>
//                           <span>گارانتی فعال</span>
//                           <div>
//                             <input
//                               id={`gaurantee#${item.id}`}
//                               defaultChecked={false}
//                               type="checkbox"
//                               onChange={(e) => {
//                                 handleUpdateActiveWarranty(item.id, e.currentTarget.checked);
//                                 OrderInfo.length > 0 && GetCalcData();
//                               }}
//                             />
//                           </div>
//                         </li>
//                         <li className="upload-images active">
//                           <span>آپلود تصاویر محصول</span>
//                           <div className="upload-service-images">
//                             <div className="service-image-item">
//                               <div className="imagebox" style={{ backgroundImage: `url(${frontSrc[index]})` }}>
//                                 <label htmlFor={`"front"${index}`} className="upload-btn">
//                                   <a className="upload-btn">{!frontSrc[index] && 'رو'}</a>
//                                 </label>
//                                 <Input
//                                   onChange={(e) => {
//                                     //! front 0, behind = 1 , left = 2 , right = 3 , location = 4
//                                     ResizeAndSave(e, index, 0);
//                                     const reader = new FileReader();
//                                     reader.onload = function () {
//                                       setFrontSrc((prevSrc: any) => {
//                                         const updatedSrc = [...prevSrc];
//                                         updatedSrc[index] = reader.result;
//                                         return updatedSrc;
//                                       });
//                                     };
//                                     reader.readAsDataURL(e.target.files![0]);
//                                   }}
//                                   style={{ display: 'none' }}
//                                   id={`"front"${index}`}
//                                   type="file"
//                                   accept="image/*"
//                                 />
//                                 <a>
//                                   {frontSrc[index] && (
//                                     <img
//                                       src={require(`@src/scss/images/icons/delete.svg`)}
//                                       onClick={() => {
//                                         setFrontSrc((prevSrc: any) => {
//                                           const updatedSrc = [...prevSrc];
//                                           updatedSrc[index] = undefined;
//                                           return updatedSrc;
//                                         });
//                                         deleteImgFiles(index, 0);
//                                       }}
//                                     />
//                                   )}
//                                 </a>
//                               </div>

//                               <div className="imagebox" style={{ backgroundImage: `url(${behindSrc[index]})` }}>
//                                 <label htmlFor={`"behind"${index}`} className="upload-btn">
//                                   <a className="upload-btn">{!behindSrc[index] && 'پشت'}</a>
//                                 </label>
//                                 <Input
//                                   onChange={(e) => {
//                                     ResizeAndSave(e, index, 1);
//                                     const reader = new FileReader();
//                                     reader.onload = function () {
//                                       setBehindSrc((prevSrc: any) => {
//                                         const updatedSrc = [...prevSrc];
//                                         updatedSrc[index] = reader.result;
//                                         return updatedSrc;
//                                       });
//                                     };
//                                     reader.readAsDataURL(e.target.files![0]);
//                                   }}
//                                   style={{ display: 'none' }}
//                                   id={`"behind"${index}`}
//                                   type="file"
//                                   accept="image/*"
//                                 />
//                                 <a>
//                                   {behindSrc[index] && (
//                                     <img
//                                       src={require(`@src/scss/images/icons/delete.svg`)}
//                                       onClick={() => {
//                                         setBehindSrc((prevSrc: any) => {
//                                           const updatedSrc = [...prevSrc];
//                                           updatedSrc[index] = undefined;
//                                           return updatedSrc;
//                                         });
//                                         deleteImgFiles(index, 1);
//                                       }}
//                                     />
//                                   )}
//                                 </a>
//                               </div>

//                               <div className="imagebox" style={{ backgroundImage: `url(${leftSrc[index]})` }}>
//                                 <label htmlFor={`"left"${index}`} className="upload-btn">
//                                   <a className="upload-btn">{!leftSrc[index] && 'چپ'}</a>
//                                 </label>
//                                 <Input
//                                   onChange={(e) => {
//                                     ResizeAndSave(e, index, 2);
//                                     const reader = new FileReader();
//                                     reader.onload = function () {
//                                       setLeftSrc((prevSrc: any) => {
//                                         const updatedSrc = [...prevSrc];
//                                         updatedSrc[index] = reader.result;
//                                         return updatedSrc;
//                                       });
//                                     };
//                                     reader.readAsDataURL(e.target.files![0]);
//                                   }}
//                                   style={{ display: 'none' }}
//                                   id={`"left"${index}`}
//                                   type="file"
//                                   accept="image/*"
//                                 />
//                                 <a>
//                                   {leftSrc[index] && (
//                                     <img
//                                       src={require(`@src/scss/images/icons/delete.svg`)}
//                                       onClick={() => {
//                                         setLeftSrc((prevSrc: any) => {
//                                           const updatedSrc = [...prevSrc];
//                                           updatedSrc[index] = undefined;
//                                           return updatedSrc;
//                                         });
//                                         deleteImgFiles(index, 2);
//                                       }}
//                                     />
//                                   )}
//                                 </a>
//                               </div>

//                               <div className="imagebox" style={{ backgroundImage: `url(${rightSrc[index]})` }}>
//                                 <label htmlFor={`"right"${index}`} className="upload-btn">
//                                   <a className="upload-btn">{!rightSrc[index] && 'راست'}</a>
//                                 </label>
//                                 <Input
//                                   onChange={(e) => {
//                                     ResizeAndSave(e, index, 3);
//                                     const reader = new FileReader();
//                                     reader.onload = function () {
//                                       setRightSrc((prevSrc: any) => {
//                                         const updatedSrc = [...prevSrc];
//                                         updatedSrc[index] = reader.result;
//                                         return updatedSrc;
//                                       });
//                                     };
//                                     reader.readAsDataURL(e.target.files![0]);
//                                   }}
//                                   style={{ display: 'none' }}
//                                   id={`"right"${index}`}
//                                   type="file"
//                                   accept="image/*"
//                                 />
//                                 <a>
//                                   {rightSrc[index] && (
//                                     <img
//                                       src={require(`@src/scss/images/icons/delete.svg`)}
//                                       onClick={() => {
//                                         setRightSrc((prevSrc: any) => {
//                                           const updatedSrc = [...prevSrc];
//                                           updatedSrc[index] = undefined;
//                                           return updatedSrc;
//                                         });
//                                         deleteImgFiles(index, 3);
//                                       }}
//                                     />
//                                   )}
//                                 </a>
//                               </div>

//                               <div className="imagebox" style={{ backgroundImage: `url(${locationSrc[index]})` }}>
//                                 <label htmlFor={`"location"${index}`} className="upload-btn">
//                                   <a className="upload-btn">{!locationSrc[index] && 'موقعیت مکانی'}</a>
//                                 </label>
//                                 <Input
//                                   onChange={(e) => {
//                                     ResizeAndSave(e, index, 4);
//                                     const reader = new FileReader();
//                                     reader.onload = function () {
//                                       setLocationSrc((prevSrc: any) => {
//                                         const updatedSrc = [...prevSrc];
//                                         updatedSrc[index] = reader.result;
//                                         return updatedSrc;
//                                       });
//                                     };
//                                     reader.readAsDataURL(e.target.files![0]);
//                                   }}
//                                   style={{ display: 'none' }}
//                                   id={`"location"${index}`}
//                                   type="file"
//                                   accept="image/*"
//                                 />
//                                 <a>
//                                   {locationSrc[index] && (
//                                     <img
//                                       src={require(`@src/scss/images/icons/delete.svg`)}
//                                       onClick={() => {
//                                         setLocationSrc((prevSrc: any) => {
//                                           const updatedSrc = [...prevSrc];
//                                           updatedSrc[index] = undefined;
//                                           return updatedSrc;
//                                         });
//                                         deleteImgFiles(index, 4);
//                                       }}
//                                     />
//                                   )}
//                                 </a>
//                               </div>
//                             </div>
//                           </div>
//                         </li>
//                       </ul>
//                     </div>
//                   </div>
//                 );
//               })}
//           </div>
//           <div className="col-12 col-lg-6 dashed">
//             <div className="warranty-selector-card total-price">
//               <div className="warranty-selector-header">
//                 <div className="card-title">
//                   <div>محاسبه قیمت</div>
//                 </div>
//               </div>

//               <div className="warranty-selector-details">
//                 <ul>
//                   <li>
//                     <span>تخفیف و کسورات</span>
//                     <div>{UtilsHelper.threeDigitSeparator(calcResult?.totalReductionValue)}</div>
//                   </li>
//                   <li>
//                     <span>مبلغ</span>
//                     <div>{UtilsHelper.threeDigitSeparator(calcResult?.totalPrice)}</div>
//                   </li>
//                   <li>
//                     <span>مالیات و عوارض</span>
//                     <div>{UtilsHelper.threeDigitSeparator(calcResult?.totalTax)}</div>
//                   </li>
//                   <li>
//                     <span>مبلغ قابل پرداخت</span>
//                     <div>{UtilsHelper.threeDigitSeparator(calcResult?.calculatePrice)}</div>
//                   </li>
//                 </ul>
//               </div>
//             </div>
//           </div>
//           <div className="col-12">
//             <div className="payment-price">
//               مبلغ : <span>{UtilsHelper.threeDigitSeparator(calcResult?.calculatePrice)}</span> تومان
//             </div>
//             <div className="select-time mb-4">
//               <div className="form-check ">
//                 <input className="form-check-input" type="checkbox" value="" id="check2" />
//                 <label className="form-check-label" htmlFor="check2">
//                   به اطلاع مشتری رسیده و مورد تایید است
//                 </label>
//               </div>
//             </div>
//             <Button
//               // disabled={addDisabled}
//               className="add-action-btn green-btn w-100"
//               onClick={() => {
//                 AddHomeWarranty();
//               }}
//             >
//               {loading ? <Spinner /> : 'تسویه حساب'}
//             </Button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Warranty;
