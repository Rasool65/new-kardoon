import {
  URL_MAIN,
  URL_LOGIN,
  URL_USER_PROFILE,
  URL_CATEGORIES,
  URL_PRODUCTS,
  URL_CITY,
  URL_REQUEST_DETAIL,
  URL_MY_ORDERS,
  URL_ORDER_DETAIL,
  URL_TECHNICIAN_PROFILE,
  URL_TECHNICIAN_MISSION,
  URL_TECHNICIAN_MISSION_DETAIL,
  URL_TECHNICIAN_MISSION_DETAIL_ACTION,
  URL_CHANGE_PASSWORD,
  URL_INVOICE,
  URL_CALLBACK,
  URL_CONVERSATION,
  URL_CHAT,
  URL_PROVINCE_LIST,
  URL_PROVINCE,
  URL_TECHNICIAN_REQUEST,
  URL_NOT_FOUND,
  URL_TECHNICIAN_REGISTER_REQUEST,
  URL_BLOG,
  URL_GUARANTEE,
  URL_INVOICE_SHARE,
  URL_USER_ACTIVE_SESSION,
  URL_HOME_WARRANTY,
  URL_HOME_WARRANTY_INVOICE_SHARE,
} from '@src/configs/urls';

import IRoute from './IRoute';
import RouteType from './RouteType';
// import LoginModal from '@src/pages/authentication/LoginModal';
import Profile from '@src/pages/profile';
import Category from '@src/pages/category';
import Products from '@src/pages/products';
import Main from '@src/pages/main';
import Order from '@src/pages/order';
import RequestDetail from '@src/pages/requestDetail';
import OrderDetail from '@src/pages/orderDetail';
// import TechnicianProfile from '@src/pages/technicianProfile';
import TechnicianMission from '@src/pages/technicianMissions';
import technicianMissionDetail from '@src/pages/technicianMissionDetail';
import Action from '@src/pages/technicianMissionDetail/technicianAction';
import ChangePassword from '@src/pages/changePassword';
import Invoice from '@src/pages/invoice';
import CallBackUrl from '@src/pages/callBackUrls';
import Chat from '@src/pages/conversation/Chat';
import Login from '@src/pages/authentication/Login';
import Province from '@src/pages/province';
import Conversations from '@src/pages/conversation';
import ProvinceList from '@src/pages/province/ProvinceList';
import City from '@src/pages/province/City';
import TechnicianRequest from '@src/pages/technicianMissionDetail/technicianRequest';
import NotFound from '@src/pages/notFound';
import TechnicianRequestConsumer from '@src/pages/TechnicianRequestConsumer';
import ArchiveBlog from '@src/pages/blog/ArchiveBlog';
import Blog from '@src/pages/blog';
import Guarantee from '@src/pages/guarantee';
import InvoiceIssuanceShare from '@src/pages/invoice/InvoiceIssuanceShare';
import Warranty from '@src/pages/warranty';
import ActiveSession from '@src/pages/profile/ActiveSession';
import HomeWarrantyInfo from '@src/pages/warranty/HomeWarrantyInfo';

const routes: IRoute[] = [
  {
    path: URL_MAIN,
    component: Main,
    type: RouteType.all,
    props: {
      title: 'صفحه اصلی',
    },
  },
  {
    path: URL_LOGIN,
    component: Login,
    type: RouteType.public,
    props: {
      title: 'کاردون صفحه ورود',
    },
  },
  {
    path: URL_USER_PROFILE,
    component: Profile,
    type: RouteType.private,
    props: {
      title: 'حساب کاربری',
    },
  },
  {
    path: URL_CATEGORIES,
    component: Category,
    type: RouteType.all,
    props: {
      title: 'دسته بندی ها',
    },
  },
  {
    path: URL_PRODUCTS,
    component: Products,
    type: RouteType.all,
    props: {
      title: 'محصولات',
    },
  },
  {
    path: URL_CITY,
    component: City,
    type: RouteType.public,
    props: {
      title: 'انتخاب شهر',
    },
  },
  {
    path: URL_PROVINCE_LIST,
    component: ProvinceList,
    type: RouteType.public,
    props: {
      title: 'انتخاب سایر استان ها',
    },
  },
  {
    path: URL_PROVINCE,
    component: Province,
    type: RouteType.public,
    props: {
      title: 'انتخاب استان',
    },
  },
  {
    path: URL_MY_ORDERS,
    component: Order,
    type: RouteType.private,
    props: {
      title: 'سفارشات من',
    },
  },
  {
    path: URL_REQUEST_DETAIL,
    component: RequestDetail,
    type: RouteType.private,
    props: {
      title: 'جزئیات درخواست',
    },
  },
  {
    path: URL_ORDER_DETAIL,
    component: OrderDetail,
    type: RouteType.private,
    props: {
      title: 'جرئیات بیشتر سفارش',
    },
  },
  // {
  //   path: URL_TECHNICIAN_PROFILE,
  //   component: TechnicianProfile,
  //   type: RouteType.private,
  //   props: {
  //     title: 'پروفایل متخصص',
  //   },
  // },
  {
    path: URL_TECHNICIAN_MISSION,
    component: TechnicianMission,
    type: RouteType.private,
    props: {
      title: 'لیست ماموریت های متخصص',
    },
  },
  {
    path: URL_TECHNICIAN_MISSION_DETAIL,
    component: technicianMissionDetail,
    type: RouteType.private,
    props: {
      title: 'جزییات ماموریت های متخصص',
    },
  },
  {
    path: URL_TECHNICIAN_MISSION_DETAIL_ACTION,
    component: Action,
    type: RouteType.private,
    props: {
      title: 'اکشن روی ماموریت',
    },
  },
  {
    path: URL_CHANGE_PASSWORD,
    component: ChangePassword,
    type: RouteType.private,
    props: {
      title: 'تغییر کلمه عبور',
    },
  },
  {
    path: URL_INVOICE,
    component: Invoice,
    type: RouteType.all,
    props: {
      title: 'مشاهده فاکتور',
    },
  },
  {
    path: URL_CALLBACK,
    component: CallBackUrl,
    type: RouteType.all,
    props: {
      title: 'نتیجه پرداخت ',
    },
  },
  {
    path: URL_CONVERSATION,
    component: Conversations,
    type: RouteType.private,
    props: {
      title: 'لیست مکاتبات',
    },
  },
  {
    path: URL_CHAT,
    component: Chat,
    type: RouteType.private,
    props: {
      title: 'ارسال / دریافت پیام',
    },
  },
  {
    path: URL_TECHNICIAN_REQUEST,
    component: TechnicianRequest,
    type: RouteType.private,
    props: {
      title: 'درخواست برای مشتری',
    },
  },
  {
    path: URL_NOT_FOUND,
    component: NotFound,
    type: RouteType.all,
    props: {
      title: '404 | صفحه موردنظر پیدا نشد',
    },
  },
  {
    path: URL_TECHNICIAN_REGISTER_REQUEST,
    component: TechnicianRequestConsumer,
    type: RouteType.private,
    props: {
      title: 'ثبت نام و درخواست برای مشتری',
    },
  },
  {
    path: URL_BLOG,
    component: Blog,
    type: RouteType.private,
    props: {
      title: 'اطلاع رسانی ها',
    },
  },
  {
    path: URL_GUARANTEE,
    component: Guarantee,
    type: RouteType.all,
    props: {
      title: 'لیست گارانتی ها',
    },
  },
  {
    path: URL_INVOICE_SHARE,
    component: InvoiceIssuanceShare,
    type: RouteType.all,
    props: {
      title: 'پرداخت فاکتورهای صادر شده',
    },
  }, 
  {
    path: URL_HOME_WARRANTY_INVOICE_SHARE,
    component: HomeWarrantyInfo,
    type: RouteType.all,
    props: {
      title: 'مشاهده فاکتور هوم وارانتی',
    },
  },
  {
    path: URL_USER_ACTIVE_SESSION,
    component: ActiveSession,
    type: RouteType.private,
    props: {
      title: 'دستگاه های فعال',
    },
  },
  {
    path: URL_HOME_WARRANTY,
    component: Warranty,
    type: RouteType.private,
    props: {
      title: 'هوم وارانتی',
    },
  },
];

export default routes;
