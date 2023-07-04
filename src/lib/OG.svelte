<script lang="ts">

    export let name:string = "I"
    export let score:number = 100
    const scoreString = score.toString().split("")
      let theme: string[] = ["#1368ce", "#e21b3c", "#ffa602", "#26890c"];

</script>

<div>
  {name} scored
    <h1>
      {#each scoreString as letter,i }
        <span style="color:{theme[i]}">{letter}</span>
      {/each}
    </h1>
    on DailyTrivia
</div>

<style>
  div{
    display: flex;
    flex-direction: column;
    background-color: white;
    width:100%;
    height:100%;
    justify-content: center;
    align-items: center;
    color: #333333;
    font-size:60px;
  }
  h1{
    font-family: Roboto;
    font-size: 120px;
    font-weight: bolder;
    color:#ffa602
  }
</style>