<script lang="ts">
  import Leaderboard from "./Leaderboard.svelte";

  export let score: number | undefined;
  export let endScreen: boolean;
  export let name: string;

  export let leaderboardShown:boolean = false;
  export let handleBack:any = undefined;
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
      url: `/share?t=${score}&n=${name ?? (localStorage.getItem("name") ?? "I")}`,
      title: "Daily Trivia",
      text: `I completed Daily Trivia with ${score} points`,
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
        <div class="buttons">
          <button on:click={()=>{leaderboardShown = true}}>Leaderboard</button>
          <button class="icon" on:click={share}>Share</button>
        </div>
      {:else}
        <Leaderboard bind:leaderboardShown {handleBack}/>
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
</style>
