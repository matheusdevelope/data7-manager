import { Global_State } from './global_state';
import ControlTray from './handlers/ControlTray';
import { ToggleWindow } from './handlers/ControlWindows';
import { RegisterListenersIpcMain } from './handlers/ipmain';
import { CreateNotification } from './handlers/notifications';
import { WindowConfigurationPanel } from './windows/configuration';
import { WindowPix } from './windows/pix';

export function InitializeInterface() {
  CreateNotification({
    silent: true,
    title: Global_State.name_app,
    body: 'Data7 Manager ativo, aguardando atualizações.',
  });
  RegisterListenersIpcMain();
  WindowConfigurationPanel().Create();
  WindowPix().Create((Window) => {
    ControlTray()
      .Create()
      .on('click', () => {
        ToggleWindow(Window);
      });
  });
}
