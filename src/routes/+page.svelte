<script lang="ts">
  import type { Question, Answer, QuestionDatabase } from "../types";
  import { DatabaseORM } from "../firebase";
  import AnswerButton from "../lib/AnswerButton.svelte";
  import { onMount } from "svelte";
  import { Timer, points, timeToPoints } from "../timer";

  let hasAnswered = false;

  let database = new DatabaseORM();
  let answers: Answer[] | undefined;
  let currentQuestion: string;
  let timer = new Timer();

  let gameState: number;
  let name: string;
  let nameBind: string;
  let totalPoints: number = 0;

  onMount(async () => {
    let questions:Question[] = (await (await fetch("/api/getTrivia?offset=1")).json()).questions
    currentQuestion=questions[0].questionText
    answers = questions[0].answers 
    // database.subscribe((data) => {
    //   gameState = data;
    //   console.log(gameState);
    // }, "0617/gameState");

    // database.subscribe((data: QuestionDatabase) => {
    //   hasAnswered = false;
    //   if (data == null) {
    //     answers = undefined;
    //     return;
    //   }
    //   currentQuestion = data.questionText;
    //   answers = Object.keys(data.answers).map((val): Answer => {
    //     return { text: val, isCorrect: data.answers[val] };
    //   });
    //   timer.start();
    // }, `0617/currentQuestion`);
  });

  // let currentQuestion: QuestionDatabase
  // $: currentQuestion = quizData.questions[questionIndex]

  function handleAnswer(isCorrect: boolean) {
    hasAnswered = true;
    let endTime = timer.end();
    if (isCorrect) {
      points.update((n) => (n = endTime));
      totalPoints += timeToPoints(endTime);
    }
    let pointsObj: { [name: string]: number } = {};
    pointsObj[name] = totalPoints;
    database.update(pointsObj, "0617/users");
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

<!-- {#if name} -->
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
  </div>
<!-- {:else}
  <div class="form">
    <form
      on:submit|preventDefault={() => {
        handleSubmit();
      }}
    >
      <input type="text" bind:value={nameBind} placeholder="Nickname" />
      <br />
      <button type="submit">Enter Game</button>
    </form>
  </div>
{/if} -->

<!-- <button on:click=()=>{}</button>> -->
<style>
  h1 {
    text-align: center;
    margin: 5px;
  }
  .form {
    display: grid;
    height: 100%;
    width: 100%;
    justify-content: center;
    align-items: center;
  }
  input,
  button {
    width: 100%;
    margin: 5px;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #333333;
    outline: none;
  }
  button {
    cursor: pointer;
    background-color: #333333;
    color: white;
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
