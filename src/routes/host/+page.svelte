<script lang="ts">
  import { DatabaseORM } from "../../firebase";
  import quizData from "../../quiz.json";
  import AnswerButton from "../../lib/ButtonDisplay.svelte";
  import { onMount } from "svelte";
  import { Timer } from "../../timer";
  import type { Answer, AnswerDatabase } from "../../types";

  let questionIndex: number = -1;

  let database = new DatabaseORM();
  let answers: Answer[];
  let currentQuestion: string;
  let timer = new Timer();

  let gameState: number;
  let pin: string = "0617";
  let countdown: number;
  let interval: NodeJS.Timer | undefined;
  let leaderboard;

  database.subscribe((data) => {
    gameState = data;
    console.log(gameState);
  }, "gameState");

  // onMount(() => {
  //   database.read((data: QuestionDatabase) => {
  //     currentQuestion = data.questionText;
  //     answers = Object.keys(data.answers).map((val): Answer => {
  //       return { text: val, isCorrect: data.answers[val] };
  //     });
  //   }, `${pin}/currentQuestion`);

  // });

  let marginStyles = [
    ["20px", "20px 20px 20px 0"],
    ["20px", "20px 20px 20px 0", "0 20px 20px 20px"],
    ["20px", "20px 20px 20px 0", "0 20px 20px 20px", "0 20px 20px 0"],
  ];

  function handleNextQuestion() {
    console.log(interval);
    if (interval) {
      clearInterval(interval);
      interval = undefined;
      countdown = 0;
      database.write(1, `${pin}/gameState`);
      return;
    }

    questionIndex += 1;

    if (questionIndex == quizData.questions.length) {
      // database.delete(pin);
      database.update(
        {
          gameState: null,
          currentQuestion: null,
        },
        "0617"
      );
      fetch("/api/loadTrivia");
      location.reload();
      return;
    }

    timer.start();
    countdown = 10 - Math.round(timer.end());

    interval = setInterval(() => {
      countdown = 10 - Math.round(timer.end());
      if (countdown == 0) {
        clearInterval(interval);
        interval = undefined;
        database.write(1, `${pin}/gameState`);
      }
    }, 1000);

    let answersDatabaseFormat: AnswerDatabase = {};

    quizData.questions[questionIndex].answers.forEach((answer) => {
      answersDatabaseFormat[answer.text] = answer.isCorrect;
    });

    database.update(
      {
        currentQuestion: {
          questionText: quizData.questions[questionIndex].questionText,
          answers: answersDatabaseFormat,
        },
        gameState: 0,
      },
      `${pin}`
    );

    currentQuestion = quizData.questions[questionIndex].questionText;

    answers = quizData.questions[questionIndex].answers.sort((ans1, ans2) => {
      return ans1.text > ans2.text ? 1 : -1;
    });
  }
</script>

<div class="main">
  <div class="bar">
    {#if countdown != undefined}
      <div class="countdown">{countdown}</div>
    {:else}
      <div />
    {/if}
    <button on:click={handleNextQuestion}>Next</button>
  </div>
  {#if answers}
    <div>
      <h1>{currentQuestion}</h1>
    </div>
    <div class="answer-container">
      {#each answers as answer, index}
        <AnswerButton
          {answer}
          {index}
          marginStyles={marginStyles[answers.length - 2][index]}
        />
      {/each}
    </div>
  {/if}
  <!-- <button on:click=()=>{}</button>> -->
</div>

<style>
  .bar {
    width: 100%;
    display: grid;
    grid-template-columns: 10fr 1fr;
    grid-template-rows: 100%;
  }
  button {
    margin: 20px 20px 20px 20px;
  }
  .countdown {
    display: inline-flex;
    font-size: 23px;
    margin-right: 5px;
    background-color: #46178f;
    color: white;
    border-radius: 50%;
    padding: 10px;
    height: 65%;
    text-align: center;
    aspect-ratio: 1/1;
    justify-content: center;
    place-items: center;
    place-self: center end;
  }
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
    grid-template-rows: 10% 50% 40%;
  }
  .answer-container {
    display: grid;
    height: 100%;
    grid-template-columns: 1fr 1fr;
  }
  button {
    cursor: pointer;
    background-color: #333333;
    color: white;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #333333;
    outline: none;
  }
</style>
