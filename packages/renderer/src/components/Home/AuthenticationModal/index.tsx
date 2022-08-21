import React, { useEffect, useState } from "react";
import {
  Button,
  FormControl,
  FormErrorMessage,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
interface IAuthenticationModal {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticated: () => void;
}
export default function AuthenticationModal({
  isOpen,
  onClose,
  onAuthenticated,
}: IAuthenticationModal) {
  const [localPass, setLocalPass] = useState<string | boolean>("");
  const [error, setError] = useState<string>("");
  const [validation, setValidation] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const initialRef = React.useRef<HTMLInputElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  async function GetLocalPass() {
    const result = await window.__electron_preload__GetLocalPassApp();
    if (!result || typeof result !== "string") {
      setError("Falha ao buscar senha para autenticação.");
      return;
    }
    return setLocalPass(result);
  }
  function ValidatePassword(pass: string) {
    if (pass !== localPass) {
      setValidation(true);
      initialRef.current?.focus();
      return;
    }
    setValidation(false);
    onAuthenticated();
    onClose();
  }
  function OnSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (initialRef.current) {
      ValidatePassword(initialRef.current.value);
    }
  }
  useEffect(() => {
    GetLocalPass();
  }, []);

  return (
    <>
      <Modal
        initialFocusRef={initialRef}
        isOpen={isOpen}
        onClose={onClose}
        size="sm"
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader color={error ? "red.500" : "white"}>
            {error
              ? error
              : " Insira a senha para ter acesso às configurações."}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <form onSubmit={OnSubmit}>
              <FormControl isInvalid={validation}>
                <InputGroup>
                  <Input
                    ref={initialRef}
                    placeholder="Senha"
                    type={showPass ? "text" : "password"}
                  />
                  <InputRightElement>
                    {showPass ? (
                      <ViewOffIcon onClick={() => setShowPass(!showPass)} />
                    ) : (
                      <ViewIcon onClick={() => setShowPass(!showPass)} />
                    )}
                  </InputRightElement>
                </InputGroup>

                <FormErrorMessage>
                  Senha incorreta, tente novamente.
                </FormErrorMessage>
              </FormControl>
            </form>
          </ModalBody>

          <ModalFooter>
            <Button ref={buttonRef} mr={3} onClick={OnSubmit}>
              Prosseguir
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
