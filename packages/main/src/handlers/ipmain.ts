import { app, BrowserWindow, ipcMain } from "electron";
import { toDataURL } from "qrcode";
import { Global_State } from "../global_state";
import { CancelPix, RefreshPix } from "../services/Api_Pix";
import { SafeStorage, Storage } from "../services/local_storage";
import { SendMessageOnWhatsapp } from "../services/protocoll_events";
import { WindowPix } from "../windows/pix";

function RegisterListenersIpcMain() {
  ipcMain.handle(Global_State.events.set_app_pass, (_, password: string) => {
    return SafeStorage.setPassword("application_pass", password);
  });
  ipcMain.handle(Global_State.events.get_app_pass, () => {
    return SafeStorage.getPassword("application_pass");
  });
  ipcMain.handle(Global_State.events.get_app_config, () => {
    return Storage.get("config");
  });
  ipcMain.handle(Global_State.events.set_app_config, (_, config) => {
    return Storage.set({ ...Storage.store, config });
  });
  ipcMain.on(Global_State.events.open_qrcode, async () => {
    WindowPix().Window.show();
    return true;
  });
  ipcMain.on(Global_State.events.close_qrcode, async () => {
    WindowPix().Window.hide();
    return true;
  });
  ipcMain.on(Global_State.events.close_current_window, async () => {
    //need handle close window
    return true;
  });
  ipcMain.on(Global_State.events.refresh_aplication, async () => {
    WindowPix().Window.removeAllListeners();
    WindowPix().Window.destroy();
    app.relaunch();
    setTimeout(app.exit, 2000);
    return true;
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
  ///ADD HANDLES PRELOAD
  ipcMain.handle(Global_State.events.get_global_state, () => {
    return JSON.stringify(Global_State); //   { ...Global_State }
  });
  ipcMain.handle(
    Global_State.events.get_gererator_qrcode,
    async (event, image_base64_qrcode_login: string) => {
      return await toDataURL(image_base64_qrcode_login);
    },
  );
  ipcMain.handle(
    Global_State.events.get_fc_cancel_pix,
    async (event, id: string) => {
      return JSON.stringify(await CancelPix(id));
    },
  );
  ipcMain.handle(
    Global_State.events.get_fc_refresh_pix,
    async (event, id: string) => {
      return JSON.stringify(await RefreshPix(id));
    },
  );
  ipcMain.handle(
    Global_State.events.get_fc_send_message_on_whatsapp,
    (event, data_to_message: IWhatsAppMessage) => {
      return SendMessageOnWhatsapp(data_to_message);
    },
  );
}

export { RegisterListenersIpcMain };
