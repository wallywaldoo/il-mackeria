import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          borderRadius: 40,
          overflow: "hidden",
        }}
      >
        <div style={{ flex: 1, background: "#009246" }} />
        <div style={{ flex: 1, background: "#ffffff" }} />
        <div style={{ flex: 1, background: "#CE2B37" }} />
      </div>
    ),
    {
      ...size,
    },
  );
}
