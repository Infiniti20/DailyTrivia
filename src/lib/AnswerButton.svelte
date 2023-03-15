<script lang="ts">
  import type { Answer } from "../types";
  import { points, timeToPoints } from "../timer";

  export let answer: Answer;
  export let index: number;
  export let handleAnswer = (isCorrect: boolean) => {};
  export let hasAnswered: boolean;
  export let gameState: number;

  export let marginStyles: string;

  let theme: string[] = ["#1368ce", "#e21b3c", "#ffa602", "#26890c"];
  let pointsDisplayed: number;
  let wasClicked: boolean = false;

  points.subscribe((value) => {
    pointsDisplayed = value;
  });

  $: gameState, handleGameStateChange();

  function handleGameStateChange() {
    console.log("game state changed idk run twice");
    if (gameState == 0 && hasAnswered == false) {
      wasClicked = false;
    }
  }
</script>

<button
  on:click={() => {
    if (hasAnswered == true) {
      return;
    }
    handleAnswer(answer.isCorrect);
    wasClicked = true;
  }}
  class={gameState == 1 ? (answer.isCorrect ? "correct" : "incorrect") : ""}
  class:inactive={hasAnswered && !wasClicked && gameState == 0}
  class:active={hasAnswered && wasClicked && gameState == 0}
  style="--color:{theme[index]};margin:{marginStyles}"
>
  <div>
    <span> {answer.text}</span>
    {#if hasAnswered == true && answer.isCorrect && wasClicked && gameState == 1}
      <br />
      +{timeToPoints(pointsDisplayed)}
    {/if}
  </div>
</button>

<style>
  @font-face {
    font-family: "icomoon";
    src: url("fonts/icomoon.eot?5uosik");
    src: url("fonts/icomoon.eot?5uosik#iefix") format("embedded-opentype"),
      url("fonts/icomoon.ttf?5uosik") format("truetype"),
      url("fonts/icomoon.woff?5uosik") format("woff"),
      url("fonts/icomoon.svg?5uosik#icomoon") format("svg");
    font-weight: normal;
    font-style: normal;
    font-display: block;
  }

  .correct {
    background: #26890c;
    border: none;
    color: white;
    transition: background-color 100ms linear;
  }
  .incorrect {
    background: #e21b3c;
    border: none;
    color: white;
    transition: background-color 100ms linear;
  }
  button {
    border: none;
    color: white;
    background-color: var(--color);
    font-size: 20px;
    width: calc(50vw - 30px);
    height: calc(20vh - 30px);
    /* overflow-wrap: anywhere; */
    /* margin: 10px; */
    border-radius: 5px;
  }

  button:hover {
    background-image: linear-gradient(rgb(0 0 0/10%) 0 0);
  }
  span {
    font-weight: bold;
    /* font-size: 1vw; */
    font-size: calc(20% + 1.75vw);
  }
  .inactive {
    background-color: grey;
    transition: background-color 100ms linear;
  }
  .active::after {
    content: "";
    display: inline-block;
    /* top: 50%;
    left: 50%; */
    /* margin-top: -30px;
    margin-left: -30px; */
    width: 40px;
    height: 40px;
    border-radius: 50px;
    border: 5px solid white;
    border-top-color: transparent;
    animation: loading 1.5s ease-in-out infinite;
  }

  @keyframes loading {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  @media (min-width: 1000px) {
    button {
      display: grid;
      grid-template-rows: 1fr;
      grid-template-columns: 90% 1%;

      place-items: center;
      justify-content: center;
    }
    .correct::after {
      font-size: 40px;
      font-family: "icomoon";
      content: "";
      margin: 10px;
    }
    .incorrect::after {
      font-size: 40px;
      font-family: "icomoon";
      content: "";
      margin: 10px;
    }
  }

  @media (max-width: 999px) {
    .active span {
      display: none;
    }
  }

  div {
    /* overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis; */
  }
</style>
