import { ServiceFirebase } from "./tabs/firebase";
import { ServiceHttpServer } from "./tabs/http_server";
import { ServicesTab } from "./services";
import { OptionsTerminalData } from "./terminal_data";
import { ServiceDispatchPanel } from "./tabs/dispatch_panel";

export const DefaultConfigTabs: IOptionConfig2[] = [
  ...OptionsTerminalData,
  ...ServicesTab,
  ...ServiceFirebase,
  ...ServiceHttpServer,
  ...ServiceDispatchPanel,
];
