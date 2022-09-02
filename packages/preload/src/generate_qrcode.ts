import type { QRCodeToDataURLOptions} from "qrcode";
import { toDataURL } from "qrcode";
export async function GenerateQrCode(
  string_to_base64: string,
  QRCodeToDataURLOptions?: QRCodeToDataURLOptions,
) {
  return toDataURL(string_to_base64, QRCodeToDataURLOptions);
}
