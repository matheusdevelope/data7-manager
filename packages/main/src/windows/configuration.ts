import type { BrowserWindow } from 'electron';
import ControlTray from '../handlers/ControlTray';
import { createDefaultWindow } from '../handlers/ControlWindows';

let Window: BrowserWindow;

function Create() {
  Window = createDefaultWindow(null, {
    show: false,
    fullscreenable: false,
  });
  Window.on('ready-to-show', () => {
    RegisterMenusOnTray();
    // if (import.meta.env.DEV) {
    //   Window?.webContents.openDevTools({ mode: "detach" });
    // }
  });

  // if (Global_State.isDev) {
  //   win.loadURL(`http://localhost:3000#/${route}`);
  // } else {
  //   win.loadURL(`file://${app.getAppPath()}/dist/index.html#/${route}`);
  // }

  const pageUrl =
    import.meta.env.DEV && import.meta.env.VITE_DEV_SERVER_URL !== undefined
      ? import.meta.env.VITE_DEV_SERVER_URL
      : new URL(
          '../renderer/dist/index.html',
          'file://' + __dirname,
        ).toString();

  Window.loadURL(pageUrl);

  return Window;
}
function RegisterMenusOnTray() {
  ControlTray().AddAction({
    label: 'Configurações',
    click: () => {
      if (!Window || Window.isDestroyed()) {
        const newWindow = Create();
        newWindow.show();
        newWindow.focus();
      } else {
        if (Window.isMinimized() || !Window.isFocused()) {
          Window.show();
          Window.focus();
        }
      }
    },
  });
}

export function WindowConfigurationPanel() {
  return {
    Window,
    Create,
  };
}
