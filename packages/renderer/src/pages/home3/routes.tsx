import { IconType } from "react-icons";
import { MdHome } from "react-icons/md";
import HomeContent from "/@/components/Home/Content/Home";
import ConfigContent from "/@/components/Home/Content/Configuration";
import ServicesPixContent from "../../components/Home/Content/Services/PIX";
import ServicesWhatsContent from "/@/components/Home/Content/Services/Whatsapp";
import { HiCode } from "react-icons/hi";
import { BsGearFill, BsWhatsapp } from "react-icons/bs";
export interface IRouteNavBar {
  layout: string;
  path: string;
  name: string;
  category: string;
  expansible?: boolean;
  icon: IconType;
  secondaryNavbar: boolean;
  component: JSX.Element;
  views: IRouteNavBar[];
}

const ServicesMenu: IRouteNavBar[] = [
  {
    layout: "/home",
    path: "/pix",
    name: "PIX",
    category: "",
    icon: MdHome,
    secondaryNavbar: true,
    component: <ServicesPixContent />,
    views: [],
  },
  {
    layout: "/home",
    path: "/whatsapp",
    name: "Whatsapp",
    category: "",
    icon: BsWhatsapp,
    secondaryNavbar: true,
    component: <ServicesWhatsContent />,
    views: [],
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
    path: "services",
    name: "SERVIÇOS",
    category: "services",
    icon: HiCode,
    secondaryNavbar: false,
    component: <></>,
    views: ServicesMenu,
  },
  {
    layout: "/home",
    path: "general",
    name: "GERAL",
    category: "general",
    icon: HiCode,
    secondaryNavbar: false,
    component: <></>,
    views: [
      {
        layout: "/home",
        path: "/config",
        name: "Configurações",
        category: "",
        icon: BsGearFill,
        secondaryNavbar: false,
        component: <ConfigContent />,
        views: [],
      },
    ],
  },
];

export default RoutesNavBar;
