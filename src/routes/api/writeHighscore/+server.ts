import { type RequestEvent, type RequestHandler, error } from "@sveltejs/kit";
import {
  initializeApp,
  credential,
  type ServiceAccount,
  database,
} from "firebase-admin";
import serviceKey from "../../../../adminSDK.json";

let serviceAccount = serviceKey as ServiceAccount;

const app = initializeApp({
  credential: credential.cert(serviceAccount),
  databaseURL: "https://dailytrivia-5048b-default-rtdb.firebaseio.com/",
});

const db = database(app);

type WriteRequest = {
  id: string;
  name: string;
  score: number;
};
export const POST: RequestHandler = async ({ request }: RequestEvent) => {
    let body=(await request.json()) as WriteRequest
  const id = body.id;
  if (!(await (await db.ref(`/ids/${id}`).get()).exists())) {
    throw error(401, 'unauthorized id');
 }
 if (await(await db.ref(`/score/${id}`).get()).exists()){
    throw error(401, "unauthorized id");
 }
  const name = body.name;
  const score = body.score

  db.ref(`/score/${id}`).set({
    name,
    score,
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
    db.ref(`ids/${id}`).set(true)

  return new Response(
    JSON.stringify({
      status: 200,
    })
  );
};
