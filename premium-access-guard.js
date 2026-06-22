(function () {
  document.documentElement.style.visibility = "hidden";

  window.addEventListener("message", function (event) {
    const data = event.data || {};

    if (data.type !== "SCCYBER_REQUEST_ATTEMPT") return;

    const finished = typeof gameOver !== "undefined" && gameOver === true;

    if (!finished) {
      event.stopImmediatePropagation();
      event.preventDefault();
    }
  }, true);

  function showLocked(message) {
    document.documentElement.style.visibility = "visible";
    document.body.innerHTML = `
      <main class="game-shell" style="min-height:80vh;display:flex;align-items:center;justify-content:center;text-align:center;">
        <section class="start-screen" style="max-width:760px;">
          <img src="https://sccyber.github.io/breach-lockdown/logo.png" alt="SCCYBER logo" class="logo start-logo">
          <div class="brand-mark">SCCYBER</div>
          <div class="badge">PORTAL ACCESS REQUIRED</div>
          <h1>ACCESS LOCKED</h1>
          <p class="start-lead">${message}</p>
          <p>Please return to the SCCYBER Training Portal and launch this module from your dashboard.</p>
          <a class="primary-btn" style="display:inline-block;text-decoration:none;margin-top:18px;" href="https://sccyber.github.io/Immersive-Training-Package/">RETURN TO PORTAL</a>
        </section>
      </main>
    `;
  }

  function repairGameControls() {
    function bindOnce(element, event, handler, key) {
      if (!element || element.dataset[key]) return;
      element.dataset[key] = "true";
      element.addEventListener(event, handler);
    }

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
      console.warn("SCCYBER phishing control repair failed", e);
    }
  }

  window.addEventListener("load", function () {
    setTimeout(repairGameControls, 250);
    setTimeout(repairGameControls, 1000);
  });

  async function checkPremiumAccess() {
    try {
      if (window.top === window.self) {
        showLocked("Direct access is not allowed.");
        return;
      }

      if (!window.supabase || !window.SCCYBER_SUPABASE_URL || !window.SCCYBER_SUPABASE_ANON_KEY) {
        showLocked("Secure access check is not available.");
        return;
      }

      const client = window.supabase.createClient(window.SCCYBER_SUPABASE_URL, window.SCCYBER_SUPABASE_ANON_KEY);
      const sessionResult = await client.auth.getSession();
      const session = sessionResult?.data?.session;

      if (!session?.user?.id) {
        showLocked("No active portal session was found.");
        return;
      }

      const profileResult = await client
        .from("profiles")
        .select("premium_enabled,is_admin")
        .eq("id", session.user.id)
        .single();

      if (profileResult.error || !profileResult.data) {
        showLocked("Your account could not be verified.");
        return;
      }

      if (profileResult.data.is_admin === true || profileResult.data.premium_enabled === true) {
        document.documentElement.style.visibility = "visible";
        return;
      }

      showLocked("Premium access is not active for this account.");
    } catch (e) {
      showLocked("Secure access check failed.");
    }
  }

  checkPremiumAccess();
})();
