import {
  TableContainer,
  Table,
  TableCaption,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  TableContainerProps,
} from "@chakra-ui/react";

interface IItemsListProps extends TableContainerProps {
  title: string;
  data: any;
  columns_width: { [key: string]: string };
}

export default function ItemsList({
  title,
  data,
  columns_width,
  ...props
}: IItemsListProps) {
  const padding = 3;
  let columns: string[] = [];
  for (const key in data[0]) {
    const hidden_cols = String(data[0]?.Config_OcultarColunas || "")
      .toLowerCase()
      .split(",")
      .map((value) => String(value).trim());
    if (
      !key.toLowerCase().startsWith("config_") &&
      !hidden_cols.map((col) => col.trim()).includes(key.toLowerCase())
    ) {
      columns.push(key);
    }
  }
  columns = columns.sort((a, b) => {
    return a == b ? 0 : a > b ? 1 : -1;
  });
  const clean_columns = columns.map((title) =>
    title.substring(title.indexOf("_") + 1, title.length)
  );

  const sort_fields = String(data[0].Config_CampoOrdenacaoPainel || columns[0]);
  const sort_fields_order = String(
    data[0].Config_OrdenacaoPainel || "ASC"
  ).toLowerCase();

  const regex = "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$";
  let size_fonte = String(data[0].Config_TamanhoFonte || "0").replace(
    /[^0-9]/g,
    ""
  );
  size_fonte = size_fonte === "0" ? "1xl" : size_fonte;

  return (
    <TableContainer flex={1} overflowX="hidden" {...props}>
      <Table variant="simple" colorScheme="gray" size="sm">
        <TableCaption
          placement="top"
          fontWeight="bold"
          fontSize="4xl"
          margin={0}
          padding={1}
          borderBottom="1px"
        >
          {title}
        </TableCaption>
        <Thead>
          <Tr>
            {clean_columns.map((title) => (
              <Th key={title} padding={padding} fontSize={size_fonte}>
                {title}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {data
            .sort((a: any, b: any) => {
              const _a = sort_fields.toLowerCase().includes("data")
                ? String(a[sort_fields] || "")
                    .match(/\d+/g)
                    ?.join("") || ""
                : a[sort_fields];
              const _b = sort_fields.toLowerCase().includes("data")
                ? String(b[sort_fields] || "")
                    .match(/\d+/g)
                    ?.join("") || ""
                : b[sort_fields];
              if (sort_fields_order == "desc") {
                return _a == _b ? 0 : _a < _b ? 1 : -1;
              }
              return _a == _b ? 0 : _a > _b ? 1 : -1;
            })
            .map((item: any, key: any) => (
              <Tr key={key}>
                {columns.map((title) => {
                  let cor_fundo = String(item.Config_CorFundo);
                  let cor_fonte = String(item.Config_CorFonte);

                  cor_fundo =
                    cor_fundo.match(new RegExp(regex)) &&
                    cor_fundo.toLowerCase() !== "#fff"
                      ? cor_fundo
                      : key % 2 == 0
                      ? "#EDF2F7"
                      : "inherit";
                  cor_fonte = cor_fonte.match(new RegExp(regex))
                    ? cor_fonte
                    : key % 2 == 0
                    ? "#000"
                    : "inherit";

                  return (
                    <Td
                      backgroundColor={cor_fundo}
                      color={cor_fonte}
                      key={title}
                      padding={padding}
                      fontWeight="bold"
                      fontSize={size_fonte}
                      w={columns_width[title]}
                      minW={columns_width[title]}
                      maxW={columns_width[title]}
                      overflow="hidden"
                      textOverflow={"ellipsis"}
                    >
                      {item[title]}
                    </Td>
                  );
                })}
              </Tr>
            ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
