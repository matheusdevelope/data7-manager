export enum EnumIpcEvents {
  get_global_state = "get_global_state",
  set_app_pass = "set_app_pass",
  get_app_pass = "get_app_pass",
  get_app_config = "get_app_config",
  set_app_config = "set_app_config",
  get_app_config_tabs = "get_app_config_tabs",
  set_app_config_tabs = "set_app_config_tabs",
  open_qrcode = "open-qrcode",
  close_qrcode = "close-qrcode",
  update_qrcode = "update-qrcode",
  send_message_whats = "send-message-whats",
  login_with_qrcode = "login_with_qrcode",
  close_current_window = "close_current_window",
  refresh_aplication = "refresh_aplication",
  get_gererator_qrcode = "get_gererator_qrcode",
  get_fc_refresh_pix = "get_fc_refresh_pix",
  get_fc_cancel_pix = "get_fc_cancel_pix",
  get_fc_send_message_on_whatsapp = "get_fc_send_message_on_whatsapp",
  reset_config_tabs = "reset_config_tabs",
  get_url_login_mobile = "get_url_login_mobile",
  toggle_window = "toggle_window",
  visibility_window = "visibility_window",
  toggle_service = "toggle_service",
  reset_localstorage_whatsapp = "reset_localstorage_whatsapp",
  get_status_whatsapp = "get_status_whatsapp",
  listener_whatsapp_bot = "listener_whatsapp_bot",
  //storage
  config_get_config = "config_get_config",
  config_set_config = "config_set_config",
  config_get_services = "config_get_services",
  config_get_service = "config_get_service",
  config_get_service_options = "config_get_service_options",
  config_get_key = "config_get_key",
  config_get_key_value = "config_get_key_value",
  config_set_key_value = "config_set_key_value",
}
