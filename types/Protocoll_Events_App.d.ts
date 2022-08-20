enum EnumTypeOfCallback {
  error,
  success,
}
enum EnumDevices {
  desktop,
  mobile,
}
interface ICallback {
  type: EnumTypeOfCallback;
  message: string;
  error: string | Error | null;
}
interface IOpenQrCode {
  qrcode: IDataQrCode;
  devices: EnumDevices[];
  callback: (callback: ICallback) => void;
}
interface ICloseQrCode {
  qrcode: IDataQrCode;
  devices: EnumDevices[];
  callback: (callback: ICallback) => void;
}
