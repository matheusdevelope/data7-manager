import axios from "axios";
import { readFile } from "fs/promises";
import FormData from "form-data";
import { basename, normalize } from "path";
import { existsSync } from "fs";
import { Global_State } from "/@/global_state";
import { GetKeyValue } from "../local_storage";
import {
  EnumKeysWhatsappIntegrated,
  EnumServices,
} from "../../../../../types/enums/configTabsAndKeys";
export async function SendMessageWhatsappRemoteProvider(
  phone: string,
  messages: IMessageWhatsapp[],
) {
  const AddressRemoteServer = String(
    GetKeyValue({
      key: EnumKeysWhatsappIntegrated.remote_service_address,
      sub_category: EnumServices.whatsapp_integrated,
    }),
  );
  const form = new FormData();
  let FilesCount = 0;
  for (let i = 0; i < messages.length; i++) {
    const { file_path } = messages[i];
    try {
      if (file_path) {
        const path_nomalized = normalize(file_path);
        if (!existsSync(path_nomalized))
          return Promise.reject(
            `The provided path doesn't exists [${file_path}]`,
          );
        const NameFile = basename(path_nomalized);
        const file = await readFile(path_nomalized);
        form.append("files", file, NameFile);
        FilesCount++;
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }

  if (FilesCount > 0) {
    try {
      await axios.post(
        `http://${AddressRemoteServer}/data7/upfile?dir=${Global_State.machine_id}`,
        form,
        {
          ...form.getHeaders(),
        },
      );
    } catch (error) {
      Promise.reject("Failed on sent files to remote provider: " + error);
    }
  }
  try {
    const data = await axios.post(
      `http://${AddressRemoteServer}/data7/send_message_whatsapp?dir=${Global_State.machine_id}`,
      {
        phone: phone,
        messages: messages,
      },
    );
    return Promise.resolve(data.data);
  } catch (error) {
    Promise.reject("Failed on sent messages to remote provider: " + error);
  }
}
