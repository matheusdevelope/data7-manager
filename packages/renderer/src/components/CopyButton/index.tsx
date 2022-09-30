import React, { useState } from "react";
import { BoxProps, Flex, Text } from "@chakra-ui/react";
import { BsClipboardPlus } from "react-icons/bs";

interface IProps extends BoxProps {
  text: string;
  text_on_copy?: string;
}

export default function CopyButton({ text, text_on_copy, ...props }: IProps) {
  const [copied, setCopied] = useState(false);
  return (
    <Flex
      direction={"column"}
      alignItems={"center"}
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 3000);
      }}
      {...props}
    >
      <BsClipboardPlus color={copied ? "green" : "black"} />
      {copied && (
        <Text fontSize={8} textAlign="center">
          {text_on_copy ? text_on_copy : "Copiado!"}
        </Text>
      )}
    </Flex>
  );
}
