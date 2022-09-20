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
function OnlyNumbersString(string: string) {
  return string.replace(/[^0-9]/g, "");
}
function ValidateInterface<T>(obj: T, keys: (keyof T)[]): obj is T {
  if (!obj || !Array.isArray(keys)) {
    return false;
  }

  const implementKeys = keys.reduce((impl, key) => impl && key in obj, true);

  return implementKeys;
}
function ObjectToLowerCase<T>(
  obj: IComumObject2,
  lower_prop = true,
  lower_value = false,
) {
  const NewObj: IComumObject2 = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];

      if (typeof value === "string") {
        NewObj[lower_prop ? key.toLowerCase() : key] = lower_value
          ? value.toLowerCase()
          : value;
      }
      if (typeof value === "object" && !Array.isArray(value)) {
        NewObj[lower_prop ? key.toLowerCase() : key] = ObjectToLowerCase(value);
      }
      if (typeof value === "number" || typeof value === "boolean") {
        NewObj[lower_prop ? key.toLowerCase() : key] = value;
      }
    }
  }
  return NewObj as unknown as T;
}
export {
  MakeParamsFromObj,
  EncodeURI,
  OnlyNumbersString,
  ValidateInterface,
  ObjectToLowerCase,
};
