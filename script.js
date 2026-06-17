const GAME_SECONDS = 120;
const MAX_RISK = 100;

const emails = [
  {
    type: "phishing",
    category: "PASSWORD RESET",
    from: "Microsoft Support <support@microsoft-login-secure.net>",
    reply: "reset@microsoft-login-secure.net",
    subject: "Password Expiring Today",
    body: "Your Microsoft 365 password expires today. Verify your account now to avoid losing access.\n\nClick here to keep your mailbox active.",
    sender: "Lookalike domain. Real Microsoft emails do not come from microsoft-login-secure.net.",
    link: "Link points to https://microsoft-login-secure.net/auth rather than a real Microsoft domain.",
    attachment: "No attachment.",
    context: "Urgency plus credential request is a strong phishing pattern.",
    lesson: "Lookalike domains and urgent login requests are major phishing indicators."
  },
  {
    type: "suspicious",
    category: "INVOICE",
    from: "Accounts <billing@northwest-supplies.co.uk>",
    reply: "billing@northwest-supplies.co.uk",
    subject: "Updated invoice attached",
    body: "Hi, please see the updated invoice attached. The bank details have changed from this month. Please process today.",
    sender: "Sender domain appears plausible but should be verified.",
    link: "No links found.",
    attachment: "Attachment: invoice_update.docm. Macro enabled documents are risky.",
    context: "Bank detail changes should be verified using a known trusted contact.",
    lesson: "Supplier payment changes should never be trusted from email alone."
  },
  {
    type: "safe",
    category: "MEETING",
    from: "Sarah Ahmed <sarah.ahmed@sccyber.co.uk>",
    reply: "sarah.ahmed@sccyber.co.uk",
    subject: "Workshop agenda for tomorrow",
    body: "Hi, I have attached the final running order for tomorrow's awareness workshop. No action needed tonight.",
    sender: "Known internal sender using the expected domain.",
    link: "No external links found.",
    attachment: "Attachment: agenda.pdf. Standard low risk document type.",
    context: "Message context is expected and does not pressure the recipient.",
    lesson: "Safe emails usually match expected sender, context and behaviour."
  },
  {
    type: "phishing",
    category: "DOCUSHARE",
    from: "DocuSign <secure@docusign.documents-review.com>",
    reply: "secure@docusign.documents-review.com",
    subject: "Document waiting for signature",
    body: "A confidential document is waiting for your signature. Review within 2 hours or the request will expire.",
    sender: "Brand impersonation with a non official domain.",
    link: "Link goes to documents-review.com/signin, not DocuSign.",
    attachment: "No attachment.",
    context: "Urgency and fake brand domain make this phishing.",
    lesson: "Brand impersonation often relies on domains that look close but are not official."
  },
  {
    type: "safe",
    category: "DELIVERY",
    from: "Royal Mail <no-reply@royalmail.com>",
    reply: "no-reply@royalmail.com",
    subject: "Your parcel is out for delivery",
    body: "Your parcel is due today. Track using your Royal Mail account or app.",
    sender: "Sender domain matches the service.",
    link: "No direct payment link in this email.",
    attachment: "No attachment.",
    context: "No pressure, no payment request, and no credential request.",
    lesson: "Not every branded email is phishing. Context and destination matter."
  },
  {
    type: "phishing",
    category: "QR PHISHING",
    from: "IT Service Desk <it-helpdesk@sccyber-support.com>",
    reply: "support@sccyber-support.com",
    subject: "Scan QR code to keep Teams active",
    body: "Your Teams access requires reactivation. Scan the QR code and sign in to continue using your account.",
    sender: "External support domain pretending to be internal IT.",
    link: "QR code destination resolves to sccyber-support.com/login.",
    attachment: "Embedded QR image found.",
    context: "QR codes can hide malicious links from normal email checks.",
    lesson: "QR phishing hides the real destination until the user scans it."
  },
  {
    type: "suspicious",
    category: "CEO REQUEST",
    from: "Sham Chohan <sham.chohan@sc-cyber.co.uk>",
    reply: "urgent.finance@gmail.com",
    subject: "Quick favour before my meeting",
    body: "Can you buy £500 of gift cards for a client event? I am tied up and need this done quickly.",
    sender: "Display name looks familiar but reply to address is Gmail and not company mail.",
    link: "No links found.",
    attachment: "No attachment.",
    context: "Gift card pressure request should be verified out of band.",
    lesson: "Business email compromise often abuses authority and urgency."
  },
  {
    type: "safe",
    category: "HR",
    from: "HR Team <hr@sccyber.co.uk>",
    reply: "hr@sccyber.co.uk",
    subject: "Updated leave policy",
    body: "The updated annual leave policy is now available on the staff portal. Please read when you have time.",
    sender: "Known internal domain.",
    link: "Mentions staff portal but does not force a direct login link.",
    attachment: "No attachment.",
    context: "Normal tone, no urgency, expected HR update.",
    lesson: "Legitimate internal updates are usually calm, expected and verifiable."
  },
  {
    type: "phishing",
    category: "MFA FATIGUE",
    from: "Security Alert <mfa-alert@identity-protect.net>",
    reply: "mfa-alert@identity-protect.net",
    subject: "MFA failed. Approve request to stop account lock",
    body: "Multiple sign in attempts detected. Approve the pending request to prevent your account being locked.",
    sender: "Third party domain pretending to handle identity alerts.",
    link: "Link opens fake MFA approval page.",
    attachment: "No attachment.",
    context: "Attackers may pressure users into approving MFA prompts.",
    lesson: "Never approve unexpected MFA prompts. Report them immediately."
  },
  {
    type: "suspicious",
    category: "CLOUD FILE",
    from: "Tom Richards <tom.richards@partnerfirm.co.uk>",
    reply: "tom.richards@partnerfirm.co.uk",
    subject: "Shared file for review",
    body: "Hi, sharing the file we discussed. It asks you to sign in before download.",
    sender: "Known partner, but still requires verification because sign in is requested.",
    link: "Link goes to files.partnerfirm-share.com, not the usual Microsoft or Google portal.",
    attachment: "No attachment.",
    context: "Could be legitimate, but sign in via unusual portal makes it suspicious.",
    lesson: "Known sender does not automatically mean safe. Check the destination and context."
  }
];

let deck = [];
let current = null;
let timeLeft = GAME_SECONDS;
let timer = null;
let score = 0;
let risk = 0;
let processed = 0;
let correct = 0;
let wrong = 0;
let stoppedThreats = 0;
let streak = 0;
let bestStreak = 0;
let gameOver = false;

const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("gameScreen");
const endScreen = document.getElementById("endScreen");
const startBtn = document.getElementById("startBtn");
const playAgainBtn = document.getElementById("playAgainBtn");
const timerBox = document.getElementById("timerBox");
const scoreBox = document.getElementById("scoreBox");
const riskBox = document.getElementById("riskBox");
const countBox = document.getElementById("countBox");
const categoryTag = document.getElementById("categoryTag");
const difficultyTag = document.getElementById("difficultyTag");
const fromField = document.getElementById("fromField");
const replyField = document.getElementById("replyField");
const subjectField = document.getElementById("subjectField");
const bodyField = document.getElementById("bodyField");
const toolOutput = document.getElementById("toolOutput");
const feedbackBox = document.getElementById("feedbackBox");
const endTitle = document.getElementById("endTitle");
const rankBox = document.getElementById("rankBox");
const endStats = document.getElementById("endStats");
const endLesson = document.getElementById("endLesson");

function shuffle(items){
  const copy = [...items];
  for(let i = copy.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function formatTime(seconds){
  const m = String(Math.floor(seconds / 60)).padStart(2,"0");
  const s = String(seconds % 60).padStart(2,"0");
  return `${m}:${s}`;
}

function rank(){
  const accuracy = processed ? Math.round((correct / processed) * 100) : 0;
  if(score >= 2600 && accuracy >= 90) return "CISO";
  if(score >= 2000 && accuracy >= 80) return "SOC LEAD";
  if(score >= 1400 && accuracy >= 70) return "ENGINEER";
  if(score >= 800) return "ANALYST";
  return "INTERN";
}

function updateHud(){
  timerBox.textContent = `TIME: ${formatTime(timeLeft)}`;
  scoreBox.textContent = `SCORE: ${score}`;
  riskBox.textContent = `BREACH RISK: ${risk}%`;
  countBox.textContent = `EMAILS: ${processed}`;
  riskBox.classList.toggle("danger", risk >= 70);
}

function nextEmail(){
  if(gameOver) return;
  if(!deck.length) deck = shuffle(emails);
  current = deck.pop();

  categoryTag.textContent = current.category;
  difficultyTag.textContent = current.type.toUpperCase();
  fromField.textContent = current.from;
  replyField.textContent = current.reply;
  subjectField.textContent = current.subject;
  bodyField.textContent = current.body;
  toolOutput.textContent = "Select a tool before deciding.";
  feedbackBox.textContent = "";
  feedbackBox.className = "feedback";
}

function tool(type){
  if(!current) return;
  const map = {
    sender: current.sender,
    link: current.link,
    attachment: current.attachment,
    context: current.context
  };
  toolOutput.textContent = map[type];
}

function decide(choice){
  if(gameOver || !current) return;

  processed += 1;
  const isCorrect = choice === current.type;

  if(isCorrect){
    correct += 1;
    streak += 1;
    bestStreak = Math.max(bestStreak, streak);
    const points = current.type === "phishing" ? 220 : current.type === "suspicious" ? 170 : 120;
    score += points + (streak * 15);
    risk = Math.max(0, risk - 5);
    if(current.type !== "safe") stoppedThreats += 1;
    feedbackBox.textContent = `Correct. ${current.lesson}`;
    feedbackBox.className = "feedback good";
  } else {
    wrong += 1;
    streak = 0;
    const penalty = current.type === "phishing" ? 28 : current.type === "suspicious" ? 18 : 12;
    risk = Math.min(MAX_RISK, risk + penalty);
    score = Math.max(0, score - 100);
    feedbackBox.textContent = `Wrong. This was ${current.type.toUpperCase()}. ${current.lesson}`;
    feedbackBox.className = "feedback bad";
  }

  updateHud();
  if(risk >= MAX_RISK){
    endGame(true);
    return;
  }

  setTimeout(nextEmail, 900);
}

function startGame(){
  deck = shuffle(emails);
  timeLeft = GAME_SECONDS;
  score = 0;
  risk = 0;
  processed = 0;
  correct = 0;
  wrong = 0;
  stoppedThreats = 0;
  streak = 0;
  bestStreak = 0;
  gameOver = false;

  startScreen.classList.add("hidden");
  endScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
  updateHud();
  nextEmail();

  clearInterval(timer);
  timer = setInterval(() => {
    timeLeft -= 1;
    updateHud();
    if(timeLeft <= 0) endGame(false);
  }, 1000);
}

function endGame(breached){
  if(gameOver) return;
  gameOver = true;
  clearInterval(timer);
  gameScreen.classList.add("hidden");
  endScreen.classList.remove("hidden");

  const accuracy = processed ? Math.round((correct / processed) * 100) : 0;
  const finalRank = rank();

  endTitle.textContent = breached ? "BREACH CONFIRMED" : "INVESTIGATION COMPLETE";
  rankBox.textContent = `RANK: ${finalRank}`;
  endStats.innerHTML = `
    Score: ${score}<br>
    Accuracy: ${accuracy}%<br>
    Emails investigated: ${processed}<br>
    Threats stopped: ${stoppedThreats}<br>
    Breach risk: ${risk}%<br>
    Best streak: ${bestStreak}
  `;
  endLesson.textContent = breached
    ? "The breach risk reached 100%. Review sender domains, links and pressure tactics before making a decision."
    : "Good investigation work. Phishing defence is about checking sender, context, links and attachments before trusting the message.";
}

startBtn.addEventListener("click", startGame);
playAgainBtn.addEventListener("click", startGame);
document.getElementById("senderBtn").addEventListener("click", () => tool("sender"));
document.getElementById("linkBtn").addEventListener("click", () => tool("link"));
document.getElementById("attachmentBtn").addEventListener("click", () => tool("attachment"));
document.getElementById("contextBtn").addEventListener("click", () => tool("context"));
document.querySelectorAll(".decision-btn").forEach(btn => {
  btn.addEventListener("click", () => decide(btn.dataset.choice));
});
