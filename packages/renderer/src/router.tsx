import { HashRouter, Route, Routes } from "react-router-dom";
import Config_Panel from "./pages/config_panel";
import Home from "./pages/home";
import QrCode from "./pages/qrcode";
import QrCodeToLogin from "./pages/qrcode_login_mobile";

export default function RouterAplication() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="config_panel" element={<Config_Panel />} />
        <Route path="qrcode" element={<QrCode />} />
        <Route path="login_with_qrcode" element={<QrCodeToLogin />} />
      </Routes>
    </HashRouter>
  );
}
