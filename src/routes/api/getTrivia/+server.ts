import type { RequestEvent, RequestHandler } from "@sveltejs/kit";
import quizData from "../../../quiz.json";
import type { Answer } from "../../../types";
function mulberry32(a: number) {
  return function () {
    var t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle(array: any[], generator: Function) {
  // <-- ADDED ARGUMENT
  var m = array.length,
    t,
    i;

  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    i = Math.floor(generator() * m--); // <-- MODIFIED LINE

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
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
  h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
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
//TODO: FIX RANDOMNESS TO BE MORE RANDOM
function generateQuestions(dayOffset: string) {
  let seeds = cyrb128("KWIZZY29" + dayOffset);
  let mulberry = mulberry32(seeds[0] + seeds[1] + seeds[2]);
  let days = parseInt(dayOffset);
  // for (let i = 0; i < (days - 1) * 5; i++) {
  //   mulberry();
  // }
  let questions = [];
  for(let i=5*days;i<5*days+5;i++){
    questions.push(quizData[num_to_code(i)])
  }


  shuffle(questions, mulberry);
  return questions;
}

function num_to_code(n: number): number {
  let string: number = 0;
  let hashed: number = hash_number(n);
  const charnumber: number = hashed % 2400;
  hashed = Math.floor(hashed / 2400);
  string = charnumber;
  return string;
}

function hash_number(n: number, rounds: number = 1): number {
  const prime_number: number = 60466181;

  if (rounds <= 0) {
    return n;
  }
  const hashed: number = (n * prime_number) % (2400 ** 5);
  return hash_number(hashed, rounds - 1);
}

let num: number = 1;

// function findCommonElements3(arr1: any[], arr2: any[]) {
//   return arr1.some((item) => arr2.includes(item));
// }
// function hasDuplicates(array: any[]) {
//   return new Set(array).size !== array.length;
// }
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
  let questions = generateQuestions((parseInt(dayOffset + 1)).toString());
  // let questionNext = generateQuestions((parseInt(dayOffset) + 2).toString());

  // console.log(
  //   `Offset: ${dayOffset} is ${
  //     !(
  //       findCommonElements3(questions, questionNext) || hasDuplicates(questions)
  //     )
  //       ? "valid"
  //       : "invalid"
  //   }`
  // );
  return new Response(
    JSON.stringify({
      questions,
    })
  );
};

async function checkValidity(min: number, max: number) {
  let questions: any[] = [];
  for (let i = min; i < max + 1; i++) {
    let newQ = generateQuestions((i + 1).toString());
    questions = [...questions, ...newQ];
  }
  console.log(questions.filter((e, i, a) => a.indexOf(e) !== i).length);
}
