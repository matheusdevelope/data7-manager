import type { QRCodeToDataURLOptions } from "qrcode";

export {};
declare global {
  interface Window {
    __electron_preload__SetLocalPassApp: (
      password: string
    ) => Promise<true | Error>;
    __electron_preload__GetLocalPassApp: () => Promise<string | false | Error>;
    __electron_preload__GetGlobalState: () => Promise<string>;
    __electron_preload__GetLocalConfig: () => Promise<IObjectConfig[]>;
    __electron_preload__SetLocalConfig: (
      config: IObjectConfig[]
    ) => Promise<void | Error>;
    __electron_preload__GetLocalConfigTabs: () => Promise<IOptionConfig2[]>;
    __electron_preload__SetLocalConfigTabs: (
      config: IOptionConfig2[]
    ) => Promise<void | Error>;
    __electron_preload__RegisterEventUpdateQr: (
      event: string,
      cb: (dataQrCode: IDataQrCode) => void
    ) => void;
    __electron_preload__CancelQr: (id_qrcode: string) => Promise<ICancelQr>;
    __electron_preload__OpenQr: () => void;
    __electron_preload__CloseQr: () => void;
    __electron_preload__RefreshQr: (id_qrcode: string) => Promise<IRefreshQr>;
    __electron_preload__SendWhats: (data: IWhatsAppMessage) => void;
    __electron_preload__RegisterEventLoginWithQr: (
      cb: (image_string: string) => void
    ) => void;
    __electron_preload__CloseCurrentWindow: () => void;
    __electron_preload__RefreshAplication: () => void;
    __electron_preload__MoveWindow: (bounds: IBounds) => void;
    __electron_preload__MinimizeWindow: () => void;
    __electron_preload__CloseWindow: () => void;
    __electron_preload__ResetLocalConfigTabs: () => void;
    __electron_preload__GenerateQrCode: (
      string_to_base64: string,
      QRCodeToDataURLOptions?: QRCodeToDataURLOptions
    ) => Promise<string>;
    __electron_preload__ToggleWindow: (id_window: string) => Promise<boolean>;
    __electron_preload__VisibilityWindow: (
      id_window: string
    ) => Promise<boolean>;
    __electron_preload__RegisterEventVisibiliteWindow: (
      event: string,
      cb: () => void
    ) => void;
    __electron_preload__ToggleService: (
      service: string,
      active: boolean
    ) => void;
    __electron_preload__GetURLLoginMobile: () => Promise<string>;
    __electron_preload__ResetLocalStorageWhats: () => void;
    __electron_preload__GetStatusWhatsapp: () => Promise<IValuesWhatsappService>;
    __electron_preload__ReceiveQrCodeLoginWhatsapp: () => Promisse<string>;
    __electron_preload__ListenerWhatsappBot: (
      cb: (data: IDataListenerWhatsapp) => void
    ) => void;

    ///Storage Handles
    __electron_preload__Config_GetConfigTabs: () => Promise<IOptionConfig2[]>;
    __electron_preload__Config_SetConfigTabs: (
      config: IOptionConfig2[]
    ) => Promise<boolean>;
    __electron_preload__Config_GetServices: () => Promise<IOptionConfig2[]>;
    __electron_preload__Config_GetService: (
      service: EnumServices
    ) => Promise<IOptionConfig2 | undefined>;
    __electron_preload__Config_GetServiceOptions: (
      service: EnumServices
    ) => Promise<IOptionConfig2[] | undefined>;
    __electron_preload__Config_GetKey: (
      key:
        | EnumKeys
        | EnumKeysFirebase
        | EnumKeysHttpServer
        | EnumKeysSendFilesWhats
        | EnumKeysTerminalData
        | EnumKeysWhatsappIntegrated,
      sub_category?: EnumServices,
      category?: EnumTabs
    ) => Promise<IOptionConfig2 | undefined>;
    __electron_preload__Config_GetKeyValue: (
      key:
        | EnumKeys
        | EnumKeysFirebase
        | EnumKeysHttpServer
        | EnumKeysSendFilesWhats
        | EnumKeysTerminalData
        | EnumKeysWhatsappIntegrated,
      sub_category?: EnumServices,
      category?: EnumTabs
    ) => Promise<string | number | boolean | string[] | undefined>;
    __electron_preload__Config_SetKeyValue: (
      value: string | number | boolean | string[],
      key:
        | EnumKeys
        | EnumKeysFirebase
        | EnumKeysHttpServer
        | EnumKeysSendFilesWhats
        | EnumKeysTerminalData
        | EnumKeysWhatsappIntegrated,
      sub_category?: EnumServices,
      category?: EnumTabs
    ) => Promise<boolean>;
  }
}
