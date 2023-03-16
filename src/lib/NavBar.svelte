<script lang="ts">
  export let timerDisplay: number;
  export let handleNext = () => {};
  export let handleAnalytics = () => {};
</script>

<div>
  <button class="icon" on:click={handleAnalytics}></button>
  <button
    on:click={() => {
      handleNext();
    }}>Next</button
  >
  <span>{timerDisplay}</span>
</div>

<style>
  button {
    cursor: pointer;
    background-color: #333333;
    color: white;
    padding: 10px 20px;
    border-radius: 5px;
    border: 1px solid #333333;
    outline: none;
    margin: 0 0 0 10px;
  }
  button:hover {
    background-image: linear-gradient(rgb(0 0 0/15%) 0 0);
  }
  .inverse {
    background-color: transparent;
    color: #333333;
  }

  div {
    width: 100%;
    display: flex;
    height: 70%;
    /* margin: 0 10px; */
  }

  .icon {
    font-family: "icomoon";
    color: #333333;
    background-color: transparent;
  }
  span {
    height: 100%;
    display: block;
    aspect-ratio: 1;
    background: #333333;
    color: white;
    float: right;
    justify-content: center;
    align-self: center;
    display: inline-flex;
    align-items: center;
    border-radius: 50%;
    margin: 0 10px 0 10px;
    margin-left: auto;
  }
</style>
