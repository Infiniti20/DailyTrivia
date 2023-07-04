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
  <meta property="og:type" content="website">
  <meta property="og:title" content="Kwizzy - Daily Trivia">
  <meta property="og:description" content="5 new trivia questions everyday! Compete with all your friends to see who can get the highest score!">
  <meta property="og:image" content="https://kwizzy.me/api/og?n={name}&s={time}">

  <!-- Twitter Meta Tags -->
  <meta name="twitter:card" content="summary_large_image">
  <meta property="twitter:domain" content="kwizzy.me">
  <meta property="twitter:url" content="https://kwizzy.me">
  <meta name="twitter:title" content="Kwizzy - Daily Trivia">
  <meta name="twitter:description" content="5 new trivia questions everyday! Compete with all your friends to see who can get the highest score!">
  <meta name="twitter:image" content="https://kwizzy.me/api/og?n={name}&s={time}">


</svelte:head>
<div>Loading, hang on</div>
