export enum EnumTypesOptions {
  array = "array",
  text = "text",
  textarea = "textarea",
  number = "number",
  boolean = "boolean",
  button = "button",
}
export enum EnumTabs {
  terminal_data = "terminal_data",
  services = "services",
}

export enum EnumServices {
  pix = "pix",
  whatsapp_send_files = "whatsapp_send_files",
  firebase = "firebase",
  http_server = "http_server",
  whatsapp_integrated = "whatsapp_integrated",
}
export enum EnumKeys {
  status = "status",
}
export enum EnumKeysPix {
  order_asc = "order_asc",
  message_whats = "message_whats",
}
export enum EnumKeysWhatsappIntegrated {
  use_bot = "use_bot",
  allow_remote_service_server = "allow_remote_service_server",
  use_remote_service = "use_remote_service",
  remote_service_address = "remote_service_address",
  show_window_on_start = "show_window_on_start",
  delay_bots = "delay_bots",
  veryfication_is_logged_interval = "veryfication_is_logged_interval",
  user_agent = "user_agent",
  whats_session = "whats_session",
  url = "url",
  text_after_file = "text_after_file",
  //SELECTORS
  selector_key_storage_is_logged = "selector_key_storage_is_logged",
  selector_qrcode_img = "selector_qrcode_img",
  selector_is_loading = "selector_is_loading",
  selector_find_when_useragent_failed = "selector_find_when_useragent_failed",
  selector_link_chrome = "selector_link_chrome",
  selector_mini_profile_photo = "selector_mini_profile_photo",
  selector_profile_photo = "selector_profile_photo",
  selector_profile_name = "selector_profile_name",
  selector_close_profile = "selector_close_profile",
}

export enum EnumKeysTerminalData {
  identification = "identification",
  cnpj_cpf = "cnpj_cpf",
  start_in_boot = "start_in_boot",
  temp_files = "temp_files",
}
export enum EnumKeysSendFilesWhats {
  path_files = "path_files",
  disable_auto_format = "disable_auto_format",
  expiration = "expiration",
}
export enum EnumKeysHttpServer {
  port = "port",
}
export enum EnumKeysFirebase {
  validate_ip = "validate_ip",
  collection = "collection",
  liberation_key = "liberation_key",
  collection_refresh = "collection_refresh",
  cnpj = "cnpj",
  ip = "ip",
  username = "username",
  machine_name = "machine_name",
  id = "id",
  price = "price",
  portion = "portion",
  img = "img",
  link = "link",
  phone = "phone",
  status_field = "status_field",
  message = "mensagem",
  created_at = "created_at",
  error = "error",
  status_awaiting_payment = "status_awaiting_payment",
  status_confirmed_payment = "status_confirmed_payment",
  status_finish_payment = "status_finish_payment",
  status_canceled = "status_canceled",
  status_canceled_system = "status_canceled_system",
  status_canceled_client = "status_canceled_client",
}
