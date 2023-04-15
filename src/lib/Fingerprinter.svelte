<script lang="ts">
  export let fingerprint;
  export let ip: string;
  function getFingerprint(): number {
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
    var canvas2 = document.createElement("canvas");
    var gl = canvas.getContext("webgl");

    var ctx = canvas2.getContext("2d");
    if (ctx == null) {
      return 0;
    }
    if (gl == null) {
      return 0;
    }

    // https://www.browserleaks.com/canvas#how-does-it-work
    var txt = "CANVAS_FINGERPRINT";
    ctx.textBaseline = "top";
    ctx.font = "14px 'Arial'";
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = "#f60";
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = "#069";
    ctx.fillText(txt, 2, 15);
    ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
    ctx.fillText(txt, 4, 17);
    let dataURL = canvas2.toDataURL();

    var timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    var timezone_offset = new Date().getTimezoneOffset();
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
        graphics_card +
        "_" +
        dataURL +
        "_" +
        ip
    );
  }

  fingerprint = getFingerprint();
</script>
