import type { BrowserWindow, BrowserWindowConstructorOptions } from 'electron';
import { join } from 'path';

export const createDefaultWindow = (
  path_preload?: string | null,
  WindowOptions?: BrowserWindowConstructorOptions,
) => {
  const { BrowserWindow } = require('electron');
  const mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webviewTag: false,
      preload: path_preload
        ? path_preload
        : join(__dirname, '../../preload/dist/index.cjs'),
    },
    ...WindowOptions,
  });
  return mainWindow;
};

export function ToggleWindow(Window: BrowserWindow) {
  if (Window.isVisible()) {
    Window.hide();
  } else {
    Window.show();
  }
}
