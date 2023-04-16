<script lang="ts">
  import type { Question, Answer, GameState } from "../types";
  import AnswerButton from "../lib/AnswerButton.svelte";
  import { onMount } from "svelte";
  import { Timer, points, timeToPoints } from "../timer";
  import NavBar from "$lib/NavBar.svelte";
  import StartForm from "$lib/StartForm.svelte";
  import Analytics from "$lib/Analytics.svelte";
  import Fingerprinter from "$lib/Fingerprinter.svelte";

  export let data;

  let questions: Question[];
  let endScreen: boolean = false;
  let fingerprint: number;

  let timer = new Timer();
  let interval: NodeJS.Timer;
  //@ts-ignore
  let gameState: GameState = {
    questionIndex: parseInt(localStorage.getItem("index") ?? "-1"),
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

  function calculateDays(date1: Date, date2: Date) {
    let difference = date1.getTime() - date2.getTime();
    let days = Math.abs(Math.ceil(difference / (1000 * 3600 * 24)));
    return days;
  }
  onMount(async () => {
    let offset = calculateDays(new Date("3/17/2023"), new Date());
    questions = (
      await (await fetch(`/api/getTrivia?offset=${offset + 1}`)).json()
    ).questions;
    let date2 = new Date();
    let date1 = new Date(
      parseInt(
        localStorage.getItem("lastCompleted") ??
          new Date("1965").getTime().toString()
      )
    );
    date1.setHours(0, 0, 0, 0);
    let days = calculateDays(date1, date2);
    console.log(days);

    if (days < 1) {
      gameState.totalPoints = parseInt(
        localStorage.getItem("lastScore") ?? "0"
      );
      gameState.questionIndex = questions.length - 1;

      gameState.hasStarted = true;
      gameState.hasAnswered = false;

      gameState.question = questions[gameState.questionIndex].questionText;
      gameState.answers = questions[gameState.questionIndex].answers.sort(
        () => Math.random() - 0.5
      );
      gameState.countdown = 10;
      gameState.questionIndex = questions.length
      endScreen = true;
    }
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
    endScreen = true;
  }

  function handleNext() {
    gameState.questionIndex++;
    if (gameState.questionIndex >= questions.length) {
      endScreen = true;
      if (!name) {
        return;
      }
      fetch("/api/database", {
        method: "POST",
        body: JSON.stringify({
          id: data.id,
          name,
          score: gameState.totalPoints,
          date: new Date().getTime(),
          fingerprint,
        }),
      });
      localStorage.setItem("lastCompleted", new Date().getTime().toString());
      localStorage.removeItem("index");
      localStorage.setItem("lastScore", gameState.totalPoints.toString());
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

  function handleIndexChange(index: number) {
    if (questions == undefined) {
      return;
    }
    if (
      gameState.questionIndex < questions.length &&
      gameState.questionIndex > -1
    ) {
      localStorage.setItem("index", gameState.questionIndex.toString());
      return;
    }
    localStorage.removeItem("index");
  }

  $: handleIndexChange(gameState.questionIndex);
    console.log(data.ip)
</script>

<svelte:window
  on:beforeunload={() => {
    if (
      gameState.questionIndex < questions.length &&
      gameState.questionIndex > -1
    ) {
      localStorage.setItem("index", gameState.questionIndex.toString());
      return;
    }
    localStorage.removeItem("index");
  }}
/>
<Fingerprinter bind:fingerprint ip={data.ip} />
{#if gameState?.hasStarted ?? false}
  {#if gameState.answers}
    <div class="main">
      <NavBar
        timerDisplay={gameState.countdown}
        {handleNext}
        {handleAnalytics}
      />
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
  <Analytics score={gameState.totalPoints} bind:endScreen {name} />
{/if}

<style>
  h1 {
    text-align: center;
    margin: 15px;
    font-size: 7cqw;
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
