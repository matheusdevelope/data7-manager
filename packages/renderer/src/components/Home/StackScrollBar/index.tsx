import { Stack, StackProps } from "@chakra-ui/react";

export default function StackScrollBar({ children, ...props }: StackProps) {
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
