<script lang="ts">
  import { page } from "$app/stores";

  const time = parseInt($page.url.searchParams.get("t")?? "0")
</script>

<div>{time}</div>
