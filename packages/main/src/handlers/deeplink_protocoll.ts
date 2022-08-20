import type { App, BrowserWindow } from 'electron';
import { dialog } from 'electron';
import parseUrl from 'parse-url';
import * as path from 'path';
import { Global_State } from '../global_state';
import { WindowPix } from '../windows/pix';

function HandleDeepLinkProtocoll(
  event: Electron.Event,
  commandLine: string[],
  _: string,
) {
  const deeplinkingUrl = commandLine.find((arg) =>
    arg.startsWith(`${Global_State.protocoll_register}://`),
  );

  if (deeplinkingUrl) {
    const parsed_url = parseUrl(deeplinkingUrl);
    switch (parsed_url.resource) {
      case 'qrcode':
        HandleQrCode(deeplinkingUrl, WindowPix().Window);
        break;
      default:
        dialog.showMessageBox(WindowPix().Window, {
          title: 'Data7',
          message: `Recurso solicitado indispoível: ${parsed_url.resource}`,
        });
        break;
    }
  }
  return;
}

function RegisterDeepLink(app: App) {
  if (process.defaultApp) {
    if (process.argv.length >= 2) {
      app.setAsDefaultProtocolClient(
        Global_State.protocoll_register,
        process.execPath,
        [path.resolve(process.argv[1])],
      );
    }
  } else {
    app.setAsDefaultProtocolClient(Global_State.protocoll_register);
  }
}
function StringBoolean_To_Boolean(string: string) {
  if (string === 'true') return true;
  return false;
}

function HandleQrCode(deeplinkingUrl: string, Window: BrowserWindow) {
  const query = parseUrl(deeplinkingUrl).query;
  const qrcode: IDataQrCode = {
    action: query.action,
    id: query.id,
    portion: query.portion,
    price: Number(query.price || 0),
    link: query.link,
    phone: query.phone,
    awaiting_payment: StringBoolean_To_Boolean(query.awaiting_payment),
    confirmed_payment: StringBoolean_To_Boolean(query.confirmed_payment),
    canceled: StringBoolean_To_Boolean(query.canceled),
    message: query.message,
    img: query.img,
    error: query.error,
    created_at: query.created_at,
  };

  Window.webContents.send(Global_State.events.update_qrcode, qrcode);
  return;
}
export { HandleDeepLinkProtocoll, RegisterDeepLink };
