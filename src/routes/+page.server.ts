


export const ssr = false;

export function load({ fetch, params }) {
  let id = Buffer.from((Math.random()).toString()).toString("base64");
  fetch("/api/database", {
    method: "PUT",
    body: JSON.stringify({
      id,
    }),
  });
  return {
    id,
  };
}
