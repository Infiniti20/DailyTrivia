import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import type { RequestEvent, RequestHandler } from "@sveltejs/kit";
import Anton from "/static/fonts/Anton-Regular.ttf";

const height = 400;
const width = 800;
import { html as toReactNode } from "satori-html";
import Card from "../../../lib/OG.svelte"


export const GET: RequestHandler = async ({ request, params, url }: RequestEvent) => {
  const result = (Card as any).render({score:url.searchParams.get("s"), name:url.searchParams.get("n")})
const element = toReactNode(`${result.html}<style>${result.css.code}</style>`);

const svg = await satori(element, {
  fonts: [
    {
      name: "Noto Sans",
      // Use `fs` (Node.js only) or `fetch` to read the font as Buffer/ArrayBuffer and provide `data` here.
      data: Buffer.from(Anton),
      style: "normal",
    },
  ],
  height,
  width,
});

const resvg = new Resvg(svg, {
  fitTo: {
    mode: "width",
    value: width,
  },
});

const image = resvg.render();

return new Response(image.asPng(), {
  headers: {
    "content-type": "image/png",
  },
});
};
