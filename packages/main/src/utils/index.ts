function MakeParamsFromObj<T>(obj: T) {
  const text = [];
  for (const props in obj) {
    if (typeof obj[props] == 'string') {
      text.push(props + '=' + EncodeURI(String(obj[props])));
    } else {
      text.push(props + '=' + obj[props]);
    }
  }
  return text;
}
function EncodeURI(text: string) {
  return encodeURIComponent(text);
}
function apenasNumeros(string: string) {
  return string.replace(/[^0-9]/g, '');
}

export { MakeParamsFromObj, EncodeURI, apenasNumeros };
