/*
  The web app manifest, GENERATED rather than static (section 74).

  It used to be a hand-written file in public/ pointing at `/icon-512.png`,
  and that is how a stale icon survived two monogram rebuilds unnoticed: the
  file was never in any search for "favicon" or "apple-touch", and nothing
  connected the manifest's icon list to the icons anyone was editing.

  Now the icon URLs are IMPORTED, so they carry Vite's content hash and the
  manifest cannot reference an icon that no longer exists: renaming or
  changing an icon changes this file too, at build time, or the build fails.
*/
import icon512 from "../assets/icons/icon-512.png?url";
import appleTouchIcon from "../assets/icons/apple-touch-icon.png?url";

const manifest = {
  name: "Aleksander Cecco",
  short_name: "Aleksander Cecco",
  start_url: "/",
  display: "standalone",
  background_color: "#0A0A0A",
  theme_color: "#0A0A0A",
  icons: [
    {src: icon512, sizes: "512x512", type: "image/png"},
    {src: appleTouchIcon, sizes: "180x180", type: "image/png"},
  ],
};

export const GET = () =>
  new Response(JSON.stringify(manifest, null, 2), {
    headers: {"Content-Type": "application/manifest+json"},
  });
