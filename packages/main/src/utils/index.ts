function MakeParamsFromObj<T>(obj: T) {
  const text = [];
  for (const props in obj) {
    if (typeof obj[props] == "string") {
      text.push(props + "=" + EncodeURI(String(obj[props])));
    } else {
      text.push(props + "=" + obj[props]);
    }
  }
  return text;
}
function EncodeURI(text: string) {
  return encodeURIComponent(text);
}
function apenasNumeros(string: string) {
  return string.replace(/[^0-9]/g, "");
}
// function ValidateInterface<T>(obj: any, keys: (keyof T)[]): obj is T {
//   if (!obj || !Array.isArray(keys)) {
//     return false;
//   }

//   const implementKeys = keys.reduce((impl, key) => impl && key in obj, true);

//   return implementKeys;
// }
export { MakeParamsFromObj, EncodeURI, apenasNumeros };
