interface IBounds {
  x: number;
  y: number;
}
interface IFirebaseTypeValues {
  validate_ip: boolean;
  collection: string;
  liberation_key: string;
  collection_refresh: string;
  cnpj: string;
  ip: string;
  username: string;
  machine_name: string;
  id: string;
  price: string;
  portion: string;
  img: string;
  link: string;
  phone: string;
  status_field: string;
  message: string;
  created_at: string;
  error: string;
  status_awaiting_payment: string;
  status_confirmed_payment: string;
  status_finish_payment: string;
  status_canceled: string;
  status_canceled_system: string;
  status_canceled_client: string;
}

interface IDefaultConfig {
  cnpj: string[];
  firebase_id: string;
  firebase_price: string;
  firebase_portion: string;
  firebase_img: string;
  firebase_link: string;
  firebase_phone: string;
  firebase_status: string;
  firebase_message: string;
  firebase_created_at: string;
  firebase_error: string;
  firebase_status_awaiting_payment: string;
  firebase_status_confirmed_payment: string;
  firebase_status_canceled: string;
  firebase_status_canceled_system: string;
  firebase_status_canceled_client: string;
  firebase_collection: string;
  firebase_cnpj: string;
  firebase_ip: string;
  firebase_username: string;
  firebase_machine_name: string;
  firebase_liberation_key: string;
  firebase_validate_ip: boolean;
}

interface IEventsGlobalState {
  get_global_state: string;
  set_app_pass: string;
  get_app_pass: string;
  get_app_config: string;
  set_app_config: string;
  get_app_config_tabs: string;
  set_app_config_tabs: string;
  open_qrcode: string;
  close_qrcode: string;
  update_qrcode: string;
  send_message_whats: string;
  login_with_qrcode: string;
  close_current_window: string;
  refresh_aplication: string;
  get_gererator_qrcode: string;
  get_fc_cancel_pix: string;
  get_fc_refresh_pix: string;
  get_fc_send_message_on_whatsapp: string;
}
interface IGlobalState {
  name_app: string;
  isDev: boolean;
  local_ip: string;
  username_machine: string;
  hostname: string;
  localConfig: () => IDefaultConfig;
  port_server_http: 3500;
  protocoll_register: string;
  notification_update: string;
  events: IEventsGlobalState;
}
interface IDimensions {
  height: number;
  width: number;
}

interface IDataToLoginMobile {
  id_machine: string;
  hostname: string;
  username_machine: string;
  ip: string;
  terminal_identification: string;
  cnpj_cpf: string[];
}

interface ICancelQr {
  canceled: boolean;
  message: string;
  error?: string;
}
interface IRefreshQr {
  awaiting_payment: boolean;
  confirmed_payment: boolean;
  canceled: boolean;
  message: string;
  error?: string;
}

interface IDataQrCode {
  action: string;
  id: string;
  portion: string;
  price: number;
  img: string;
  link: string;
  phone: string;
  awaiting_payment: boolean;
  confirmed_payment: boolean;
  canceled: boolean;
  error?: string;
  message: string;
  created_at: Date;
  doc_id: string;
}

interface ICallback {
  type: EnumTypeOfCallback;
  message: string;
  error: string | Error | null;
}

interface ICloseQrCode {
  qrcode: IDataQrCode;
  devices: EnumDevices[];
  callback: (callback: ICallback) => void;
}

interface IDevice {
  id: string;
  identificacao: string;
  socket_id: string;
}

interface IDeviceMobile {
  id: string;
  identification: string;
  socket_id: string;
  online: boolean;
}
interface IWhatsAppMessage {
  phone: string;
  message: string;
}
/////FRONT

interface IObjectConfig {
  key: string;
  value: string | number | boolean | Array;
  label: string;
  type: React.HTMLInputTypeAttribute;
  order: number;
}

interface ICallback {
  type: EnumTypeOfCallback;
  message: string;
  error: Error | string | null;
}
// interface IOpenQrCode {
//   base64_qrcode: string;
//   link_copy_paste: string;
//   devices: EnumDevices[];
//   callback: (callback: ICallback) => void;
// }
interface ICloseQrCode {
  callback: (callback: ICallback) => void;
}
// interface IDataQrCode {
//   action: string;
//   id: string;
//   portion: string;
//   price: number;
//   img: string;
//   link: string;
//   phone: string;
//   awaiting_payment: boolean;
//   confirmed_payment: boolean;
//   canceled: boolean;
//   error?: string;
//   message: string;
//   created_at: Date;
// }

interface IDialog {
  isOpen: boolean;
  title?: string;
  message: string;
  onClickOK: React.MouseEventHandler<HTMLButtonElement>;
  onClickCancel?: React.MouseEventHandler<HTMLButtonElement>;
  textbuttonOK?: string;
  textbuttonCancel?: string;
}

interface IComumObject {
  [key: string]: string | boolean | number;
}
interface IComumObject2 {
  [key: string]: string | boolean | number | IComumObject2;
}
