interface IDevice {
  id: string;
  identificacao: string;
  socket_id: string;
}

interface IDeviceMobile {
  id: string;
  identification: string;
  socket_id: string;
  online: boolean;
}
