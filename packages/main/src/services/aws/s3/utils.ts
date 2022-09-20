const path = require("path");
//utilities
const MapRegex: { [key: string]: string } = {
  á: "u00e1",
  à: "u00e0",
  â: "u00e2",
  ã: "u00e3",
  ä: "u00e4",
  Á: "u00c1",
  À: "u00c0",
  Â: "u00c2",
  Ã: "u00c3",
  Ä: "u00c4",
  é: "u00e9",
  è: "u00e8",
  ê: "u00ea",
  É: "u00c9",
  È: "u00c8",
  Ê: "u00ca",
  Ë: "u00cb",
  í: "u00ed",
  ì: "u00ec",
  î: "u00ee",
  ï: "u00ef",
  Í: "u00cd",
  Ì: "u00cc",
  Î: "u00ce",
  Ï: "u00cf",
  ó: "u00f3",
  ò: "u00f2",
  ô: "u00f4",
  õ: "u00f5",
  ö: "u00f6",
  Ó: "u00d3",
  Ò: "u00d2",
  Ô: "u00d4",
  Õ: "u00d5",
  Ö: "u00d6",
  ú: "u00fa",
  ù: "u00f9",
  û: "u00fb",
  ü: "u00fc",
  Ú: "u00da",
  Ù: "u00d9",
  Û: "u00db",
  ç: "u00e7",
  Ç: "u00c7",
  ñ: "u00f1",
  Ñ: "u00d1",
  "&": "u0026",
  "'": "u0027",
};

//utilities
function error(e: any) {
  return Promise.reject(e);
}
function HashUnique(size: number) {
  let dt = new Date().getTime();
  const base_size = "xxxxxx-xxxxxxxx-xxxxxxxx-xxxxxxxx-xxxxxxxxxxx";
  const new_size = base_size.substring(0, Number(size) < 5 ? 5 : Number(size));
  const uuid = new_size.replace(/[xy]/g, function (c) {
    const r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
}
function round(n: number, multiplicador: number) {
  const N = n || "";
  const value = N.toString().replace(/\D/g, "");
  let a = Math.round(Number(value) / multiplicador) * multiplicador;
  if (a < 5) a = 5;
  return a;
}
function EncodeURI(text: string) {
  return encodeURIComponent(text).replace(/%/gm, "%%");
}
function OnlyNameDescription(name: string, sizeHash: number) {
  let newName = name.split(".").shift() || "";
  newName = newName.substring(0, newName.length - (sizeHash + 3));
  newName = newName.replace(/_/gm, " ");
  return newName;
}
function GenererateNameFileUnique(
  name_file: string,
  hash_size: number,
  expires: number,
) {
  const name =
    path.basename(name_file).split(".")[0] +
    " " +
    HashUnique(hash_size) +
    "_" +
    expires +
    path.extname(name_file);
  return name.replace(/\s/g, "_");
}
function Convert_Especial_Caracteres_in_Unicod_To_UTF8(value: string) {
  let string = value;
  for (const props in MapRegex) {
    const regex = new RegExp(MapRegex[props], "g");
    string = string.replace(regex, props);
  }

  for (const props in MapRegex) {
    let texttoRegx = MapRegex[props];
    texttoRegx = texttoRegx.toUpperCase().replace("U", "u").replace("G", "g");
    const regex = new RegExp(texttoRegx, "g");
    string = string.replace(regex, props);
  }
  string = string.replace(/%20/gm, " ");
  return string;
}
function Convert_UTF16_To_Emoji(string: string) {
  return string.replace(/\u[0-9a-fA-F]{4}/gi, function (match) {
    return String.fromCharCode(parseInt(match.replace(/\u/g, ""), 16));
  });
}

function MountMessage(
  message: string,
  files: IUploadedFiles[],
  sizeHash: number,
  footer_message: string,
) {
  let NewMessage = message ? message + "\n" : "";
  NewMessage = NewMessage.replace(/\[n\]/gm, "\n");
  if (NewMessage.length > 0) NewMessage += "\n";

  files.forEach((obj, i) => {
    console.log(obj.description_name);

    const description =
      obj.description_name === undefined
        ? OnlyNameDescription(String(obj.name), sizeHash) ||
          "Link " + (i + 1) + ":\n"
        : obj.description_name;

    const description_after_link = obj.description_after_link || "";
    if (!obj.auto_format) {
      NewMessage += description + String(obj.url) + description_after_link;
    } else {
      if (description) {
        NewMessage += "-" + description + ":\n";
      }
      NewMessage += obj.url + "\n" + description_after_link + "\n";
    }
  });
  if (footer_message) {
    const footer = footer_message.replace(/\[n\]/gm, "\n");
    NewMessage += footer;
  }

  return NewMessage;
}

export {
  round,
  HashUnique,
  error,
  MountMessage,
  EncodeURI,
  OnlyNameDescription,
  Convert_Especial_Caracteres_in_Unicod_To_UTF8,
  Convert_UTF16_To_Emoji,
  GenererateNameFileUnique,
};
