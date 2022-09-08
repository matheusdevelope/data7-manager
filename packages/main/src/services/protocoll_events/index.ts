import { exec } from "child_process";
import { shell } from "electron";
import { EnumIpcEvents } from "../../../../../types/enums/GlobalState";
import { EnumTypeOfCallback } from "../../../../../types/enums/QrCode";
import { apenasNumeros, MakeParamsFromObj } from "../../utils";
import { WindowPix } from "/@/windows/pix";

function CallQrCode({ qrcode, callback }: IOpenQrCode) {
  WindowPix().Window.webContents.send(EnumIpcEvents.update_qrcode, qrcode);
  // const params = MakeParamsFromObj(qrcode).join("^&");
  // exec(`start data7://qrcode?${params}`);
  return callback({
    type: EnumTypeOfCallback.success,
    message: "Sucess on open window",
    error: null,
  });
}

function SendMessageOnWhatsapp(data: IWhatsAppMessage) {
  const newData = {
    phone: "55" + apenasNumeros(data.phone),
    text: data.message,
  };
  const params = MakeParamsFromObj(newData);

  try {
    exec("start whatsapp://send?" + params.join("^&"), (e, stdout, stderr) => {
      if (e) {
        shell.openExternal("https://web.whatsapp.com/send?" + params.join("&"));
      }
      stderr && console.error(stderr);
    });
  } catch (error) {
    console.log(error);
  }
}
export { CallQrCode, SendMessageOnWhatsapp };
