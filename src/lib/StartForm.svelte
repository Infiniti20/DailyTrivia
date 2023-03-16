<script lang="ts">
  export let name: string;
  export let handleSubmit = () => {};

  let nameBind: string;

  let localStorageName = localStorage.getItem("name");
  if (localStorageName !== null) {
    nameBind = localStorageName;
  }
</script>

<div class="form">
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
  </form>
</div>

<style>
  .form {
    display: grid;
    height: 100%;
    width: 100%;
    justify-content: center;
    align-items: center;
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
</style>
