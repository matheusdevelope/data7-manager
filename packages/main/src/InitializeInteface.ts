import ControlTray from './handlers/ControlTray';
import { ToggleWindow } from './handlers/ControlWindows';
import { RegisterListenersIpcMain } from './handlers/ipmain';
import { WindowPix } from './windows/pix';

export function InitializeInterface() {
  RegisterListenersIpcMain();
  const PixWindow = WindowPix().Create();
  if (PixWindow) {
    ControlTray()
      .Create()
      .on('click', () => {
        ToggleWindow(PixWindow);
      });
  }
}
