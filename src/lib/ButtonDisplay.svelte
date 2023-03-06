<script lang="ts">
  import type { Answer } from "../types";

  export let answer: Answer;
  export let index: number;

  export let marginStyles: string;

  let theme: string[] = ["#1368ce", "#e21b3c", "#ffa602", "#26890c"];
</script>

<button
  style="--color:{theme[index]};margin:{marginStyles}"
>
    <span> {answer.text}</span>
</button>

<style>
  button {
    border: none;
    color: white;
    background-color: var(--color);
    font-size: 20px;

    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: 90% 1%;

    place-items: center;
    justify-content: center;

    /* margin: 10px; */
    border-radius: 5px;
  }
  span {
    font-weight: bold;
    font-size: 30px;
  }
</style>
