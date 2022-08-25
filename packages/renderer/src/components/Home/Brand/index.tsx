import { Flex, FlexProps, Text } from "@chakra-ui/react";

interface IBrand extends FlexProps {
  title: string;
}

export default function Brand({ title, ...props }: IBrand) {
  return (
    <Flex
      h="10"
      align="center"
      justifyContent={"center"}
      fontSize="xl"
      fontWeight="semibold"
      {...props}
    >
      <Text>{title}</Text>
    </Flex>
  );
}
