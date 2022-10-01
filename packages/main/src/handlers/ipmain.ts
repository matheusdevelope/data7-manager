import { app, BrowserWindow, ipcMain } from "electron";
import { toDataURL } from "qrcode";
import type {
  EnumKeys,
  EnumKeysFirebase,
  EnumKeysHttpServer,
  EnumKeysSendFilesWhats,
  EnumKeysTerminalData,
  EnumKeysWhatsappIntegrated,
  EnumServices,
  EnumTabs,
} from "../../../../types/enums/configTabsAndKeys";
import { EnumIpcEvents } from "../../../../types/enums/GlobalState";
import { Global_State } from "../global_state";
import {
  ActivateServicesByConfiguration,
  StopServicesByConfiguration,
} from "../InitializeInteface";
import { CancelPix, RefreshPix } from "../services/ManageQueuePIX";
import {
  GetConfigTabs,
  GetKey,
  GetKeyValue,
  GetService,
  GetServiceOptions,
  GetServices,
  SafeStorage,
  SetConfigTabs,
  Storage,
} from "../services/local_storage";
import { DefaultConfigTabs } from "../services/local_storage/configs";
import { SendMessageOnWhatsapp } from "../services/protocoll_events";
import { WindowPix } from "../windows/pix";
import { ToggleWindow, WindowsCreated } from "./ControlWindows";
import { DataToLoginMobile, URL_Login_Mobile } from "./login_mobile";
import Whatsapp from "../services/whatsapp";
import SetConfigKeyValue from "../services/local_storage/SetValueConfig";

function RegisterListenersIpcMain() {
  HandleStorage();
  HandleWindow();
  HandleServices();
  HandlePix();
  HandleWhatsappBOT();
  ipcMain.handle(EnumIpcEvents.set_app_pass, (_, password: string) => {
    return SafeStorage.setPassword("application_pass", password);
  });
  ipcMain.handle(EnumIpcEvents.get_app_pass, () => {
    return SafeStorage.getPassword("application_pass");
  });
  ipcMain.on(EnumIpcEvents.refresh_aplication, () => {
    WindowsCreated.forEach((win) => {
      win.window.removeAllListeners();
      win.window.close();
    });
    app.relaunch();
    app.exit();
  });
  ipcMain.handle(EnumIpcEvents.get_global_state, () => {
    return JSON.stringify(Global_State);
  });
  ipcMain.handle(EnumIpcEvents.get_gererator_qrcode, (_, data: string) => {
    return toDataURL(data);
  });
  ipcMain.handle(EnumIpcEvents.get_url_login_mobile, () => {
    return URL_Login_Mobile(DataToLoginMobile());
  });
}

function HandleStorage() {
  //>>> REMOVER
  ipcMain.handle(EnumIpcEvents.get_app_config_tabs, () => {
    return Storage.get("config_tabs");
  });
  ipcMain.handle(EnumIpcEvents.set_app_config_tabs, (_, config_tabs) => {
    return Storage.set("config_tabs", [...config_tabs]);
  });
  ipcMain.on(EnumIpcEvents.reset_config_tabs, () => {
    return Storage.set("config_tabs", [...DefaultConfigTabs]);
  });

  //<<< REMOVER

  ipcMain.handle(EnumIpcEvents.config_get_config, () => {
    return GetConfigTabs();
  });
  ipcMain.handle(
    EnumIpcEvents.config_set_config,
    (_, configs: IOptionConfig2[]) => {
      return SetConfigTabs(configs);
    },
  );
  ipcMain.handle(EnumIpcEvents.config_get_services, () => {
    return GetServices();
  });
  ipcMain.handle(
    EnumIpcEvents.config_get_service,
    (_, service: EnumServices) => {
      return GetService(service);
    },
  );
  ipcMain.handle(
    EnumIpcEvents.config_get_service_options,
    (_, service: EnumServices) => {
      return GetServiceOptions(service);
    },
  );
  ipcMain.handle(
    EnumIpcEvents.config_get_key,
    (
      _,
      key:
        | EnumKeys
        | EnumKeysFirebase
        | EnumKeysHttpServer
        | EnumKeysSendFilesWhats
        | EnumKeysTerminalData
        | EnumKeysWhatsappIntegrated,
      sub_category?: EnumServices,
      category?: EnumTabs,
    ) => {
      return GetKey(key, sub_category, category);
    },
  );
  ipcMain.handle(
    EnumIpcEvents.config_get_key_value,
    (
      _,
      key:
        | EnumKeys
        | EnumKeysFirebase
        | EnumKeysHttpServer
        | EnumKeysSendFilesWhats
        | EnumKeysTerminalData
        | EnumKeysWhatsappIntegrated,
      sub_category?: EnumServices,
      category?: EnumTabs,
    ) => {
      return GetKeyValue(key, sub_category, category);
    },
  );
  // ipcMain.handle(
  //   EnumIpcEvents.config_set_key_value,
  //   (
  //     _,
  //     value: string | number | boolean | string[],
  //     key:
  //       | EnumKeys
  //       | EnumKeysFirebase
  //       | EnumKeysHttpServer
  //       | EnumKeysSendFilesWhats
  //       | EnumKeysTerminalData
  //       | EnumKeysWhatsappIntegrated,
  //     sub_category?: EnumServices,
  //     category?: EnumTabs
  //   ) => {
  //     return SetKeyValue(value, key, sub_category, category);
  //   }
  // );
  ipcMain.handle(
    EnumIpcEvents.config_set_key_value,
    (
      _,
      value: string | number | boolean | string[],
      key:
        | EnumKeys
        | EnumKeysFirebase
        | EnumKeysHttpServer
        | EnumKeysSendFilesWhats
        | EnumKeysTerminalData
        | EnumKeysWhatsappIntegrated,
      sub_category?: EnumServices,
      category?: EnumTabs,
    ) => {
      return SetConfigKeyValue({ value, key, sub_category, category });
    },
  );
}
function HandleWindow() {
  ipcMain.handle(EnumIpcEvents.toggle_window, (_, id_window: string) => {
    const Window = WindowsCreated.find(
      (obj) => obj.id === id_window && !obj.window.isDestroyed(),
    )?.window;
    if (Window) {
      return ToggleWindow(Window);
    }
    return false;
  });
  ipcMain.handle(EnumIpcEvents.visibility_window, (_, id_window: string) => {
    const Window = WindowsCreated.find(
      (obj) => obj.id === id_window && !obj.window.isDestroyed(),
    )?.window;
    if (Window) {
      return Window.isVisible();
    }
    return false;
  });
  ipcMain.on("move-window", (_, bounds: IBounds) => {
    BrowserWindow.getFocusedWindow()?.setBounds({ x: bounds.x, y: bounds.y });
  });
  ipcMain.on("minimize-window", () => {
    BrowserWindow.getFocusedWindow()?.minimize();
  });
  ipcMain.on("close-window", () => {
    BrowserWindow.getFocusedWindow()?.close();
  });
  ipcMain.on(EnumIpcEvents.close_current_window, async () => {
    //need handle close window
    return true;
  });
}
function HandlePix() {
  ipcMain.on(EnumIpcEvents.open_qrcode, async () => {
    WindowPix().Window.show();
    return true;
  });
  ipcMain.on(EnumIpcEvents.close_qrcode, async () => {
    WindowPix().Window.hide();
    return true;
  });
  ipcMain.handle(EnumIpcEvents.get_fc_cancel_pix, async (_, id: string) => {
    return JSON.stringify(await CancelPix(id));
  });
  ipcMain.handle(EnumIpcEvents.get_fc_refresh_pix, async (_, id: string) => {
    return JSON.stringify(await RefreshPix(id));
  });
  ipcMain.handle(
    EnumIpcEvents.get_fc_send_message_on_whatsapp,
    (_, data_to_message: IWhatsAppMessage) => {
      return SendMessageOnWhatsapp(data_to_message);
    },
  );
}
function HandleServices() {
  ipcMain.on(EnumIpcEvents.toggle_service, (_, active: boolean) => {
    if (active) return ActivateServicesByConfiguration();
    return StopServicesByConfiguration();
  });
}
function HandleWhatsappBOT() {
  ipcMain.handle(EnumIpcEvents.get_status_whatsapp, () => {
    return Whatsapp.values();
  });

  ipcMain.on(EnumIpcEvents.reset_localstorage_whatsapp, () => {
    Whatsapp.ResetLocalStorage();
  });
}

export { RegisterListenersIpcMain };
