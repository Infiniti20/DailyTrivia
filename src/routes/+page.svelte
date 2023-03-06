<script lang="ts">
  import type { Question, Answer, QuestionDatabase } from "../types";
  import { DatabaseORM } from "../firebase";
  import quizData from "../quiz.json";
  import AnswerButton from "../lib/AnswerButton.svelte";
  import { onMount } from "svelte";
  import { Timer, points } from "../timer";

  let hasAnswered = false;

  let database = new DatabaseORM();
  let answers: Answer[]|undefined;
  let currentQuestion: string;
  let timer = new Timer();

  let gameState: number;

  onMount(() => {
    database.subscribe((data) => {
      gameState = data;
      console.log(gameState);
    }, "0617/gameState");

    database.subscribe((data: QuestionDatabase) => {
      hasAnswered = false;
      if (data.questionText=="NULL") {
        answers=undefined;
        return;
      }
      currentQuestion = data.questionText;
      answers = Object.keys(data.answers).map((val): Answer => {
        return { text: val, isCorrect: data.answers[val] };
      });
      timer.start();
    }, "0617/currentQuestion");
  });

  // let currentQuestion: QuestionDatabase
  // $: currentQuestion = quizData.questions[questionIndex]

  function handleAnswer(isCorrect: boolean) {
    hasAnswered = true;
    let endTime = timer.end();
    points.update((n) => (n = endTime));
  }

  // function handleNextQuestion() {
  //   hasAnswered = false
  //   status = ''
  //   questionIndex += 1
  // }

  let marginStyles = [
    ["20px", "20px 20px 20px 0"],
    ["20px", "20px 20px 20px 0", "0 20px 20px 20px"],
    ["20px", "20px 20px 20px 0", "0 20px 20px 20px", "0 20px 20px 0"],
  ];
</script>

<div class="main">
  {#if answers}
    <h1>{currentQuestion}</h1>
    <div class="answer-container">
      {#each answers as answer, index}
        <AnswerButton
          {answer}
          {index}
          {hasAnswered}
          handleAnswer={(isAnswerCorrect) => {
            handleAnswer(isAnswerCorrect);
          }}
          {gameState}
          marginStyles={marginStyles[answers.length - 2][index]}
        />
      {/each}
    </div>
  {/if}
  <!-- <button on:click=()=>{}</button>> -->
</div>

<style>
  h1 {
    text-align: center;
  }

  .main {
    display: grid;
    height: 100%;
    width: 100%;
    justify-content: center;
    align-items: center;
    grid-template-columns: 1fr;
    grid-template-rows: 60% 40%;
  }
  .answer-container {
    display: grid;
    height: 100%;
    grid-template-columns: 1fr 1fr;
  }
</style>
