import { get } from 'svelte/store';



export const ssr = false;

export function load({ fetch, params, getClientAddress }) {
  let id = Buffer.from((Math.random()).toString()).toString("base64");
  fetch("/api/database", {
    method: "PUT",
    body: JSON.stringify({
      id,
    }),
  });
  let ip = getClientAddress()
  return {
    id,ip
  };
}
