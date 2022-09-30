import type { BrowserWindow, BrowserWindowConstructorOptions } from "electron";
import { join } from "path";

interface CreatedWindows {
  window: BrowserWindow;
  id: string;
}
export const WindowsCreated: CreatedWindows[] = [];

interface ICreateDefaultWindow {
  id: string;
  WindowOptions?: BrowserWindowConstructorOptions;
  path_preload?: string | null;
}
export const createDefaultWindow = ({
  id,
  path_preload,
  WindowOptions,
}: ICreateDefaultWindow) => {
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

  WindowsCreated.push({
    window: mainWindow,
    id: id,
  });
  return mainWindow;
};

export function ToggleWindow(
  Window: BrowserWindow,
  cb?: (isVisible: boolean) => void,
) {
  if (Window.isDestroyed()) return false;
  if (Window.isVisible()) {
    Window.hide();
    cb && cb(false);
    return Window.isVisible();
  } else {
    Window.show();
    Window.focus();
    cb && cb(true);
    return Window.isVisible();
  }
}
