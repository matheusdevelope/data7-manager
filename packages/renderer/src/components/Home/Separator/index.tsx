import { Flex, FlexProps } from "@chakra-ui/react";

export default function Separator({ ...props }: FlexProps) {
  return <Flex h="1px" w="100%" bg="gray.300" {...props} />;
}
