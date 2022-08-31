import {
  InputGroup,
  Input,
  InputRightElement,
  Button,
  Switch,
  Text,
  Flex,
  Icon,
  FormControl,
  FormErrorMessage,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { MdAdd, MdDelete, MdDone, MdSave } from "react-icons/md";
import { EnumTypesOptions } from "../../../../../../../types/enums/configTabsAndKeys";
import { ValidateCNPJ, ValidateCPF } from "./validation";

const Color = {
  background: "#FFF",
  blackFont1: "#111423",
  blackFont2: "#101220",
  grayFont: "#8E93A5",
  colorFont: "#51608C",
  activeFont: "#383EA6",
  bgToggle: "#434CE7",
  hoverButton: "#EDF3FF",
};

interface IRenderEditValue {
  option: IOptionConfig;
  changeOptions: (opt: IOptionConfig) => void;
}
export default function RenderEditValue({
  option,
  changeOptions,
}: IRenderEditValue) {
  const [value, setValue] = useState<string | number | boolean>();
  const [validation, setValidation] = useState("");
  const [isEdited, setIsEdited] = useState(false);

  function OnlyNumber(value: string) {
    return value.replace(/[^0-9]/g, "");
  }

  function OnSubmit(e: React.FormEvent) {
    e.preventDefault();
    function RetArray(opt_value: string | number | boolean | string[]) {
      if (Array.isArray(opt_value)) {
        if (value) {
          const newValue = option.key.includes("cnpj_cpf")
            ? OnlyNumber(String(value))
            : String(value);
          if (!opt_value.find((opt) => opt == newValue)) {
            return [...opt_value, newValue];
          }
          return [...opt_value];
        } else {
          return [...opt_value];
        }
      } else {
        return [];
      }
    }
    if (
      option.type === EnumTypesOptions.array &&
      (typeof value === "string" || typeof value === "number")
    ) {
      if (
        value &&
        !(option.min_value_lenght
          ? option.min_value_lenght?.includes(OnlyNumber(String(value)).length)
          : true)
      ) {
        setValidation(
          "O valor precisa conter no minimo " +
            option.min_value_lenght?.join(", ") +
            " caracteres."
        );
      }
      if (
        option.key.includes("cnpj_cpf") &&
        !ValidateCPF(OnlyNumber(String(value))) &&
        !ValidateCNPJ(OnlyNumber(String(value)))
      ) {
        setValidation("CNPJ / CPF Inválido.");
      } else {
        changeOptions({ ...option, value: [...RetArray(option.value)] });
      }
    } else {
      if (value) {
        changeOptions({ ...option, value: value });
      }
    }
  }
  function OnChange(e: React.ChangeEvent<HTMLInputElement>) {
    !isEdited && setIsEdited(true);
    validation.length > 0 && setValidation("");
    if (option.type === EnumTypesOptions.boolean) {
      //  setValue(e.target.checked);
      changeOptions({ ...option, value: e.target.checked });
    } else {
      if (option.type === EnumTypesOptions.array) {
        setValue(e.target.value.substring(0, 18));
      } else {
        setValue(e.target.value);
      }
    }
  }
  function OnDeleteFromArray(key: number) {
    if (Array.isArray(option.value)) {
      let newValue = option.value;
      newValue.splice(key, 1);
      changeOptions({ ...option, value: newValue });
    }
  }
  function cnpj(v: string) {
    v = v.replace(/\D/g, ""); //Remove tudo o que não é dígito
    v = v.replace(/^(\d{2})(\d)/, "$1.$2"); //Coloca ponto entre o segundo e o terceiro dígitos
    v = v.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3"); //Coloca ponto entre o quinto e o sexto dígitos
    v = v.replace(/\.(\d{3})(\d)/, ".$1/$2"); //Coloca uma barra entre o oitavo e o nono dígitos
    v = v.replace(/(\d{4})(\d)/, "$1-$2"); //Coloca um hífen depois do bloco de quatro dígitos
    return v;
  }
  function cpf(v: string) {
    v = v.replace(/\D/g, ""); //Remove tudo o que não é dígito
    v = v.replace(/(\d{3})(\d)/, "$1.$2"); //Coloca um ponto entre o terceiro e o quarto dígitos
    v = v.replace(/(\d{3})(\d)/, "$1.$2"); //Coloca um ponto entre o terceiro e o quarto dígitos
    //de novo (para o segundo bloco de números)
    v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2"); //Coloca um hífen entre o terceiro e o quarto dígitos
    return v;
  }
  useEffect(() => {
    if (Array.isArray(option.value)) {
      setValue("");
    } else {
      setValue(option.value);
    }
    return () => setValue(undefined);
  }, [option]);

  if (option.type === EnumTypesOptions.array)
    return (
      <form onSubmit={OnSubmit}>
        <FormControl isInvalid={Boolean(validation)}>
          <InputGroup
            size={"sm"}
            variant="outline"
            borderColor={"gray.200"}
            borderRadius="8px"
          >
            <Input
              isDisabled={option.disabled === true}
              value={
                option.key.includes("cnpj_cpf")
                  ? String(value).length <= 15
                    ? cpf(String(value))
                    : cnpj(String(value))
                  : String(value)
              }
              onChange={OnChange}
              placeholder={option.tip}
              color={Color.blackFont1}
              borderRadius="8px"
              _placeholder={{ color: "gray.500" }}
            />
            <InputRightElement
              bg={"gray.300"}
              borderRadius="6"
              m="1"
              boxSize={"6"}
              children={
                <Button
                  type="submit"
                  p="0"
                  isDisabled={option.disabled === true}
                >
                  <MdAdd color="green.500" />
                </Button>
              }
            />
          </InputGroup>
          <FormErrorMessage>{validation}</FormErrorMessage>
        </FormControl>

        {Array.isArray(option.value) &&
          option.value.map((value, key) => (
            <Flex
              key={key}
              justifyContent="space-between"
              p="1"
              px="3"
              paddingRight="1"
              alignItems={"center"}
            >
              <Text>
                {option.key.includes("cnpj_cpf")
                  ? String(value).length <= 15
                    ? cpf(String(value))
                    : cnpj(String(value))
                  : String(value)}
              </Text>
              <Button
                size={"xs"}
                m="0"
                p="0"
                isDisabled={option.disabled === true}
                onClick={() => OnDeleteFromArray(key)}
              >
                <Icon color="gray.500" boxSize={"5"} as={MdDelete} m="0" />
              </Button>
            </Flex>
          ))}
      </form>
    );
  if (
    option.type === EnumTypesOptions.boolean &&
    typeof option.value === "boolean"
  )
    return (
      <Switch
        isDisabled={option.disabled === true}
        isChecked={option.value}
        onChange={OnChange}
        mx="auto"
        sx={{
          "span.chakra-switch__track:not([data-checked])": {
            backgroundColor: "gray.300",
          },
          "span.chakra-switch__track": {
            backgroundColor: Color.bgToggle,
          },
        }}
      />
    );

  return (
    <form onSubmit={OnSubmit}>
      <InputGroup
        size={"sm"}
        variant="outline"
        borderColor={"gray.200"}
        borderRadius="8px"
      >
        <Input
          value={String(value)}
          onChange={OnChange}
          placeholder={option.tip}
          color={Color.blackFont1}
          borderRadius="8px"
          _placeholder={{ color: "gray.500" }}
        />
        {option.value !== value && isEdited ? (
          <InputRightElement
            bg={"gray.300"}
            borderRadius="6"
            m="1"
            boxSize={"6"}
            children={
              <Button type="submit" p="0">
                <MdSave color="green.500" />
              </Button>
            }
          />
        ) : (
          <InputRightElement
            borderRadius="6"
            m="1"
            boxSize={"6"}
            children={<MdDone color="green" />}
          />
        )}
      </InputGroup>
    </form>
  );
}
