import { useEffect, useState } from "react";
import Dialog, { DefaultDialog } from "../../components/modal_dialog";
import {
  Button,
  Center,
  Container,
  ContainerObj,
  Footer,
  Form,
  Header,
  Input,
  Label,
  Text,
} from "./style";

function Config_Panel() {
  const [config, setConfig] = useState<IObjectConfig[]>([]);
  const [cnpj, setCnpj] = useState("");
  const [dialogState, setDialogState] = useState<IDialog>(DefaultDialog);

  async function GetLocalConfig() {
    try {
      const result = await window.__electron_preload__GetLocalConfig();
      setConfig(result);
    } catch (error) {
      return setDialogState({
        ...dialogState,
        isOpen: true,
        message:
          "Erro ao carregar configurações locais.\nError: " +
          JSON.stringify(error),
        onClickOK: () =>
          setDialogState({
            ...dialogState,
          }),
      });
    }
  }
  async function SetLocalConfig() {
    try {
      await window.__electron_preload__SetLocalConfig(config);

      setDialogState({
        ...dialogState,
        isOpen: true,
        message:
          "Configurações atualizadas com sucesso! O aplicativo irá reiniciar para aplicar as mudanças.",
        onClickOK: () => {
          setDialogState({
            ...dialogState,
          });
          window.__electron_preload__RefreshAplication();
        },
      });
    } catch (error) {
      return setDialogState({
        ...dialogState,
        isOpen: true,
        message:
          "Erro ao salvar as novas configurações.\nError: " +
          JSON.stringify(error),
        onClickOK: () =>
          setDialogState({
            ...dialogState,
          }),
      });
    }
  }
  function ChangeValue(index: number, value: string | number | boolean) {
    let newConfig = config;
    newConfig.splice(index, 1, {
      ...newConfig[index],
      value: value,
    });
    setConfig([...newConfig]);
  }

  useEffect(() => {
    GetLocalConfig();
  }, []);

  function RenderObjectConfig(obj: IObjectConfig, key: number) {
    return (
      <>
        {obj.type === "array" && (
          <>
            <ContainerObj key={key}>
              <Label>{obj.label}:</Label>
              <Input
                type={obj.type}
                onChange={(e) => {
                  setCnpj(e.target.value);
                }}
                value={cnpj}
              />
              <button
                onClick={() => {
                  const ListaCnpj: string[] = JSON.parse(String(obj.value));
                  ListaCnpj.push(cnpj);
                  setCnpj("");
                  ChangeValue(key, JSON.stringify(ListaCnpj));
                }}
              >
                Adicionar
              </button>
            </ContainerObj>
            {JSON.parse(String(obj.value)).map((objFromArray: string) => (
              <ContainerObj>
                <Text> {String(objFromArray)}</Text>
                <button
                  onClick={() => {
                    ChangeValue(
                      key,
                      JSON.stringify(
                        JSON.parse(String(obj.value)).filter(
                          (obj: string) => obj !== objFromArray
                        )
                      )
                    );
                  }}
                >
                  Deletar
                </button>
              </ContainerObj>
            ))}
          </>
        )}
        {obj.type !== "array" && (
          <ContainerObj key={key}>
            <Label>{obj.label}:</Label>
            {obj.type === "text" && (
              <Input
                type={obj.type}
                onChange={(e) => {
                  ChangeValue(key, e.target.value);
                }}
                value={String(obj.value)}
              />
            )}
            {obj.type === "number" && (
              <Input
                type={obj.type}
                onChange={(e) => {
                  ChangeValue(key, e.target.value);
                }}
                value={Number(obj.value)}
              />
            )}
            {obj.type === "checkbox" && (
              <Input
                type={obj.type}
                onChange={(e) => {
                  ChangeValue(key, e.target.checked);
                }}
                checked={Boolean(obj.value)}
              />
            )}
          </ContainerObj>
        )}
      </>
    );
  }

  return (
    <Container>
      <Header>Configurações</Header>
      <Center>
        <Form>
          {config
            .sort((obj_a, obj_b) => obj_a.order - obj_b.order)
            .map(RenderObjectConfig)}
        </Form>
      </Center>
      <Footer>
        <Button onClick={SetLocalConfig}>Salvar Alterações</Button>
      </Footer>
      <Dialog {...dialogState} />
    </Container>
  );
}

export default Config_Panel;
