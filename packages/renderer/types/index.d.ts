// declare global {
//   interface Window {
//     __electron_preload__SetLocalPassApp: (
//       password: string
//     ) => Promise<true | Error>;
//     __electron_preload__GetLocalPassApp: () => Promise<string | false | Error>;
//     __electron_preload__GetLocalConfig: () => Promise<IObjectConfig[]>;
//     __electron_preload__SetLocalConfig: (
//       config: IObjectConfig[]
//     ) => Promise<void | Error>;
//     __electron_preload__RegisterEventUpdateQr: (
//       event: string,
//       cb: () => void
//     ) => void;
//     __electron_preload__CancelQr: (id_qrcode: string) => Promise<ICancelQr>;
//     __electron_preload__OpenQr: () => void;
//     __electron_preload__CloseQr: () => void;
//     __electron_preload__RefreshQr: (id_qrcode: string) => Promise<IRefreshQr>;
//     __electron_preload__SendWhats: (data: IWhatsAppMessage) => void;
//     __electron_preload__RegisterEventLoginWithQr: (cb: () => void) => void;
//     __electron_preload__CloseCurrentWindow: () => void;
//     __electron_preload__RefreshAplication: () => void;
//   }
// }
