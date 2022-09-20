import { ServiceSendFilesWhats } from "./tabs/send_files_whats";
import { ServicePix } from "./tabs/pix";
import { ServiceWhatsIntegrated } from "./tabs/whats_integrated";

export const ServicesTab: IOptionConfig2[] = [
  ...ServicePix,
  ...ServiceSendFilesWhats,
  ...ServiceWhatsIntegrated,
];
