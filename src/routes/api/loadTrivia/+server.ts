import type { RequestEvent, RequestHandler } from "@sveltejs/kit";
import {writeFileSync } from "fs";

// You can call this endpoint typically from http://localhost:5173/api/testparam/foo/bar/as/many/as/you/want.
export const GET: RequestHandler = async ({
  request,
  params,
  url,
}: RequestEvent) => {
  let questionNumber = url.searchParams.get("questions");
  let difficulty = ["easy", "medium", "hard"][
    parseInt(url.searchParams.get("difficulty") ?? "1")
  ];
  let questions = await(
    await(
      await fetch(
        `https://the-trivia-api.com/api/questions?limit=${
          questionNumber ?? 10
        }&difficulty=${difficulty}&tags=academy_awards`,
        {
          headers: {
            // An API key is not required for this endpoint,
            // but can be used to bypass the rate limit or request
            // more questions.
            "Content-Type": "application/json",
          },
        }
      )
    ).json()
  ).map((val: any) => {
    return {
      questionText: val.question,
      answers: [val.correctAnswer, ...val.incorrectAnswers].map((answer) => {
        let isAnswerCorrect = val.incorrectAnswers.includes(answer)
          ? false
          : true;
        return { text: answer, isCorrect: isAnswerCorrect };
      }),
    };
  });

  writeFileSync("src/quiz.json", JSON.stringify({questions: questions}));

  return new Response(JSON.stringify({
    status:200
  }))
};
