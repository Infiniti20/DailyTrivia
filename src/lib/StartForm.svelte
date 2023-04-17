<script lang="ts">
  import Analytics from "./Analytics.svelte";

  export let name: string;
  export let handleSubmit = () => {};

  let nameBind: string;
  let leaderboard: boolean = false;

  let localStorageName = localStorage.getItem("name");
  if (localStorageName !== null) {
    nameBind = localStorageName;
  }
</script>

<div class="form">
  <div class="nav">
    <img src="/Kwizzy.png" alt="" class="image">
  </div>
  <form
    on:submit|preventDefault={() => {
      if (nameBind) {
        name = nameBind;
        localStorage.setItem("name", name);
      }
      handleSubmit();
    }}
  >
    <input type="text" bind:value={nameBind} placeholder="Nickname" />
    <br />
    <button type="submit">Enter Game</button>
    {#if !localStorage.length}
      <button class="inverse" on:click|preventDefault={()=>{
        leaderboard = true;
      }}>Leaderboard</button>
    {/if}
  </form>
  {#if leaderboard}
  <Analytics leaderboardShown={true} endScreen score={0} name={""} handleBack={()=>{leaderboard = false}}></Analytics>
  {/if}
</div>

<style>
  .nav{
    display: flex;
    justify-content: center;
    width: 100%;
  }
  .image{
    width:150px;
    aspect-ratio:  993 / 306;
  }
  .form {
    display: grid;
    height: 100%;
    width: 100%;
    justify-content: center;
    align-items: center;
    grid-template-rows: 12fr 99fr;
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
  .inverse{
    background-color: white;
    color: #333333;
  }
</style>
