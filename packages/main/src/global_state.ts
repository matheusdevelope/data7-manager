import * as ip from 'ip';
import { hostname, userInfo } from 'os';
import { GetConfig } from './services/local_storage';
interface IObjectConfig {
  key: string;
  value: string | number | boolean;
  label: string;
  type: string | number | boolean;
  order: number;
}

function GetLocalConfig(): IDefaultConfig {
  const LocalConfig: { [key: string]: string | boolean | number } = {
    cnpj: '',
    firebase_id: '',
    firebase_price: '',
    firebase_portion: '',
    firebase_img: '',
    firebase_link: '',
    firebase_phone: '',
    firebase_status: '',
    firebase_message: '',
    firebase_created_at: '',
    firebase_error: '',
    firebase_status_awaiting_payment: '',
    firebase_status_confirmed_payment: '',
    firebase_status_canceled: '',
    firebase_status_canceled_system: '',
    firebase_status_canceled_client: '',
    firebase_collection: '',
    firebase_cnpj: '',
    firebase_ip: '',
    firebase_username: '',
    firebase_machine_name: '',
    firebase_liberation_key: '',
    firebase_validate_ip: false,
  };
  const StorageConfig = GetConfig() as unknown as IObjectConfig[];

  if (StorageConfig) {
    StorageConfig.forEach((obj) => {
      if (obj.key === 'cnpj') {
        LocalConfig[obj.key] = JSON.parse(String(obj.value));
      } else {
        if (typeof obj.key == 'string') {
          LocalConfig[obj.key] = obj.value.toString().toLowerCase();
        } else {
          LocalConfig[obj.key] = obj.value;
        }
      }
    });
  }
  return LocalConfig as unknown as IDefaultConfig;
}

const Global_State: IGlobalState = {
  name_app: 'Data7 Manager',
  isDev: process.env.IS_DEV === 'true',
  local_ip: ip.address('public'),
  username_machine: userInfo().username,
  hostname: hostname(),
  localConfig: GetLocalConfig,
  port_server_http: 3500,
  protocoll_register: 'data7',
  notification_update:
    'A versão v{version} está Dispovível, ela será automaticamente instalada na próxima inicialização do aplicativo.\nVocê pode reiniciar a aplicação a qualquer momento para aplicar as mudanças.',
  events: {
    get_global_state: 'get_global_state',
    set_app_pass: 'set_app_pass',
    get_app_pass: 'get_app_pass',
    get_app_config: 'get_app_config',
    set_app_config: 'set_app_config',
    open_qrcode: 'open-qrcode',
    close_qrcode: 'close-qrcode',
    update_qrcode: 'update-qrcode',
    send_message_whats: 'send-message-whats',
    login_with_qrcode: 'login_with_qrcode',
    close_current_window: 'close_current_window',
    refresh_aplication: 'refresh_aplication',
    get_gererator_qrcode: 'get_gererator_qrcode',
    get_fc_refresh_pix: 'get_fc_refresh_pix',
    get_fc_cancel_pix: 'get_fc_cancel_pix',
    get_fc_send_message_on_whatsapp: 'get_fc_send_message_on_whatsapp',
  },
};

export { Global_State };
