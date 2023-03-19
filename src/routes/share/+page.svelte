<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";

  const time = parseInt($page.url.searchParams.get("t") ?? "0");
  const name = $page.url.searchParams.get("n") ?? "I"
  console.log(time, name)
  function navigate() {
    goto("/")
  }
  try {
    navigate();
  } catch {}
</script>

<svelte:head>
  <meta property="og:type" content="website" />

  <meta property="og:url" content="/" />

  <meta property="og:title" content="DailyTrivia" />

  <meta property="og:description" content="It's in the name" />

  <meta
    property="og:image"
    content="https://rest.apitemplate.io/05077b2383303bea@CziFDL5Y/image.png}&score.text={time}"
  />
</svelte:head>
<div>Loading, hang on</div>
