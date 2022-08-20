import type { BrowserWindow, BrowserWindowConstructorOptions } from "electron";
import { join } from "path";

export const createDefaultWindow = (
  path_preload?: string | null,
  WindowOptions?: BrowserWindowConstructorOptions,
) => {
  const { BrowserWindow } = require("electron");
  const mainWindow = new BrowserWindow({
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webviewTag: false,
      devTools: import.meta.env.DEV,
      preload: path_preload
        ? path_preload
        : join(__dirname, "../../preload/dist/index.cjs"),
    },
    ...WindowOptions,
  });
  return mainWindow;
};

export function ToggleWindow(
  Window: BrowserWindow,
  cb?: (isVisible: boolean) => void,
) {
  if (Window.isVisible()) {
    Window.hide();
    cb && cb(false);
  } else {
    Window.show();
    Window.focus();
    cb && cb(true);
  }
}
