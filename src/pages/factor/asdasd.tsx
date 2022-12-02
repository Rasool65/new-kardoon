// import { APIURL_GET_FACTOR, APIURL_GET_SERVICES } from '@src/configs/apiConfig/apiUrls';
// import useHttpRequest from '@src/hooks/useHttpRequest';
// import { IFactorResultModel } from '@src/models/output/factor/IFactorResultModel';
// import { IOutputResult } from '@src/models/output/IOutputResult';
// import { ECostSource } from '@src/models/output/missionDetail/IInvoiceActionResultModel';
// import { ITechnicians } from '@src/models/output/orderDetail/IOrderDetailListResultModel';
// import { UtilsHelper } from '@src/utils/GeneralHelpers';
// import { FunctionComponent, useEffect, useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { Button, Card, Spinner, UncontrolledTooltip } from 'reactstrap';
// import { CustomFunctions } from '../technicianMissionDetail/template';
// import { IInvoiceFactor } from '../../models/output/factor/IFactorResultModel';
// import { useSelector } from 'react-redux';
// import { RootStateType } from '@src/redux/Store';

// interface FactorProps {}

// const Factor1: FunctionComponent<FactorProps> = () => {
//   const userData = useSelector((state: RootStateType) => state.authentication.userData);

//   const navigate = useNavigate();
//   const search = useLocation().search;
//   const requestDetailId = new URLSearchParams(search).get('requestDetailId');
//   const technicianId = new URLSearchParams(search).get('technicianId');

//   const httpRequest = useHttpRequest();

//   const [factor, setFactor] = useState<IFactorResultModel>();
//   const [loading, setLoading] = useState<boolean>(false);

//   const GetFactor = () => {
//     setLoading(true);
//     httpRequest
//       .getRequest<IOutputResult<IFactorResultModel>>(
//         // `${APIURL_GET_FACTOR}?requestDetailId=${requestDetailId}&technicianId=${technicianId}`
//         'http://127.0.0.1:2500/getFactor'
//       )
//       .then((result) => {
//         setFactor(result.data.data);
//         setLoading(false);
//       });
//   };
//   const checkRole = (normalizedName: string) => {
//     return userData?.roles ? userData?.roles.some((roleName) => roleName.normalizedName === normalizedName) : false;
//   };

//   useEffect(() => {
//     GetFactor();
//     CustomFunctions();
//   }, []);
//   return (
//     <>
//       <div id="page">
//         <div className="page-content">
//           <div className="page-title page-title-small">
//             <h2>
//               <a>
//                 <i className="fa-regular fa-pen-to-square mx-2"></i>
//                 صدور فاکتور
//               </a>
//             </h2>
//           </div>
//           <div className="card header-card shape-rounded" data-card-height="150">
//             <div className="card-overlay bg-highlight opacity-95"></div>
//             <div className="card-overlay dark-mode-tint"></div>
//             <div className="card-bg preload-img" data-src="images/pictures/20s.jpg"></div>
//           </div>

//           <div className="card card-style p-4" style={{ marginTop: '100px' }}>
//             <div className="d-flex justify-content-between">
//               <div>شماره درخواست : {factor?.requestNumber}</div>
//               <div>{factor?.currentDateTime}</div>
//             </div>
//           </div>
//           <div className="card card-style p-4">
//             {checkRole('TECHNICIAN' || 'CONSUMER') && (
//               <>
//                 <div className="d-flex justify-content-between">
//                   <div className="consumer-factor">
//                     مشتری : {factor?.consumer.firstName} {factor?.consumer.lastName}
//                   </div>
//                   <div>
//                     09123456789
//                     <i
//                       className="fa fa-phone  mx-2"
//                       style={{ cursor: 'pointer', color: 'green' }}
//                       onClick={() => window.open(`tel:${'09123456456'}`)}
//                     />
//                   </div>
//                 </div>
//                 <div>آدرس:</div>
//                 <div>{factor?.consumer.address}</div>
//                 <div className="d-flex justify-content-between">
//                   <div>کد پستی :</div>
//                   <div>{factor?.consumer.postalCode}</div>
//                 </div>
//               </>
//             )}
//             <div>نام تکنسین :</div>
//             {factor?.technicians &&
//               factor.technicians.length > 0 &&
//               factor.technicians.map((item: ITechnicians, index: number) => {
//                 return (
//                   <>
//                     <div className="d-flex justify-content-between">
//                       <li>
//                         {item.firstName} {item.lastName}
//                       </li>
//                       <div>
//                         {item.phoneNumber}
//                         <i
//                           className="fa fa-phone  mx-2"
//                           style={{ cursor: 'pointer', color: 'green' }}
//                           onClick={() => window.open(`tel:${item.phoneNumber}`)}
//                         />
//                       </div>
//                     </div>
//                   </>
//                 );
//               })}
//           </div>
//           {/* invoice */}
//           <div
//             className="card "
//             style={{
//               display: 'flex',
//               alignItems: 'center',
//             }}
//           >
//             <div className="area-1 m-3">
//               <div className="m-2" style={{ alignItems: 'inherit' }}>
//                 <i className="fa fa-list"></i>
//                 <h5 className="m-1">شرح اقدامات</h5>
//               </div>
//               <div className="">
//                 {factor &&
//                   factor.invoice.length &&
//                   factor.invoice.map((invoice: IInvoiceFactor, index: number) => {
//                     return (
//                       <div className="justify-content-between ">
//                         <div className="flex-column" style={{ width: '50%' }}>
//                           <div>
//                             {index + 1}- {invoice.serviceTypeTitle}
//                             <i className="fa-solid fa-circle-info m-1" style={{ color: 'red' }} id={`registerTip${index}`}></i>
//                           </div>
//                           <div>{invoice.actionTitle}</div>
//                           <UncontrolledTooltip placement="top" target={`registerTip${index}`}>
//                             {invoice.description}
//                           </UncontrolledTooltip>
//                         </div>
//                         <div>{invoice.count}</div>
//                         <div>{UtilsHelper.threeDigitSeparator(invoice.unitPrice)}</div>

//                         <div className={invoice.discount ? 'discount' : ''}>{UtilsHelper.threeDigitSeparator(invoice.price)}</div>
//                         {invoice.discount ? (
//                           <div className="p-1">{UtilsHelper.threeDigitSeparator(invoice.priceAfterDiscount)}</div>
//                         ) : (
//                           ''
//                         )}
//                       </div>
//                     );
//                   })}
//                 <div className="flex-column" style={{ marginLeft: '30px', marginRight: 'auto', width: '50%' }}>
//                   <div className="d-flex justify-content-between p-2">
//                     <div>جمع کل</div>
//                     <div>{UtilsHelper.threeDigitSeparator(factor?.totalPrice)}</div>
//                   </div>
//                   {checkRole('TECHNICIAN') && (
//                     <>
//                       <div className="d-flex justify-content-between p-2">
//                         <div>سهم تکنسین</div>
//                         <div>{UtilsHelper.threeDigitSeparator(factor?.technicianShare)}</div>
//                       </div>
//                       <div className="d-flex justify-content-between p-2">
//                         <div>سهم کاردون</div>
//                         <div>{UtilsHelper.threeDigitSeparator(factor?.kardoonShare)}</div>
//                       </div>
//                       <div className="d-flex justify-content-between p-2">
//                         <div>سهم نماینده</div>
//                         <div>{UtilsHelper.threeDigitSeparator(factor?.agentShare)}</div>
//                       </div>
//                     </>
//                   )}

//                   <div className="d-flex justify-content-between p-2">
//                     <div>تخفیف</div>
//                     <div>{UtilsHelper.threeDigitSeparator(factor?.totalDiscount)}</div>
//                   </div>
//                   <div className="d-flex justify-content-between p-2">
//                     <div>مبلغ قابل پرداخت</div>
//                     <div>{UtilsHelper.threeDigitSeparator(factor?.payment)}</div>
//                   </div>
//                 </div>

//                 <Button
//                   // onClick={() => navigate(URL_TECHNICIAN_FACTOR)}
//                   className="btn btn-m btn-full mb-3 rounded-xs text-uppercase font-700 shadow-s border-blue-dark bg-blue-light"
//                 >
//                   {loading ? (
//                     <Spinner />
//                   ) : (
//                     <>
//                       پرداخت فاکتور<span className="fa-fw select-all fas"></span>
//                     </>
//                   )}
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Factor1;
