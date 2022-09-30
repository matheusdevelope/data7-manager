import React, { HashRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import QrCode from "./pages/qrcode";

export default function RouterAplication() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/home/*" element={<Home />} />
        <Route path="qrcode" element={<QrCode />} />
      </Routes>
    </HashRouter>
  );
}
