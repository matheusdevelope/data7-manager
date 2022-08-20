import type { MenuItemConstructorOptions } from 'electron';
import { app, BrowserWindow, dialog, Menu, Tray } from 'electron';
import { resolve } from 'path';
import { Global_State } from '../global_state';
let AppTray: Tray;
const Menus: MenuItemConstructorOptions[] = [
  {
    label: 'Reiniciar',
    click: () => {
      BrowserWindow.getAllWindows().map((Window) => {
        Window.removeAllListeners();
        Window.destroy();
      });
      app.relaunch();
      app.quit();
    },
  },
  {
    label: 'Encerrar',
    click: () => {
      BrowserWindow.getAllWindows().map((Window) => {
        Window.removeAllListeners();
        Window.destroy();
      });

      app.quit();
    },
  },
  {
    label: 'Sobre',
    click: () => {
      dialog.showMessageBox({
        type: 'info',
        title: 'Sobre',
        message:
          'Data7 Manager v' +
          app.getVersion() +
          '\nIP Local: ' +
          Global_State.local_ip +
          '\nEstação de Trabalho: ' +
          Global_State.hostname +
          '\nUsuario Logado: ' +
          Global_State.username_machine,
      });
    },
  },
];
export default function ControlTray() {
  function Create(path_icon?: string, tool_tip = '') {
    const default_path_icon = resolve(__dirname, 'icon.png');
    if (!AppTray) {
      AppTray = new Tray(path_icon ? path_icon : default_path_icon);
    }
    AppTray.setToolTip(tool_tip);
    AppTray.setContextMenu(BuildMenu(Menus));
    return AppTray;
  }

  function BuildMenu(Menus: MenuItemConstructorOptions[]) {
    return Menu.buildFromTemplate(Menus);
  }

  function AddAction(MenuItem: MenuItemConstructorOptions) {
    Menus.reverse().push(MenuItem);
    if (AppTray) {
      AppTray.setContextMenu(BuildMenu(Menus.reverse()));
    }
  }
  return {
    Create,
    Tray: AppTray,
    AddAction,
  };
}
