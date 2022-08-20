interface IObjectConfig {
  key: string;
  value: string | number | boolean;
  label: string;
  type: React.HTMLInputTypeAttribute;
  order: number;
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
