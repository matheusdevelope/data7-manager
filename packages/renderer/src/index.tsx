import React from "react";
import ReactDOM from "react-dom/client";
import RouterAplication from "./router";
// import "./index.css";
import "@fontsource/roboto";
import { ChakraProvider, extendTheme, ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};
const styles = {
  global: {
    "html, body": {
      bg: "transparent",
      color: "black",
    },
  },
};
const fonts = {
  // heading: `'Heading Font Name', sans-serif`,
  body: `'Roboto', sans-serif`,
};

const theme = extendTheme({ config, styles, fonts });

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <RouterAplication />
    </ChakraProvider>
  </React.StrictMode>
);
