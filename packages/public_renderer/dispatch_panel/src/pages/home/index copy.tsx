import {
  Box,
  Button,
  Divider,
  HStack,
  Icon,
  IconButton,
  IconProps,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import ItemsList from "/@/components/column";
// import socket from "/@/infra/socket";
import { Player } from "@lottiefiles/react-lottie-player";
import useSound from "use-sound";
import Coffee from "../../svg/animations/4qQI8BBTYK.json";
import LoadingAnimation from "../../svg/animations/loading.json";
import boopSfx from "../../../public/notification.mp3";
import { Socket, io } from "socket.io-client";

const regex = "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$";

let TotalItens = 0;

let socket:Socket|null //= io({reconnection:true,  reconnectionDelay:1000});
const MAX_RECONNECT_ATTEMPTS = 5;

export default function Home() {
  // const [socket, setSocket] = useState<Socket|null>(null);
  const [showModal, setShowModal] = useState(false);

  const [play] = useSound(boopSfx);
  const [connected, setConnected] = useState(false);
  const [disconnected, setDisconnected] = useState(false);
  const [items, setItems] = useState<{ [key: string]: string | number }[]>([]);
  const [last_time_received, setLast_time_received] = useState<Date>();
  const queryParams = new URLSearchParams(window.location.search);
  let CounterTotalItens = 0;


  async function fetchWithTimeout(resource: string | URL, timeout:number) {
   
    
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    const response = await fetch(resource, {
      timeout,
      signal: controller.signal  
    });
    clearTimeout(id);
    return response;
  }
 

  function connectSocket(){
    socket?.disconnect()
    socket?.removeAllListeners()
    socket?.close()
    socket = null
    socket = io({autoConnect:false,  reconnection:true,  reconnectionDelay:1000});
    socket.on('connect', () => {
      console.log('Connected to socket server');
      setConnected(true);
      setShowModal(false)
      setDisconnected(false)
     });

    socket.on('disconnect', () => {
      console.log('Disconnected from socket server');
      setConnected(false);
      setDisconnected(true)
    });
    socket.io.on("reconnect_attempt", (attempt) => {
      if (attempt >= MAX_RECONNECT_ATTEMPTS) {
        setShowModal(true) 
      }
      console.log('reconnect_attempt', attempt)
    });
    socket.on("data_dispath_panel", (data) => {
          Array.isArray(data) && setItems(data);
          setLast_time_received(new Date());
        });
        socket?.connect();
  }

  useEffect(() => {
    connectSocket()
    return () => {socket?.close()};
  }, []);

  useEffect(()=>{
    if(disconnected){
      socket?.disconnect()
      socket?.removeAllListeners()
      socket?.close()
      setTimeout(handleManualReconnect, 5000)
    }
    
  },[disconnected])


  useEffect(() => {
    if(connected){
      console.log('Check ping');
      fetchWithTimeout(window.location +'ping', 2000).catch(()=>{
          setConnected(false)
       setDisconnected(true)
        })
    
    }
  }, [connected]);

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleManualReconnect = () => {
    console.log('Attempting to manually reconnect to socket server...');
    connectSocket()
    setShowModal(false);
  };

  // useEffect(() => {
  //   socket.on("configs_dispath_panel", (data) => {
  //     setConnected(true);
  //   });
  //   socket.on("data_dispath_panel", (data) => {
  //     Array.isArray(data) && setItems(data);
  //     setLast_time_received(new Date());
  //     setConnected(true);
  //   });
  //   socket.on("disconnect", (reason) => {
  //     setConnected(false);
  //     socket.connect();
  //   });
  //   socket.connect();
  // }, []);


  useEffect(()=>{
    setInterval(async()=>{
      try {
         await fetchWithTimeout(window.location +'ping', 2000)
      } catch (error) {
        console.log(error);
        setConnected(false)
        setDisconnected(true)
      }
    }, 60*1000)
  },[])

  const CircleIcon = (props: IconProps) => (
    <Icon viewBox="0 0 200 200" {...props}>
      <path
        fill="currentColor"
        d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
      />
    </Icon>
  );

  const obj_paineis: { [key: string]: any } = {};
  items.forEach((obj) => {
    let _filtered = true;
    const new_obj: { [key: string]: string } = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        new_obj[key.toLowerCase()] = String(obj[key]).toLowerCase();
      }
    }

    for (const [key, value] of queryParams.entries()) {
      if (
        new_obj[key.toLowerCase()] &&
        String(new_obj[key.toLowerCase()]).toLowerCase() !== value.toLowerCase()
      ) {
        _filtered = false;
      }
    }

    if (_filtered) {
      const _painel =
        (Number(obj.Config_Painel) || 0) > 0 ? obj.Config_Painel : 1;

      if (Array.isArray(obj_paineis[String(_painel)])) {
        obj_paineis[String(_painel)].push(obj);
      } else {
        obj_paineis[String(_painel)] = [obj];
      }
      CounterTotalItens++;
    }
  });

  if (CounterTotalItens > TotalItens) play();
  TotalItens = CounterTotalItens;
  CounterTotalItens = 0;
  const paineis = [];
  for (const list in obj_paineis) {
    if (Object.prototype.hasOwnProperty.call(obj_paineis, list)) {
      paineis.push(obj_paineis[list]);
    }
  }
  const orientation = items[0]?.Config_OrientacaoPainel
    ? String(items[0].Config_OrientacaoPainel).toLowerCase()
    : "horizontal";

  const legendas = String(items[0]?.Config_LegendaCores || "")
    .split(",")
    .filter((a) => a.length > 0)
    .map((value) => String(value).trim());

  const width_columns: { [key: string]: string } = {};

  const largura_colunas = String(items[0]?.Config_LarguraColunas || "")
    .split(",")
    .filter((a) => a.length > 0)
    .map((value) => String(value).trim());

  largura_colunas.forEach((column) => {
    if (column.includes(":")) {
      width_columns[column.split(":")[0]] = column.split(":")[1];
    }
  });

  return (
    <VStack height="100vh" margin={0} padding={0}>
      <VStack flex={1} overflow="hidden" width="100vw">
        {paineis.length === 0 ? (
          <VStack
            flex={1}
            alignItems="center"
            justifyContent="center"
            alignContent="center"
            paddingTop={20}
          >
            <Text fontWeight="bold" fontSize="6xl">
              Não existem itens para conferência, aguarde...
            </Text>
            {queryParams.get("icone")?.toLowerCase() === "coffee" ? (
              <Player src={Coffee} autoplay loop style={{ height: "100%" }} />
            ) : (
              <Player
                src={LoadingAnimation}
                autoplay
                loop
                style={{ height: "100%" }}
              />
            )}
          </VStack>
        ) : orientation == "horizontal" ? (
          <HStack
            overflow="auto"
            alignItems="flex-start"
            flex={1}
            width="100vw"
          >
            {paineis.map((list, key) => (
              <Box key={key} flex={1}>
                <ItemsList
                  title={list[0].Config_TituloPainel || "Painel De Expedição"}
                  data={list}
                  columns_width={width_columns}
                />
                <Divider orientation="vertical" colorScheme="gray" />
              </Box>
            ))}
          </HStack>
        ) : (
          <VStack
            overflow="auto"
            alignItems="flex-start"
            flex={1}
            minWidth="100vw"
          >
            {paineis.map((list, key) => (
              <VStack key={key} flex={1}>
                <ItemsList
                  title={list[0].Config_TituloPainel || "Painel De Expedição"}
                  data={list}
                  w="100vw"
                  columns_width={width_columns}
                />
                <Divider orientation="horizontal" colorScheme="gray" />
              </VStack>
            ))}
          </VStack>
        )}
      </VStack>

      <HStack
        h="max-content"
        w="100vw"
        justifyContent="space-between"
        alignContent="center"
        padding="0 16px"
        fontSize="2xl"
        overflow="hidden"
      >
        <HStack flex={1}>
          <Text>{legendas.length > 0 && "Tempo em Expedição:"}</Text>
          {legendas.map((legenda, key) => {
            if (
              legenda.includes(":") &&
              legenda.split(":")[0].match(new RegExp(regex))
            )
              return (
                <Text key={key}>
                  <CircleIcon color={legenda.split(":")[0]} />{" "}
                  {legenda.split(":")[1]}
                </Text>
              );
          })}
        </HStack>
        <Text>Ultima Atualização: {last_time_received?.toLocaleString()}</Text>
        <HStack flex={1} justifyContent="flex-end">
          <CheckCircleIcon color={connected ? "green" : "red"} />
          {
            connected ?<Text>Conectado</Text> :
<Button colorScheme="blue"  onClick={()=>{
  handleManualReconnect()
}}>Reconectar</Button>
          }
        </HStack>
     
      </HStack>
     
       <Modal isCentered isOpen={showModal} onClose={handleCloseModal}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Atenção</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
      A conexão com o servidor foi perdida.
      </ModalBody>

      <ModalFooter>
        <Button variant='ghost' colorScheme='blue' mr={3} onClick={handleCloseModal}>
          Close
        </Button>
        <Button autoFocus  colorScheme='blue' onClick={handleManualReconnect} >Reconectar</Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
    </VStack>
  );
}
