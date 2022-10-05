import { exec } from "child_process";
import { shell } from "electron";
import { existsSync } from "fs";
import { EnumIpcEvents } from "../../../../../types/enums/GlobalState";
import { MakeParamsFromObj } from "../../utils";
import { WindowPix } from "/@/windows/pix";

function CallQrCode(qrcode: IDataQrCode) {
  WindowPix().Window.webContents.send(EnumIpcEvents.update_qrcode, qrcode);
}
async function OpenInBrowser(params: string[]) {
  return shell
    .openExternal("https://web.whatsapp.com/send?" + params.join("&"))
    .then(() => {
      return Promise.resolve(true);
    })
    .catch(() => {
      return Promise.reject(false);
    });
}
function SendMessageWhatsExternal(phone: string, message: string) {
  try {
    const newData = {
      phone: phone,
      text: message,
    };

    const params = MakeParamsFromObj(newData);
    return new Promise((resolve, reject) => {
      exec(
        "reg query HKEY_CLASSES_ROOT\\whatsapp\\shell\\open\\command",
        async (e, stdout, stderr) => {
          if (e || stderr) {
            await OpenInBrowser(params);
            return resolve(true);
          }
          if (!stdout.includes("REG_SZ")) {
            await OpenInBrowser(params);
            return resolve(true);
          }
          const PathFile = stdout.split('"')[1];
          if (!existsSync(PathFile)) {
            await OpenInBrowser(params);
            return resolve(true);
          }
          const Command = PathFile + " whatsapp://send?" + params.join("^&");

          exec(Command, async (e, stdout, stderr) => {
            try {
              if (e || stderr) {
                await OpenInBrowser(params);
                return resolve(true);
              }
              return resolve(true);
            } catch (error) {
              return reject(error);
            }
          });
          return resolve(true);
        },
      );
      return resolve(true);
    });
  } catch (error) {
    Promise.reject(error);
  }
}

export { CallQrCode, SendMessageWhatsExternal };
