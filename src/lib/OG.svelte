<script lang="ts">
      import { page } from '$app/stores'

    export let name:string = "I"
    export let score:number = 100
</script>

<div>
  {name} scored
    <h1>{score}</h1>
    on DailyTrivia
</div>

<style>
  div{
    display: flex;
    flex-direction: column;
    background-color: #1368ce;
    width:100%;
    height:100%;
    justify-content: center;
    align-items: center;
    color: white;
    font-size:60px;
  }
  h1{
    font-family: Roboto;
    font-size: 120px;
    font-weight: bolder;
    color:#ffa602
  }
</style>