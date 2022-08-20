import { useEffect, useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Dialog, { DefaultDialog } from "../../components/modal_dialog";
import { Button, Container, Form, Input, Text } from "./style";
declare global {
  interface Window {
    ElectronAPI: IElectronAPI;
  }
}

function Home() {
  const [localPass, setLocalPass] = useState<string | boolean>("");
  const [dialogState, setDialogState] = useState<IDialog>(DefaultDialog);
  const [pass, setPass] = useState("");
  const passRef = useRef<HTMLInputElement>(null);

  let navigate = useNavigate();

  async function GetLocalPass() {
    const result = await window.__electron_preload__GetLocalPassApp();
    if (typeof result == "string") return setLocalPass(result);
    if (!result) return setLocalPass(false);
    return setDialogState({
      ...DefaultDialog,
      isOpen: true,
      message:
        "Houve um erro ao buscar a senha local!\nError: " +
        JSON.stringify(result),
    });
  }
  async function SetLocalPass(pass: string) {
    const result = await window.__electron_preload__SetLocalPassApp(pass);
    if (result === true) {
      setDialogState({
        ...DefaultDialog,
        isOpen: true,
        onClickOK: CloseDialog,
        message: "Senha definida com sucesso!",
      });
      navigate("/config_panel");
      return;
    }

    return setDialogState({
      ...DefaultDialog,
      isOpen: true,
      onClickOK: CloseDialog,
      message:
        "Houve um erro ao salvar a senha local!\nError: " +
        JSON.stringify(result),
    });
  }
  function CloseDialog() {
    setDialogState({
      ...DefaultDialog,
    });
    passRef.current?.focus();
  }

  function OnSubmitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (pass.length < 8)
      return setDialogState({
        ...DefaultDialog,
        isOpen: true,
        onClickOK: CloseDialog,
        message: "A senha precisa ter pelo menos 8 digitos.",
      });
    if (!localPass) {
      SetLocalPass(pass);
    } else {
      if (localPass !== pass)
        return setDialogState({
          ...DefaultDialog,
          isOpen: true,
          onClickOK: CloseDialog,
          message: "Senha Incorreta!",
        });
      navigate("/config_panel");
      return;
    }
  }

  useEffect(() => {
    GetLocalPass();
    passRef.current?.focus();
  }, []);
  return (
    <Container>
      <Form onSubmit={OnSubmitForm}>
        {!localPass ? (
          <Text>Crie uma senha de acesso:</Text>
        ) : (
          <Text>Insira a sua senha:</Text>
        )}
        <Input
          type={"password"}
          value={pass}
          onChange={(e) => {
            setPass(e.target.value);
          }}
          ref={passRef}
        />
        <Button
          type="submit"
          style={{ backgroundColor: pass.length < 8 ? "#ddd" : "#348ccb" }}
        >
          {!localPass ? "Criar" : "Entrar"}
        </Button>
      </Form>
      <Dialog {...dialogState} />
    </Container>
  );
}

export default Home;
