export function ValidateCPF(strCPF: string) {
  let Soma;
  let Resto;
  Soma = 0;
  if (strCPF == "00000000000") return false;

  for (let i = 1; i <= 9; i++)
    Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);
  Resto = (Soma * 10) % 11;

  if (Resto == 10 || Resto == 11) Resto = 0;
  if (Resto != parseInt(strCPF.substring(9, 10))) return false;

  Soma = 0;
  for (let i = 1; i <= 10; i++)
    Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i);
  Resto = (Soma * 10) % 11;

  if (Resto == 10 || Resto == 11) Resto = 0;
  if (Resto != parseInt(strCPF.substring(10, 11))) return false;
  return true;
}
export function ValidateCNPJ(strCNPJ: string) {
  // Verifica se a variável cnpj é igua a "undefined", exibindo uma msg de erro
  if (!strCNPJ) return false;

  // Esta função retira os caracteres . / - da string do cnpj, deixando apenas os números
  const CNPJ = strCNPJ
    .replace(".", "")
    .replace(".", "")
    .replace("/", "")
    .replace("-", "");

  // Testa as sequencias que possuem todos os dígitos iguais e se o cnpj não tem 14 dígitos, retonando falso e exibindo uma msg de erro
  if (
    CNPJ === "00000000000000" ||
    CNPJ === "11111111111111" ||
    CNPJ === "22222222222222" ||
    CNPJ === "33333333333333" ||
    CNPJ === "44444444444444" ||
    CNPJ === "55555555555555" ||
    CNPJ === "66666666666666" ||
    CNPJ === "77777777777777" ||
    CNPJ === "88888888888888" ||
    CNPJ === "99999999999999" ||
    CNPJ.length !== 14
  ) {
    return false;
  }

  // A variável numeros pega o bloco com os números sem o DV, a variavel digitos pega apenas os dois ultimos numeros (Digito Verificador).
  let tamanho = CNPJ.length - 2;
  let numeros = CNPJ.substring(0, tamanho);
  const digitos = CNPJ.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;

  // Os quatro blocos seguintes de funções irá reaizar a validação do CNPJ propriamente dito, conferindo se o DV bate. Caso alguma das funções não consiga verificar
  // o DV corretamente, mostrará uma mensagem de erro ao usuário e retornará falso, para que o usário posso digitar novamente um número
  for (let i = tamanho; i >= 1; i--) {
    soma += Number(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) {
      pos = 9;
    }
  }

  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado != Number(digitos.charAt(0))) {
    return false;
  }

  tamanho = tamanho + 1;
  numeros = CNPJ.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;
  for (let k = tamanho; k >= 1; k--) {
    soma += Number(numeros.charAt(tamanho - k)) * pos--;
    if (pos < 2) {
      pos = 9;
    }
  }

  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado != Number(digitos.charAt(1))) {
    return false;
  }

  return true;
}
