import React, { useEffect, useState } from "react";
import { Box, Button, Center, Text, useDisclosure } from "@chakra-ui/react";
import AuthenticationModal from "../../AuthenticationModal";

export default function ConfigContent() {
  const [isAuthenticated, setIsAuthenticaded] = useState(false);
  const authentication = useDisclosure();
  useEffect(() => {
    authentication.onOpen();
  }, []);

  if (!isAuthenticated) {
    return (
      <Box>
        <Center>
          <Button onClick={authentication.onOpen}>Informar senha</Button>
        </Center>
        <AuthenticationModal
          isOpen={authentication.isOpen}
          onClose={authentication.onClose}
          onAuthenticated={() => setIsAuthenticaded(true)}
        />
      </Box>
    );
  }

  return (
    <Box borderWidth="4px" borderStyle="dashed" rounded="md" h="96">
      <Text>Essa é a configuration.</Text>
    </Box>
  );
}
