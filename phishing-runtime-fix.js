(function () {
  function bindOnce(element, event, handler, key) {
    if (!element || element.dataset[key]) return;
    element.dataset[key] = "true";
    element.addEventListener(event, handler);
  }

  window.addEventListener("load", function () {
    try {
      if (typeof tool === "function") {
        bindOnce(document.getElementById("senderBtn"), "click", function () { tool("sender"); }, "fixSenderBound");
        bindOnce(document.getElementById("linkBtn"), "click", function () { tool("link"); }, "fixLinkBound");
        bindOnce(document.getElementById("attachmentBtn"), "click", function () { tool("attachment"); }, "fixAttachmentBound");
        bindOnce(document.getElementById("contextBtn"), "click", function () { tool("context"); }, "fixContextBound");
      }

      if (typeof decide === "function") {
        document.querySelectorAll(".decision-btn").forEach(function (btn) {
          bindOnce(btn, "click", function () { decide(btn.dataset.choice); }, "fixDecisionBound");
        });
      }

      if (typeof renderLadder === "function") renderLadder();
    } catch (e) {
      console.warn("SCCYBER phishing runtime fix failed", e);
    }
  });
})();
