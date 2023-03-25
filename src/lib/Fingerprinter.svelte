<script lang="ts">
  export let fingerprint;
  function getFingerprint():number {
    function createFingerprint(string: string) {
      var hash = 0,
        i,
        chr;
      if (string.length === 0) return hash;
      for (i = 0; i < string.length; i++) {
        chr = string.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0;
      }
      return hash;
    }

    var canvas = document.createElement("canvas");
    var gl = canvas.getContext("webgl");

    var timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    var timezone_offset = new Date().getTimezoneOffset();
    if(gl == null){return 0}
    var graphics_card = gl.getParameter(gl.RENDERER);

    return createFingerprint(
        window.screen.availWidth +
          "x" +
          window.screen.availHeight +
          "_" +
          window.screen.colorDepth +
          "_" +
          navigator.userAgent +
          "_" +
          navigator.platform +
          "_" +
          navigator.language +
          "_" +
          navigator.hardwareConcurrency +
          "_" +
          navigator.cookieEnabled +
          "_" +
          timezone +
          "_" +
          timezone_offset +
          "_" +
          graphics_card
      )
  }

  fingerprint = getFingerprint()
</script>
