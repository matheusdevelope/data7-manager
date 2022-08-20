interface IDataQrCode {
  action: ActionsQrCode;
  id: string;
  img: string;
  link: string;
  phone: string;
  awaiting_payment: boolean;
  confirmed_payment: boolean;
  canceled: boolean;
  error?: string;
  message: string;
}
