import { type RequestEvent, type RequestHandler, error } from "@sveltejs/kit";
import admin from "firebase-admin";

import serviceKey from "../../../../adminSDK.json";

let serviceAccount = serviceKey as admin.ServiceAccount;

const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://dailytrivia-5048b-default-rtdb.firebaseio.com/",
});

const db = admin.database(app);

type WriteRequest = {
  id: string;
  name: string;
  score: number;
  date: string;
  fingerprint: number;
};
export const POST: RequestHandler = async ({ request }: RequestEvent) => {
  let body = (await request.json()) as WriteRequest;
  const id = body.id;

  if (!(await (await db.ref(`/ids/${id}`).get()).exists())) {
    throw error(401, "unauthorized id");
  }

  const scoreRef = db.ref("/score");
  if (await (await scoreRef.child(id).get()).exists()) {
    throw error(401, "unauthorized id");
  }
  const name = body.name;
  const score = body.score;
  const time = new Date(parseInt(body.date)).setHours(0, 0, 0, 0);

  let fingerprints = (
    await scoreRef.orderByChild("fingerprint").equalTo(body.fingerprint).get()
  ).val() as any[];
  if (fingerprints != null) {
    if (
      Object.values(fingerprints).filter((val) => {
        return val.time == time;
      })
    ) {
      throw error(401, "unauthorized device");
    }
  }
  db.ref(`/score/${id}`).set({
    name,
    score,
    time,
    fingerprint: body.fingerprint,
  });

  return new Response(
    JSON.stringify({
      status: 200,
    })
  );
};
export const PUT: RequestHandler = async ({ request }: RequestEvent) => {
  let body = (await request.json()) as WriteRequest;
  const id = body.id;
  db.ref(`ids/${id}`).set(true);

  return new Response(
    JSON.stringify({
      status: 200,
    })
  );
};

export const GET: RequestHandler = async ({ url }) => {
  const timeStamp = new Date(
    parseInt(url.searchParams.get("t") ?? new Date().getTime().toString())
  ).setHours(0, 0, 0, 0);
  console.log(timeStamp);
  let data = await db
    .ref("score")
    .orderByChild("time")
    .equalTo(timeStamp)
    .get();
  return new Response(
    JSON.stringify({
      data,
    })
  );
};
