import React from "react";
import ReactDOM from "react-dom/client";
import RouterAplication from "./router";
// import "./index.css";
import "@fontsource/roboto";
import { ChakraProvider, extendTheme, ThemeConfig } from "@chakra-ui/react";

import { getColor } from "@chakra-ui/theme-tools";
import { theme as defaultTheme } from "@chakra-ui/theme";
const borderColor = getColor(defaultTheme, "gray.300", "gray");
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

// __css={{
//   "&::-webkit-scrollbar": {
//     w: "1",
//   },
//   "&::-webkit-scrollbar-track": {
//     w: "1",
//   },
//   "&::-webkit-scrollbar-thumb": {
//     borderRadius: "10",
//     bg: `gray.400`,
//   },
// }}

const fonts = {
  // heading: `'Heading Font Name', sans-serif`,
  body: `'Roboto', sans-serif`,
};

const theme = extendTheme({
  config,
  styles,
  fonts,

  borders: {
    "1px": `1px solid ${borderColor}`,
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <RouterAplication />
    </ChakraProvider>
  </React.StrictMode>
);
