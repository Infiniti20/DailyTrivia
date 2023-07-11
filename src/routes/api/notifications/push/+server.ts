import webpush from "web-push";

const publicVapidKey =
  "BB40OXsyn_woNLPWvkhcU04nwJba3O588wqeH-jXzTc4oiiqBLGVlrIOj4treMoHaviNdeIS4CWdVBZRaf4ZwXY";
const privateVapidKey = "jl1F7IKpNrZFMddF87pdwkLCSj4jckxxGfWInBuIO6E";

//setting vapid keys details
webpush.setVapidDetails(
  "mailto:kierankroy2010@gmail.com",
  publicVapidKey,
  privateVapidKey
);

import admin from "firebase-admin";

import serviceKey from "../../../../../adminSDK.json";
import type { RequestEvent, RequestHandler } from "@sveltejs/kit";

let serviceAccount = serviceKey as admin.ServiceAccount;

const app = admin.app();

//setting vapid keys details
const db = admin.database(app);
type Subscription = {
  [key: string]: webpush.PushSubscription;
};
export const GET: RequestHandler = async ({
  request,
  params,
  url,
}: RequestEvent) => {
  const notification = { title: "Kwizzy", body: "Did you play Kwizzy today?" };

  let subs = (await (
    await db.ref("/subscriptions")
  ).get()).val() as unknown as Subscription;
  console.log(subs)
  for (let sub in subs) {
    webpush.sendNotification(subs[sub], JSON.stringify(notification));
  }
  return new Response(
    JSON.stringify({
      status: 200,
    })
  );
};
