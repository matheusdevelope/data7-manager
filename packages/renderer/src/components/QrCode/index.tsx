import { Image, ImageProps } from "@chakra-ui/react";
import { useEffect, useState } from "react";

interface IProps extends ImageProps {
  data?: string;
}

export default function RenderQrCode({ data, ...props }: IProps) {
  const [base64, setBase64] = useState("");

  useEffect(() => {
    if (data) window.__electron_preload__GenerateQrCode(data).then(setBase64);
  }, [data]);

  return (
    <Image
      src={base64 ? base64 : props.src ? props.src : ""}
      width="full"
      height="full"
      {...props}
    />
  );
}
