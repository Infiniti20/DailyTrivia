<script lang="ts">
  import type { Question, Answer, GameState } from "../types";
  import AnswerButton from "../lib/AnswerButton.svelte";
  import { onMount } from "svelte";
  import { Timer, points, timeToPoints } from "../timer";
  import NavBar from "$lib/NavBar.svelte";
  import StartForm from "$lib/StartForm.svelte";
  import Analytics from "$lib/Analytics.svelte";

  export let data;
  console.log(data.id)

  let questions: Question[];
  let endScreen: boolean = false;
  let wasButton: boolean;

  let timer = new Timer();
  let interval: NodeJS.Timer;
  //@ts-ignore
  let gameState: GameState = {
    questionIndex: -1,
    totalPoints: 0,
  };
  let name: string;

  let handleSubmit = () => {
    gameState.hasStarted = true;
    handleNext();
  };

  function startTimer() {
    timer.start();
    gameState.countdown = 10;

    interval = setInterval(() => {
      gameState.countdown = 10 - Math.trunc(timer.end());
      if (gameState.countdown == 0) {
        clearInterval(interval);
      }
    }, 1000);
  }

  onMount(async () => {
    questions = (await (await fetch("/api/getTrivia?offset=0")).json())
      .questions;
  });

  function handleAnswer(isCorrect: boolean) {
    gameState.hasAnswered = true;
    let endTime = timer.end();
    clearInterval(interval);

    if (isCorrect) {
      points.update((n) => (n = endTime));
      gameState.totalPoints += timeToPoints(endTime);
    }
    let pointsObj: { [name: string]: number } = {};
    pointsObj[name] = gameState.totalPoints;
  }

  function handleAnalytics() {
    wasButton = (gameState.questionIndex >= questions.length) ? false : true
    endScreen = true;
  }

  function handleNext() {
    gameState.questionIndex++;
    if (gameState.questionIndex >= questions.length) {
      console.log("hita thge");
      endScreen = true;
      wasButton = false;
      fetch("/api/writeHighscore", {
        method:"POST",
        body:JSON.stringify({
          id:data.id,
          name,
          score:gameState.totalPoints
        })
      })
      return;
    }
    gameState.hasAnswered = false;
    startTimer();
    gameState.question = questions[gameState.questionIndex].questionText;
    gameState.answers = questions[gameState.questionIndex].answers.sort(
      () => Math.random() - 0.5
    );
  }

  let marginStyles = [
    ["20px", "20px 20px 20px 0"],
    ["20px", "20px 20px 20px 0", "0 20px 20px 20px"],
    ["20px", "20px 20px 20px 0", "0 20px 20px 20px", "0 20px 20px 0"],
  ];
</script>

{#if name && (gameState?.hasStarted ?? false)}
  {#if gameState.answers}
    <div class="main">
      <NavBar timerDisplay={gameState.countdown} {handleNext} {handleAnalytics} />
      <h1>{gameState.question}</h1>
      <div class="answer-container">
        {#each gameState.answers as answer, index}
          <AnswerButton
            {answer}
            {index}
            hasAnswered={gameState.hasAnswered}
            {handleAnswer}
            marginStyles={marginStyles[gameState.answers.length - 2][index]}
          />
        {/each}
      </div>
    </div>
  {/if}
{:else}
  <StartForm bind:name {handleSubmit} />
{/if}
{#if endScreen}
  <Analytics score={gameState.totalPoints} wasButton={wasButton} bind:endScreen/>
{/if}

<style>
  h1 {
    text-align: center;
    margin: 15px;
  }

  .main {
    display: grid;
    height: 100%;
    width: 100%;
    justify-content: center;
    align-items: center;
    grid-template-columns: 1fr;
    grid-template-rows: 10% 50% calc(40% + 20px);
  }
  .answer-container {
    display: grid;
    height: 100%;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
  }
</style>
