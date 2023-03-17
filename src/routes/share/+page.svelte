<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";

  const time = parseInt($page.url.searchParams.get("t")?? "0")
function navigate(){
  goto("/")
}
try{
navigate()
}catch{
    
}
</script>
<svelte:head>
    <meta property="og:type" content="website">

<meta property="og:url" content="/">

<meta property="og:title" content="DailyTrivia">

<meta property="og:description" content="DailyTrivia is awesome">

<meta property="og:image" content="[https://ia.media-imdb.com/images/rock.jpg](https://ia.media-imdb.com/images/rock.jpg)">


</svelte:head>
<div>{time}</div>
