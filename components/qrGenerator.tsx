"use client";

import { useQRCode } from "next-qrcode";

export function QrGenerator({ id }: { id: string }) {
  const { Canvas } = useQRCode();
  return (
    <Canvas
      text={`https://bs.macrogames.live/player/${id}`}
      options={{
        width: 300,
      }}
    />
  );
}
