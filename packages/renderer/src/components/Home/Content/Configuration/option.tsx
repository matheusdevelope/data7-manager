import { Box, Flex, HStack, Icon, Text } from "@chakra-ui/react";
import { useState } from "react";
import { MdKeyboardArrowRight } from "react-icons/md";
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
  key: number;
  option: IOptionConfig;
  ChangeValue: (option: IOptionConfig) => void;
}

export default function RenderOption({ option, key, ChangeValue }: IRender) {
  const [numberOfLines, setNumberOfLines] = useState(2);
  return (
    <Box>
      <Flex
        key={key}
        borderBottomColor="gray.200"
        borderBottomWidth={"1px"}
        p="2"
        fontSize={"sm"}
        justifyContent={"space-between"}
      >
        <Box color={Color.grayFont} w="full">
          <HStack>
            <Text fontWeight="bold">{option.label}</Text>
            <Icon
              as={MdKeyboardArrowRight}
              mr="12px"
              ml="auto"
              transform={
                numberOfLines === 2 ? "rotate(90deg)" : "rotate(270deg)"
              }
              onClick={() => setNumberOfLines(numberOfLines === 2 ? 20 : 2)}
            />
          </HStack>

          <Text noOfLines={numberOfLines}>{option.description}</Text>
        </Box>
        <Flex direction="column" minW="180px" maxW="200px">
          <RenderEditValue
            option={option}
            changeOptions={(opt) => ChangeValue(opt)}
          />
        </Flex>
      </Flex>
    </Box>
  );
}
