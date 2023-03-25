<script lang="ts">
  export let leaderboardShown;
  export let handleBack = () => {
    leaderboardShown = false;
  };
  interface leaderboard {
    [id: string]: {
      name: string;
      score: number;
      id: number;
    };
  }
  async function getLeaderBoard() {
    let res: leaderboard = await (
      await (await fetch(`/api/database?t=${new Date().getTime()}`)).json()
    ).data;
    let sortedBoard = Object.values(res).sort((a, b) => b.score - a.score);
    return sortedBoard;
  }

  let promise = getLeaderBoard();
  let dateSplit = new Date().toDateString().split(" ");
  let date = [dateSplit[0], dateSplit[1] + " " + dateSplit[2]].join(", ");
</script>

{#await promise}
  Loading
{:then leaderboardData}
  <span class="title"><b>{date}</b></span>
  <div class="grid">
    <div class="row no-border">
      <span><b>Rank</b></span>

      <span><b>Name</b></span>
      <span><b>Score</b></span>
    </div>
    {#each leaderboardData as person, index}
      <div class="row">
        <span>{index + 1}</span>
        <span>{person.name}</span>
        <span>{person.score}</span>
      </div>
    {/each}
  </div>
  <button on:click={handleBack}>Back</button>
{/await}

<style>
  .grid {
    height: 170px;
    padding: 20px;
    padding-top: 0px;
    overflow-y: scroll;
    margin-bottom: 20px;
    width: 300px;
  }
  .row {
    display: grid;
    grid-template-columns: 33% 33% 33%;
    border-top: 1px solid #dad8d8;
    padding: 5px 0 5px 0;
  }
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    border-radius: 8px;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 8px;
    background-color: #dad8d8;
  }
  .no-border {
    border: none;
  }
  .row:nth-child(2) {
    border: none;
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
  .title {
    font-size: 20px;
    text-align: left;
  }
</style>
