import React from "react";
import ReactDOM from "react-dom/client";
import "@fontsource/roboto";
import { ChakraProvider, extendTheme, ThemeConfig } from "@chakra-ui/react";
import Entrar from "./pages/entrar";
const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};
const styles = {
  global: {
    "html, body": {
      bg: "transparent",
      color: "black",
      cursor: "default",
      userSelect: "none",
      webKitScrollbar: {
        w: "1",
      },
    },
  },
};

const fonts = {
  body: `'Roboto', sans-serif`,
};

const theme = extendTheme({
  config,
  styles,
  fonts,
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChakraProvider resetCSS theme={theme}>
      <Entrar />
    </ChakraProvider>
  </React.StrictMode>
);
