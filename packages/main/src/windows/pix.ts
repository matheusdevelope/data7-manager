import type { BrowserWindow } from 'electron';
import { screen } from 'electron';
import { Global_State } from '../global_state';
import ControlTray from '../handlers/ControlTray';
import { createDefaultWindow } from '../handlers/ControlWindows';
import { CreateNotification } from '../handlers/notifications';
import { Storage } from '../services/local_storage';

let Window: BrowserWindow;

function Create() {
  const screenElectron = screen;
  const display = screenElectron.getPrimaryDisplay();
  const dimensions = display.workAreaSize;

  const DimensionsUSer: IDimensions = Storage.has('dimensions')
    ? (Storage.get('dimensions') as unknown as IDimensions)
    : {
        width: Math.floor(dimensions.width * 0.25),
        height: Math.floor(dimensions.height * 0.45),
      };

  Window = createDefaultWindow(null, {
    width: DimensionsUSer.width,
    height: DimensionsUSer.height,
    minWidth: 400,
    minHeight: 460,
    maxWidth: dimensions.width,
    maxHeight: dimensions.height,
    show: false,
    frame: false,
    fullscreenable: false,
  });

  if (!Window) return;

  Window.on('minimize', function (event: { preventDefault: () => void }) {
    event.preventDefault();
    Window.hide();
  });

  Window.on('close', function (event) {
    event.preventDefault();
    Window.hide();
    return false;
  });

  Window.on('resized', () => {
    const { height, width } = screen.getPrimaryDisplay().workAreaSize;
    const position = Window.getBounds();
    const newX = width / 2 - position.width / 2;
    const newY = height / 2 - position.height / 2;
    Window.setBounds({ x: Math.floor(newX), y: Math.floor(newY) });
    Storage.set('dimensions', {
      width: position.width,
      height: position.height,
    });
  });

  Window.on('ready-to-show', () => {
    CreateNotification({
      silent: true,
      title: Global_State.name_app,
      body: 'O serviço PIX está ativo, aguardando atualizações.',
    });
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
    label: 'Parar/Ativar Serviço PIX',
    click: () => {
      if (Window.isDestroyed()) {
        Create();
      } else {
        Window.removeAllListeners();
        Window.destroy();
      }
    },
  });
}

export function WindowPix() {
  return {
    Window,
    Create,
  };
}
