import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "VODE — Shirts, T-shirts and everyday clothing";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default async function OpenGraphImage() {
  const logo = await readFile(join(process.cwd(), "public/vode-logo.png"));
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        background: "#f9f8f4",
        color: "#22251f",
        padding: "50px 65px",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            position: "relative",
            width: 140,
            height: 140,
            overflow: "hidden",
          }}
        >
          {/* ImageResponse requires a native image element. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={"data:image/png;base64," + logo.toString("base64")}
            alt="VODE"
            width={400}
            height={400}
            style={{ position: "absolute", left: -130, top: -128 }}
          />
        </div>
        <span style={{ fontSize: 20, letterSpacing: "3px" }}>
          THE EVERYDAY EDIT
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span style={{ fontSize: 78, letterSpacing: "-3px" }}>
          Shirts. T-shirts. Your way.
        </span>
        <span style={{ fontSize: 28, marginTop: 22, color: "#59634f" }}>
          For men, women &amp; unisex styling.
        </span>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          borderTop: "1px solid #cdd0c3",
          paddingTop: 25,
          fontSize: 22,
        }}
      >
        <span>Explore the catalogue. Order on WhatsApp.</span>
        <span>vode-style.vercel.app</span>
      </div>
    </div>,
    size,
  );
}
