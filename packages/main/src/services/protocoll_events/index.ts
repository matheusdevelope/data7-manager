import { exec } from "child_process";
import { shell } from "electron";
import { EnumTypeOfCallback } from "../../../../../types/enums/QrCode";
import { apenasNumeros, MakeParamsFromObj } from "../../utils";

function CallQrCode({ qrcode, callback }: IOpenQrCode) {
  const params = MakeParamsFromObj(qrcode).join("^&");
  exec(`start data7://qrcode?${params}`);
  return callback({
    type: EnumTypeOfCallback.success,
    message: "Sucess on open window",
    error: null,
  });
}

function SendMessageOnWhatsapp(data: IWhatsAppMessage) {
  const newData = {
    text: data.message,
    phone: "55" + apenasNumeros(data.phone),
  };
  const params = MakeParamsFromObj(newData).join("^&");
  try {
    exec("start whatsapp://send?" + params, (e, stdout, stderr) => {
      if (e) {
        shell.openExternal("https://web.whatsapp.com/send?" + params);
      }
      stderr && console.error(stderr);
    });
  } catch (error) {
    console.log(error);
  }
}
export { CallQrCode, SendMessageOnWhatsapp };
