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
    questionIndex += 1;

    timer.start();
    countdown = 20 - Math.round(timer.end());

    let interval = setInterval(() => {
      countdown = 20 - Math.round(timer.end());
      if (countdown == 0) {
        clearInterval(interval);
        database.write(1, `${pin}/gameState`);
      }
    }, 1000);

    let answersDatabaseFormat: AnswerDatabase = {};

    quizData.questions[questionIndex].answers.forEach((answer) => {
      answersDatabaseFormat[answer.text] = answer.isCorrect;
    });

    database.write(
      { currentQuestion: {questionText: quizData.questions[questionIndex].questionText, answers:answersDatabaseFormat}, gameState: 0 },
      `${pin}`
    );

    currentQuestion = quizData.questions[questionIndex].questionText;

    answers = quizData.questions[questionIndex].answers.sort((ans1, ans2)=>{return ans1.text > ans2.text ? 1: -1})
  }
</script>

<div class="main">
  <div class="bar">
    <div class="countdown">{countdown}</div>
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
    display: inline;
    font-size: 40px;
    margin-right: 5px;
    background-color: #1368ce;
    color: white;
    border-radius: 50%;
    padding: 10px;
    height: 80px;
    text-align: center;
    aspect-ratio: 1/1;
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
</style>
