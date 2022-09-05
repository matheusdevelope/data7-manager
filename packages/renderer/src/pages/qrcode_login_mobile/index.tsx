import { useEffect, useState } from "react";

import { AreaQrCode, Column, Container, ImgQrCode } from "./style";

function RenderAreaQrCode(img: string) {
  return (
    <AreaQrCode>
      <Column>
        <ImgQrCode src={img} />
        <p>Aponte sua camera para o QrCode</p>
      </Column>
    </AreaQrCode>
  );
}
export default function QrCodeToLogin() {
  const [QrCode, setQrcode] = useState("");

  function AddListennersInApp() {
    window.__electron_preload__RegisterEventLoginWithQr((img: string) => {
      setQrcode(img);
    });
  }

  useEffect(() => {
    AddListennersInApp();
  }, []);

  return <Container className="App">{RenderAreaQrCode(QrCode)}</Container>;
}
