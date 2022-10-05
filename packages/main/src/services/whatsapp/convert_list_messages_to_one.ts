import { existsSync, mkdirSync, unlinkSync } from "fs";
import { normalize, join } from "path";
import {
  EnumKeysTerminalData,
  EnumTabs,
} from "../../../../../types/enums/configTabsAndKeys";
import ServiceS3 from "../aws/s3";
import { GetKeyValue } from "../local_storage";
import { OnlyDataBase64 } from "/@/utils";
import CompressImage from "/@/utils/compress_image";

export async function ConvertMessagesWhatsToOne(
  messages: IMessageWhatsapp[],
): Promise<string | IValidation[]> {
  const validation: IValidation[] = [];
  let Message = "";
  for (let i = 0; i < messages.length; i++) {
    const { text, image_base64, file_path } = messages[i];
    try {
      if (text && !image_base64 && !file_path) {
        Message += text + "\n";
      }
      if (image_base64) {
        Message += (await SendImage(image_base64, text)) + "\n";
      }
      if (file_path) {
        Message += (await SendFile(file_path, text)) + "\n";
      }
      Message += "\n";
    } catch (error) {
      validation.push({
        message: String(error),
      });
    }
  }

  if (validation.length > 0) return Promise.reject(validation);
  return Promise.resolve(Message);
}

async function SendFile(path: string, text?: string): Promise<string> {
  try {
    const path_nomalized = normalize(path);
    if (!existsSync(path_nomalized))
      return Promise.reject(`The provided path doesn't exists [${path}]`);
    const URL_File = await ServiceS3().create(path_nomalized);
    const Message = URL_File.Location;
    const TextToReturn = text ? text + "\n" + Message : Message;
    return Promise.resolve(TextToReturn);
  } catch (error) {
    return Promise.reject(error);
  }
}
async function SendImage(image_base64: string, text?: string): Promise<string> {
  try {
    const CleanedBase64 = OnlyDataBase64(image_base64);
    const TempDir = String(
      GetKeyValue({
        key: EnumKeysTerminalData.temp_files,
        category: EnumTabs.terminal_data,
      }),
    );
    const dir = `${TempDir}/files_to_s3/`;
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    const path_file = join(dir, `${new Date().toUTCString()}.png`);
    await CompressImage.toFile(
      await CompressImage.fromBase64(CleanedBase64),
      path_file,
    );
    const link = await SendFile(path_file);
    unlinkSync(path_file);
    const TextToReturn = text ? text + "\n" + link : link;

    return Promise.resolve(TextToReturn);
  } catch (error) {
    return Promise.reject(error);
  }
}
