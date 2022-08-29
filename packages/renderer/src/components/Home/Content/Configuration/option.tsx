import { Box, Flex, Text } from "@chakra-ui/react";
import RenderEditValue from "./EditValue";
const Color = {
  background: "#FFF",
  blackFont1: "#111423",
  blackFont2: "#101220",
  grayFont: "#8E93A5",
  colorFont: "#51608C",
  activeFont: "#383EA6",
  bgToggle: "#434CE7",
  hoverButton: "#EDF3FF",
};
interface IRender {
  options: IOptionConfig[];
  ChangeValue: (options: IOptionConfig[]) => void;
}

export default function RenderOption({ options, ChangeValue }: IRender) {
  return (
    <Box>
      {options.map((option, key) => (
        <Flex
          key={key}
          borderBottomColor="gray.200"
          borderBottomWidth={"1px"}
          p="2"
          fontSize={"sm"}
          justifyContent={"space-between"}
        >
          <Box color={Color.grayFont} w="full">
            <Text fontWeight="bold">{option.label}</Text>
            <Text>{option.description}</Text>
          </Box>
          <Flex direction="column" minW="180px" maxW="200px">
            <RenderEditValue
              option={option}
              changeOptions={(opt) => {
                const index = options.findIndex((op) => op.key === opt.key);
                if (index >= 0) {
                  let newOptions = options;
                  newOptions.splice(index, 1, opt);
                  ChangeValue([...newOptions]);
                }
              }}
            />
          </Flex>
        </Flex>
      ))}
    </Box>
  );
}
