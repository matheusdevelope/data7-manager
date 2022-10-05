import { IconType } from "react-icons";
import { MdHome, MdPayments } from "react-icons/md";
import HomeContent from "/@/components/Home/Content/Home";
import ConfigContent from "/@/components/Home/Content/Configuration";
import ServicesPixContent from "../../components/Home/Content/Services/PIX";
import ServicesWhatsContent from "/@/components/Home/Content/Services/Whatsapp";
import { HiCode } from "react-icons/hi";
import { BsGearFill, BsHddNetwork, BsWhatsapp } from "react-icons/bs";
import { EnumServices } from "../../../../../types/enums/configTabsAndKeys";
import ServicesHttpServerContent from "/@/components/Home/Content/Services/HttpServer";
export interface IRouteNavBar {
  layout: string;
  path: string;
  name: string;
  show?: boolean;
  category: string;
  expansible?: boolean;
  icon: IconType;
  secondaryNavbar: boolean;
  component: JSX.Element;
  views: IRouteNavBar[];
  service?: EnumServices;
}

const ServicesMenu: IRouteNavBar[] = [
  {
    layout: "/home",
    path: "/services/pix",
    name: "PIX",
    category: "",
    icon: MdPayments,
    secondaryNavbar: true,
    component: <ServicesPixContent />,
    views: [],
    service: EnumServices.pix,
  },
  {
    layout: "/home",
    path: "/services/whatsapp",
    name: "Whatsapp",
    category: "",
    icon: BsWhatsapp,
    secondaryNavbar: true,
    component: <ServicesWhatsContent />,
    views: [],
    service: EnumServices.whatsapp_integrated,
  },
  {
    layout: "/home",
    path: "/services/http_server",
    name: "Servidor HTTP",
    category: "",
    icon: BsHddNetwork,
    secondaryNavbar: true,
    component: <ServicesHttpServerContent />,
    views: [],
    service: EnumServices.http_server,
  },
];

const RoutesNavBar: IRouteNavBar[] = [
  {
    layout: "/home",
    path: "/home",
    name: "Tela Inicial",
    category: "",
    icon: MdHome,
    secondaryNavbar: false,
    component: <HomeContent />,
    views: [],
  },

  {
    layout: "/home",
    path: "/services",
    name: "SERVIÇOS",
    category: "services",
    expansible: false,
    icon: HiCode,
    secondaryNavbar: false,
    component: <></>,
    views: ServicesMenu,
  },
  {
    layout: "/home",
    path: "/config/*",
    name: "Configurações",
    category: "",
    icon: BsGearFill,
    secondaryNavbar: false,
    component: <ConfigContent />,
    views: [],
  },
];

export default RoutesNavBar;
