import type { RequestEvent, RequestHandler } from "@sveltejs/kit";
import admin from "firebase-admin";

import serviceKey from "../../../../../adminSDK.json";

let serviceAccount = serviceKey as admin.ServiceAccount;

const app = admin.app()

//setting vapid keys details
const db = admin.database(app);

export const POST: RequestHandler = async ({ request }: RequestEvent) => {
  let body = (await request.json()) as PushSubscription;
  db.ref(`/subscriptions/${body.endpoint.split("/")[5]}`).set(body);
  
  return new Response(
    JSON.stringify({
      status: 200,
    })
  );
};
