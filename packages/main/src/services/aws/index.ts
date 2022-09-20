import type { Request, Response } from "express";
import { readdirSync, existsSync, unlinkSync } from "fs";
import { join, normalize } from "path";
import {
  EnumKeysSendFilesWhats,
  EnumServices,
} from "../../../../../types/enums/configTabsAndKeys";
import { GetConfigTabs, GetServices } from "../local_storage";
import { SendMessageOnWhatsapp } from "../protocoll_events";
import ServiceS3 from "./s3";
import {
  error,
  GenererateNameFileUnique,
  MountMessage,
  EncodeURI,
  Convert_UTF16_To_Emoji,
  round,
} from "./s3/utils";
import { OnlyNumbersString } from "/@/utils";

export async function SendFilesToS3(
  files: IComumObject[],
  received_path?: string,
  Expiration?: number,
) {
  const Config = GetConfigTabs();
  const path_directory =
    received_path ||
    String(
      Config.find(
        (obj) =>
          obj.sub_category == EnumServices.whatsapp_send_files &&
          obj.key === EnumKeysSendFilesWhats.path_files,
      )?.value || "",
    );
  const DaysToExpireFile =
    Expiration ||
    Number(
      Config.find(
        (obj) =>
          obj.sub_category == EnumServices.whatsapp_send_files &&
          obj.key === EnumKeysSendFilesWhats.expiration,
      )?.value || 30,
    );
  const DisableAutoFormat = Boolean(
    Config.find(
      (obj) =>
        obj.sub_category == EnumServices.whatsapp_send_files &&
        obj.key === EnumKeysSendFilesWhats.disable_auto_format,
    )?.value || false,
  );
  if (!path_directory) {
    return Promise.reject("Nenhum path foi informado.");
  }
  try {
    const SendedFiles: IUploadedFiles[] = [];
    const Paths_Files = readdirSync(normalize(path_directory));
    for (let i = 0; i < Paths_Files.length; i++) {
      const Path = join(path_directory, Paths_Files[i]);
      const name_file = GenererateNameFileUnique(Path, 5, DaysToExpireFile);
      const File_Uploaded = await ServiceS3().create(
        Path,
        name_file,
        DaysToExpireFile,
      );
      const req_file = files.find((file) => file.name === Paths_Files[i]);
      const file_with_link = {
        name: File_Uploaded.Key,
        auto_format:
          req_file && req_file.auto_format === false
            ? false
            : DisableAutoFormat,
        description_name:
          req_file && req_file.description_name !== undefined
            ? String(req_file.description_name)
            : undefined,

        description_after_link:
          req_file && req_file.description_after_link
            ? String(req_file.description_after_link)
            : "",
        url: File_Uploaded.Location,
        expiration: DaysToExpireFile,
      };
      SendedFiles.push(file_with_link);
    }

    return SendedFiles;
  } catch (error) {
    console.error(error);
  }
}

function DeleteFiles(path: string) {
  if (path && existsSync(normalize(path))) {
    readdirSync(normalize(path)).forEach((file) => {
      unlinkSync(join(path, file));
    });
  }
}

function ValidateRequisition(body: { [key: string]: string | IComumObject[] }) {
  const errors: { [key: string]: string | { [key: string]: string } }[] = [];

  function CheckFiles() {
    if (!body.files) return;
    if (body.files.length < 1)
      errors.push({
        propriedade: "files",
        message:
          "Você precisa enviar um array contendo os dados dos arquivos, o array enviado está vazio.",
        // expected: {
        //   files: [
        //     {
        //       name: "nome-arquivo.png",
        //     },
        //     {
        //       name: "nome-arquivo2.pdf",
        //     },
        //   ],
        // },
        // received: [],
      });
    CheckName();
  }
  function CheckName() {
    if (!body.files) return;
    Array.isArray(body.files) &&
      body.files.forEach((element: any) => {
        if (!element.name)
          errors.push({
            propriedade: "files[i].name",
            message: "Você precisa enviar o nome do arquivo",
            expected: {
              name: "nome-arquivo.png",
            },
            received: element,
          });
        if (element.name && element.name.split(".").length < 2)
          errors.push({
            propriedade: "files[i].name",
            message:
              "Você precisa enviar o nome do arquivo com a extensão (.ext)",
            // expected: {
            //   files: [
            //     {
            //       name: "nome-arquivo.png",
            //     },
            //   ],
            // },
            received: element,
          });
      });
  }
  CheckFiles();
  if (!body.phone)
    errors.push({
      message: "Phone to send to whatsapp not provided",
      fix: "send a propertie [phone:'66999999999'].",
      // body_received: body,
    });

  if (!body.requester)
    errors.push({
      message:
        "Requester not provided, you need send that information to use this API",
      fix: "send a propertie [requester:'your_name'] with your info",
      // body_received: body,
    });

  return {
    message: "Invalid request body, errors: ",
    erros: errors,
    body_received: body,
  };
}

export async function UploadAndSendToWhats(req: Request, res: Response) {
  let retorno = {
    message:
      "Humm... não houveram erros de validação porém nenhum resultado foi retornado. Acho que deu ruim",
    data: {},
    exceptions: "none",
    requester: "",
  };
  const path_files =
    req.body.path_files ||
    String(
      GetConfigTabs().find(
        (obj) =>
          obj.sub_category === EnumServices.whatsapp_send_files &&
          obj.key === EnumKeysSendFilesWhats.path_files,
      )?.value,
    ) ||
    "";

  try {
    const ServiceActivated = GetServices().find(
      (obj) => obj.sub_category === EnumServices.whatsapp_send_files,
    )?.value;
    if (ServiceActivated !== true) {
      return await error({
        message: "The requested service is disabled.",
      });
    }
    const body = req.body as unknown as { [key: string]: string };
    const HashSize = Number(body.hash_size) || 5;
    const Expiration = round(Number(body.expiration || 30), 5);
    const Validation = ValidateRequisition(body);

    if (Validation.erros.length > 0) return res.status(400).send(Validation);

    if (!path_files)
      return await error({
        message:
          "You need to provide a valid path of files in the request body (path_files:'C:\\yout_path') or in the configuration of the service.",
      });
    if (!existsSync(normalize(path_files)))
      return await error({
        message: "The informed path does not exist or could not be accessed.",
      });

    const list_name_files = readdirSync(normalize(path_files));

    if (!list_name_files || list_name_files.length <= 0)
      return await error({
        message: "The informed path returns a empty list os files.",
      });

    const files = await SendFilesToS3(
      req.body.files || [],
      path_files,
      Expiration,
    );
    if (!files || files.length <= 0)
      return await error({
        message: "List of files uploaded returns empty",
      });

    const message = Convert_UTF16_To_Emoji(
      MountMessage(
        req.body.header_message,
        files,
        HashSize,
        req.body.footer_message,
      ),
    );

    retorno = {
      message: "Success!",
      data: {
        files: files,
        message: message,
        message_encoded_URI: EncodeURI(message),
      },
      exceptions: "none",
      requester: req.body.requester,
    };
    SendMessageOnWhatsapp({
      phone: OnlyNumbersString(req.body.phone),
      message: message,
    });

    DeleteFiles(path_files);
  } catch (e) {
    DeleteFiles(path_files);
    return res.status(400).send(e);
  }

  return res.send(retorno);
}
