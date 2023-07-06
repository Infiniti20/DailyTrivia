<script lang="ts">
  import { get_binding_group_value } from "svelte/internal";
  import Leaderboard from "./Leaderboard.svelte";

  export let score: number | undefined;
  export let endScreen: boolean;
  export let name: string;

  export let leaderboardShown: boolean = false;
  export let handleBack: any = undefined;
  //! UPDATE THIS TO HAVE MULTIPLE MESSAGES
  let messageRange = [
    "Maybe trivia isn't your thing.",
    "Nice try...",
    "Not bad!",
    "Pretty good!",
    "You know your trivia!",
    "Good stuff!",
    "Great job!",
    "AMAZING!",
    "Are you hacking?",
  ];

  function getMessage(score: number) {
    return messageRange[Math.trunc(score / (5000 / (messageRange.length - 1)))];
  }

  function hideEndScreen() {
    endScreen = false;
  }

  function share() {
    navigator.share({
      url: `/share?t=${score}&n=${name ?? localStorage.getItem("name") ?? "I"}`,
      title: "Kwizzy",
      text: `I completed Kwizzy with ${score} points`,
    });
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="bg" on:click|self={hideEndScreen}>
  <!-- {#if !wasButton} -->
  <span class="modal">
    {#if !leaderboardShown}
      <span class="intro">You got</span>
      <h1>{score ?? "-"}</h1>
      {#if score}
        <span class="message">{getMessage(score)}</span>
      {/if}
      <div class="stats-container">
        <b>Statistics</b>
        <div class="stats">
          <span class="stat">{localStorage.getItem("s")}</span>
          <span class="stat"
            >{(parseInt(localStorage.getItem("c") ?? score?.toString() ?? "0") /
              parseInt(localStorage.getItem("g") ?? "1")).toFixed(1)}</span
          >
          <span class="stat">{localStorage.getItem("g")}</span>
          <span class="label">Streak</span>
          <span class="label">Avg. Score</span>
          <span class="label">Played</span>
        </div>
      </div>
      <div class="buttons">
        <button
          on:click={() => {
            leaderboardShown = true;
          }}>Leaderboard</button
        >
        <button class="icon" on:click={share}>Share</button>
      </div>
    {:else}
      <Leaderboard bind:leaderboardShown {handleBack} {name} />
    {/if}
  </span>
  <!-- {:else}
    <span class="modal" /> -->
  <!-- {/if} -->
</div>

<style>
  .bg {
    height: 100%;
    width: 100%;
    top: 0;
    position: absolute;
    background-color: hsla(0, 0%, 0%, 0.5);
    display: grid;
    place-items: center;
  }
  .modal {
    padding: 25px;
    background-color: white;
    border-radius: 5px;
    display: block;
    animation: fly-in 0.4s linear;
    text-align: center;
  }
  .intro {
    font-size: 20px;
  }
  .message {
    opacity: 0.8;
    font-size: 14px;
  }

  @keyframes fly-in {
    from {
      transform: translateY(50vh);
      opacity: 0;
    }
    to {
      transform: translateY(0%);
      opacity: 1;
    }
  }
  .buttons {
    display: grid;
    grid-template-columns: 1fr 1fr;
    margin-top: 20px;
  }
  .stats-container{
    margin-top: 10px;
  }
  button {
    cursor: pointer;
    background-color: #333333;
    color: white;
    padding: 10px 20px;
    border-radius: 5px;
    border: 1px solid #333333;
    outline: none;
  }
  button:nth-child(1) {
    margin-right: 5px;
  }
  .icon::after {
    content: "";
    font-family: "icomoon";
    margin-left: 10px;
    font-size: 12px;
  }
  .stats {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr ;
    grid-template-rows: 1fr 0.5fr;
  }
  .stat {
    font-size: 24px;
    font-weight: 400;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .label {
    font-size: 12px;
    padding: 10px;
    padding-top: 0;
    padding-bottom: 0;
    font-weight: 400;
  }
  .stat:nth-child(1)::before {
    content: '🔥';
    font-size:16px;
  }

</style>
