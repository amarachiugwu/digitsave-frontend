import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "DigitSave",
    short_name: "DigitSave",
    description: "Savings that helps you build wealth.",
    lang: "en",
    orientation: "portrait-primary",
    start_url: "/",
    display: "standalone",

    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
  };
}
