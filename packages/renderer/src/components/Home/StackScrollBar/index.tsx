import { HStack, Stack, StackProps } from "@chakra-ui/react";

export function StackScrollBar({ children, ...props }: StackProps) {
  return (
    <Stack
      overflowX="hidden"
      overflowY="auto"
      __css={{
        "&::-webkit-scrollbar": {
          w: "1",
        },
        "&::-webkit-scrollbar-track": {
          w: "1",
        },
        "&::-webkit-scrollbar-thumb": {
          borderRadius: "10",
          bg: `gray.400`,
        },
      }}
      {...props}
    >
      {children}
    </Stack>
  );
}

export function HStackScrollBar({ children, ...props }: StackProps) {
  return (
    <HStack
      overflowX="auto"
      overflowY="hidden"
      __css={{
        "&::-webkit-scrollbar": {
          h: "1",
        },
        "&::-webkit-scrollbar-track": {
          h: "1",
        },
        "&::-webkit-scrollbar-thumb": {
          borderRadius: "10",
          bg: `gray.100`,
        },
      }}
      {...props}
    >
      {children}
    </HStack>
  );
}
