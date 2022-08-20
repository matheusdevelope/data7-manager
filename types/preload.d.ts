interface ICancelQr {
  canceled: boolean;
  message: string;
  error?: string;
}
interface IRefreshQr {
  awaiting_payment: boolean;
  confirmed_payment: boolean;
  canceled: boolean;
  message: string;
  error?: string;
}

interface IDataQrCode {
  action: string;
  id: string;
  portion: string;
  price: number;
  img: string;
  link: string;
  phone: string;
  awaiting_payment: boolean;
  confirmed_payment: boolean;
  canceled: boolean;
  error?: string;
  message: string;
  created_at: Date;
}
