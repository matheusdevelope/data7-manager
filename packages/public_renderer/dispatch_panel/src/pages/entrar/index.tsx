import { Button, VStack } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import Home from "../home";

export default function Entrar() {
  const [Start, setStart] = useState(false);
  const BtnRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    BtnRef.current?.focus();
  }, []);
  if (!Start)
    return (
      <VStack height="100vh" margin={0} padding={0} bgColor="#ededed">
        <Button
          ref={BtnRef}
          variant="solid"
          margin="auto"
          onClick={() => {
            setStart(true);
          }}
          bgColor="#006B98"
          w={300}
          fontSize="2xl"
          color="white"
          padding={6}
        >
          Abrir Painel
        </Button>
      </VStack>
    );

  return <Home />;
}
