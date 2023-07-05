<script lang="ts">
  import type { Answer } from "../types";
  import { points, timeToPoints } from "../timer";

  export let answer: Answer;
  export let index: number;
  export let handleAnswer = (isCorrect: boolean) => {};
  export let hasAnswered: boolean;

  export let marginStyles: string;

  let theme: string[] = ["#1368ce", "#e21b3c", "#ffa602", "#26890c"];
  let pointsDisplayed: number;
  let wasClicked: boolean = false;

  points.subscribe((value) => {
    pointsDisplayed = value;
  });

  function handleAnswerChange(hasAnswered:boolean){
    if(hasAnswered == false){
      // console.log(`${answer.text}' Was reset`)
      wasClicked = false
    }
    // console.log(`'${answer.text}' Was Clicked: ${wasClicked ? 'yes':'no'}`)
  }

$: handleAnswerChange(hasAnswered)

  // function handleGameStateChange() {
  //   console.log("game state changed idk run twice");
  //   if (hasAnswered == false) {
  //     wasClicked = false;
  //   }
  // }
</script>

<button
  on:click={() => {
    if (hasAnswered == true) {
      return;
    }
    wasClicked=true
    handleAnswer(answer.isCorrect);
  }}
  class={hasAnswered ? (answer.isCorrect ? "correct" : "incorrect") : ""}
  style="--color:{theme[index]};margin:{marginStyles}"
>
  <div>
    <span> {answer.text}</span>
    {#if hasAnswered && wasClicked && answer.isCorrect}
      <br />
      <span>+{timeToPoints(pointsDisplayed)}</span>
    {/if}
  </div>
</button>

<style>


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
    height: calc(100% - 40px);
    min-height: calc(100% - 40px);
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
    display: inline-block;
    line-height: 1.1;
    font-size: min(calc((20vh - 30px) / 10), 40px);
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



  div {
    /* overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis; */
  }
</style>
