import type { RequestEvent, RequestHandler } from "@sveltejs/kit";
import quizData from "../../../quiz.json";

function mulberry32(a: number) {
  return function () {
    var t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function cyrb128(str: string) {
  let h1 = 1779033703,
    h2 = 3144134277,
    h3 = 1013904242,
    h4 = 2773480762;
  for (let i = 0, k; i < str.length; i++) {
    k = str.charCodeAt(i);
    h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
    h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
    h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
    h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
  }
  h1 = Math.imul(h3 ^ (h1 >>> 18), 597399066);
  h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
  h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
  h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
  return [
    (h1 ^ h2 ^ h3 ^ h4) >>> 0,
    (h2 ^ h1) >>> 0,
    (h3 ^ h1) >>> 0,
    (h4 ^ h1) >>> 0,
  ];
}

function generateQuestions(dayOffset: string) {
  let seeds = cyrb128(dayOffset.toString());
  seeds.pop();
  let mulberry = mulberry32(seeds[0]);
  let questions = seeds.map((val) => {
    return quizData[
      transformRange(mulberry(), { min: 0, max: 1 }, { min: 0, max: 49 })
    ];
  });
  return questions;
}

function transformRange(
  value: number,
  r1: { min: number; max: number },
  r2: { min: number; max: number }
) {
  let scale = (r2.max - r2.min) / (r1.max - r1.min);
  return Math.trunc((value - r1.min) * scale);
}

export const GET: RequestHandler = async ({
  request,
  params,
  url,
}: RequestEvent) => {
  let dayOffset = url.searchParams.get("offset");
  if (dayOffset == null) {
    return new Response(
      JSON.stringify({
        status: 404,
      })
    );
  }
  let questions = generateQuestions(dayOffset);
  return new Response(
    JSON.stringify({
      questions,
    })
  );
};
