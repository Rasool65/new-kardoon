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
  URL_TECHNICIAN_FACTOR,
  URL_CALLBACK,
  URL_CONVERSATION,
  URL_CHAT,
  URL_PROVINCE_LIST,
  URL_PROVINCE,
  URL_TECHNICIAN_REQUEST,
  URL_NOT_FOUND,
  URL_TECHNICIAN_REGISTER_REQUEST,
} from './../urls';

import IRoute from './IRoute';
import RouteType from './RouteType';
import LoginModal from '@src/pages/authentication/LoginModal';
import Profile from '@src/pages/profile';
import test from '@src/pages/test';
import Category from '@src/pages/category';
import Products from '@src/pages/products';
import Main from '@src/pages/main';
import Order from '@src/pages/order';
import RequestDetail from '@src/pages/requestDetail';
import OrderDetail from '@src/pages/orderDetail';
import TechnicianProfile from '@src/pages/technicianProfile';
import TechnicianMission from '@src/pages/technicianMissions';
import technicianMissionDetail from '@src/pages/technicianMissionDetail';
import Action from '@src/pages/technicianMissionDetail/technicianAction';
import ChangePassword from '@src/pages/changePassword';
import Factor from '@src/pages/factor';
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
    path: '/test',
    component: test,
    type: RouteType.public,
    props: {
      title: 'test',
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
  {
    path: URL_TECHNICIAN_PROFILE,
    component: TechnicianProfile,
    type: RouteType.private,
    props: {
      title: 'پروفایل متخصص',
    },
  },
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
    path: URL_TECHNICIAN_FACTOR,
    component: Factor,
    type: RouteType.all,
    props: {
      title: 'صدور فاکتور',
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
];

export default routes;
