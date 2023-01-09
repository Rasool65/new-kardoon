// Authentication
export const APIURL_LOGIN = '/account/login';
// export const APIURL_GET_COUNTRY_DIVISION = '/CountryDivision/GetCountryDivision';
export const APIURL_REGISTER = '/Account/RegisterUser';
export const APIURL_SEND_PASSWORD = '/Account/SendPassword';

//profile
export const APIURL_UPDATE_PROFILE = '/UserManagement/UpdateUserProfile';
export const APIURL_UPDATE_PROFILE_FORMDATA = '/v1/UserManagement/UpdateUserProfile';
export const APIURL_GET_INTRODUCTIONS = '/Introduction/GetIntroductionMethodList';
export const APIURL_GET_USER_INFO = '/UserManagement/GetUserInfo';
//MAIN PAGE
export const APIURL_GET_SERVICES = '/ProductCategory/GetServiceTypeList';
export const APIURL_GET_ADVERTISE = '/Slider/GetSliders';
export const APIURL_GET_CATEGORIES = '/ProductCategory/GetCategoryList';
export const APIURL_GET_HIERARCHICAL_DEVICE_TYPE = '/ProductCategory/GetHierarchicalDeviceTypes';
export const APIURL_GET_DEVICE_TYPE_WITH_PARENT_INFO = '/ProductCategory/GetDeviceTypeWithParentInfo';
export const APIURL_GET_DEVICE_TYPE = '/ProductCategory/GetDeviceTypes';
export const APIURL_UPDATE_RESIDENCE_CITY = '/UserManagement/UserResidenceCity';
export const APIURL_GET_BRANDS = '/ProductCategory/GetProductBrandList';
export const APIURL_GET_ADDRESSES = '/UserManagement/GetUserAddress';
export const APIURL_POST_CREATE_REQUEST = '/Consumer/Request/CreateRequest';

//ADD ADDRESS
export const APIURL_GET_COUNTRIES = '/CountryDivision/GetCountries';
export const APIURL_GET_CITIES = '/CountryDivision/GetCities';
export const APIURL_GET_PROVINES = '/CountryDivision/GetProvinces';
export const APIURL_GET_REGIONES = '/CountryDivision/GetRegiones';
export const APIURL_GET_DISTRICTS = '/CountryDivision/GetDistricts';
export const APIURL_POST_ADD_USER_ADDRESS = '/UserManagement/AddUserAddress';
export const APIURL_POST_DELETE_USER_ADDRESS = '/UserManagement/DeleteUserAddress';
export const APIURL_PUT_UPDATE_USER_ADDRESS = '/UserManagement/UpdateUserAddress';

//REQUEST DETAIL
export const APIURL_GET_PROBLEM_LIST = '/ProductCategory/GetProductCategoryProblemList';
export const APIURL_GET_PRODUCTS_ATTRIBUTES = '/ProductCategory/GetProductAttributes';
export const APIURL_UPDATE_REQUEST_ATTRIBUTES = '/Request/UpdateRequestDetailAttributes';
export const APIURL_GET_ADDRESS_TITLE = '/BaseInformation/GetAddressTitle';

//ORDERS
export const APIURL_GET_CURRENT_CONSUMER_REQUEST = '/Consumer/Request/GetCurrentRequestList';
export const APIURL_GET_PREVIOUS_CONSUMER_REQUEST = '/Consumer/Request/GetPreviousRequestList';

//ORDER DETAIL
export const APIURL_GET_ORDER_DETAILS = '/Consumer/Request/GetRequestDetail';
export const APIURL_POST_INVOICE_ONLINE_CHECKOUT = '/Payment/InvoiceOnlineCheckOut';
export const APIURL_POST_INVOICE_WALLET_CHECKOUT = '/Payment/InvoiceWalletCheckOut';
export const API_URL_GET_WALLET_BALANCE = '/Wallet/GetWalletBalance';

//TECHNICIAN PROFILE
export const APIURL_GET_TECHNICIAN_PROFILE = '/Technician/GetTechnicianProfile';
export const APIURL_POST_WALLET_PAYMENT = '/Payment/OnlineWalletCharging';
export const APIURL_POST_WALLET_WITH_DRAW = '/Wallet/WithDrawRequest';
export const APIURL_GET_TRANSACTION = '/Financial/GetTechnicianTransactionList';
export const APIURL_GET_PRODUCT_TYPES = '/ProductCategory/GetAllProductListValue';
export const APIURL_GET_TECHNICIAN_CONSUMERS = '/Order/GetTechnicianConsumerList';
export const APIURL_GET_TECHNICIAN_MISSIONS = '/Order/GetTechnicianMissions';
export const APIURL_GET_MISSION_DETAILS = '/Order/GetTechnicianRequestDetail';
export const APIURL_GET_MISSION_ATTRIBUTES_DETAILS = '/Request/GetRequestDetailAttributeValues';
export const APIURL_UPDATE_REQUEST_DETAIL_STATUS = '/Order/EditRequestDetailStatus';
export const APIURL_GET_BANK_ACCOUNT_INFO = '/UserManagement/GetBankAccountInfo';
export const APIURL_UPDATE_BANK_ACCOUNT_INFO = '/UserManagement/UpdateBankAccountInfo';
export const APIURL_GET_SERVICES_TYPES = '/BaseInformation/ServiceTypeList';
export const APIURL_GET_SERVICES_TITLE = '/ProductCategory/ProductCategoryActionInfoList';

//ACTIONS
export const APIURL_POST_REQUEST_DETAIL_ACTION_FORMDATA = '/v1/Order/AddAction';
export const APIURL_POST_REQUEST_DETAIL_ACTION = '/Order/AddAction';
export const APIURL_POST_REQUEST_TECHNICIAN = '/Request/TechnicianAddRequestDetailToRequest';
export const APIURL_POST_REQUEST_TECHNICIAN_WITH_ADDRESS = '/Request/CreateTechnicianConsumerRequest';
export const APIURL_DELETE_ACTION = '/Order/DeleteAction';
export const APIURL_GET_SOURCE_OF_COST = '/BaseInformation/GetSourceCostList';
export const APIURL_GET_TECHNICIAN_INVOICE = '/Order/GetTechnicianInvoiceList';
export const APIURL_POST_TECHNICIAN_INVOICE_CHECKOUT = '/Financial/TechnicianOrderDetailCashCheckout';
export const APIURL_POST_TECHNICIAN_INVOICE_CHECKOUT_ONLINE = '/Payment/OrderDetailOnlineCheckout';
export const APIURL_POST_INVOICE_CHECKOUT = '/Financial/OrderDetailCashCheckout';
export const APIURL_POST_ORDER_INVOICE_ISSUANCE = '/Financial/OrderInvoiceIssuance';
export const APIURL_POST_INVOICE_CHECKOUT_ALL = '/Financial/RequestCashCheckout';
export const APIURL_GET_REQUEST_STATUS_LIST = '/BaseInformation/GetRequestDetailStatusList';
export const APIURL_POST_TECHNICIAN_MEDIA_FILES = '/Request/AddTechnicianMediaFiles';
export const APIURL_PUT_UPDATE_CONSUMER_NATIONAL_CODE = '/Order/UpdateTechnicianRequestConsumerNationalCode';

//TECHNICIAN MISSION ACTION
export const APIURL_POST_TRACKING = '/Order/AddTracking';
export const APIURL_GET_TRACKING_LIST = '/Order/GetTracking';

//CHANGE PASSWORD
export const APIURL_CHANGE_PASSWORD = '/UserManagement/ChangeUserPassword';

//INVOICE
export const APIURL_GET_INVOICE = '/Consumer/Invoice/InvoiceInformation';

//CALL BACK
export const APIURL_GET_CALLBACK_DETAIL = '/Payment/GetPayment';

//CONVERSATION
export const APIURL_GET_CATEGORY_CONVERSATION = '/BaseInformation/GetMessageCategoryList';
export const APIURL_PUT_SEEN_ALL_BY_CATEGORY = '/Chat/SeenAllMessageByCategory';
export const APIURL_GET_CHAT_CONVERSATION = '/Chat/GetChatList';
export const APIURL_POST_NEW_MESSAGE = '/Chat/SendChat';
export const APIURL_GET_MESSAGE_COUNT = '/Chat/UnreadChatCount';
export const APIURL_LISTENING_CHAT = '/Chat';

//REGISTER AND REQUEST BY TECHNICIAN
export const APIURL_POST_REGISTER_BY_TECHNICIAN = '/UserManagement/RegisterUserByTechnician';
export const APIURL_POST_ADDRESS_BY_TECHNICIAN = '/UserManagement/AddUserAddressByTechnician';
export const APIURL_POST_CREATE_REQUEST_BY_TECHNICIAN = '/Request/CreateTechnicianConsumerRequestByAddressId';
export const APIURL_GET_CONSUMER_INFO = '/UserManagement/GetUserPrimitiveInfo';

// SYSTEM MESSAGE INFORMATION
export const APIURL_GET_SYSTEM_MESSAGE = '/Message/GetSystemChanges';
export const APIURL_GET_ARCHIVE_SYSTEM_MESSAGE = '/Message/GetPreviousSystemChanges';
export const APIURL_GET_COUNT_SYSTEM_MESSAGE = '/Message/GetSystemChangesCount';
export const APIURL_GET_STATUS_MISSION = '/Order/GetStatusCount';

//SIDE BAR
export const APIURL_GET_GUARANTEE = '/UserManagement/GetUserUniqueGuid';
export const APIURL_GET_GUARANTEE_INFO = '/Guarantee/GetGuarantee';
