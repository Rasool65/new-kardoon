export interface IModalModel {
  handleClose: any;
  display: boolean;

  handleRegisterModal?: any;
  setForgetPasswordModalVisible?: any;
  showRegisterModal?: boolean;
  showForgetPasswordModal?: boolean;
  showEnterCodeModal?: boolean;
  mobileNumber?: string;
  handleEditMobileNo?: any;
  resend?: any;
  role?: string;
}

export interface IMenuModal {
  displayMenu: boolean;
  showMenu?: any;
}
export interface ILoginModal {
  display: boolean;
  showModal?: any;
}
