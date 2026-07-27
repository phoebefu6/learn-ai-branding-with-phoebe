/* brand-live.js - the brand-consistency lever simulator (learn-ai-branding-with-phoebe).
   Reusable "watch the number climb" pattern (see finance-live.js / marketing-live.js).
   Deterministic, offline, no dependencies. Renders into #brand-live.

   Teaching idea: the learner builds up Cadence's brand system by toggling foundations
   (positioning, personality, voice rules, visual system, guidelines) and watches an
   AI-generated brand asset go from generic "everyone" sludge to unmistakably on-brand,
   plus a scorecard across asset types. The "model" is a scripted teaching simulation;
   the lesson (without a documented system, AI makes every brand look and sound the same)
   is real. */
(function () {
  var host = document.getElementById("brand-live");
  if (!host) return;

  var LEVERS = [
    { id: "positioning", label: "Lock the positioning",   hint: "what Cadence stands for",   pts: 30 },
    { id: "voice",       label: "Add voice + never-say",   hint: "how it speaks",             pts: 22 },
    { id: "personality", label: "Set personality",         hint: "archetype + how it behaves", pts: 15 },
    { id: "visual",      label: "Define visual system",    hint: "colour, type, logo",        pts: 15 },
    { id: "guidelines",  label: "Write the guidelines",    hint: "the book + brand GPT",      pts: 8 }
  ];

  var state = { positioning: false, voice: false, personality: false, visual: false, guidelines: false, mode: "live" };

  function score() {
    var s = 10;
    LEVERS.forEach(function (l) { if (state[l.id]) s += l.pts; });
    return Math.min(100, s);
  }

  var GOLDEN = [
    { name: "Tagline",          need: ["positioning", "voice"],                          why: "message + words" },
    { name: "Social post",      need: ["positioning", "personality", "voice"],           why: "+ attitude" },
    { name: "Sales email",      need: ["positioning", "voice", "guidelines"],            why: "+ consistency" },
    { name: "Landing headline", need: ["positioning", "personality", "voice", "visual"], why: "full identity" }
  ];
  function assetOk(a) { return a.need.every(function (k) { return state[k]; }); }
  function onBrand() { return GOLDEN.filter(assetOk).length; }

  function draft() {
    var parts = [];
    if (!state.positioning) {
      parts.push({ warn: true, label: "Tagline", t: "“Cadence: innovative solutions for the modern world.”" });
      parts.push({ warn: true, t: "(No positioning locked, so the AI defaults to generic everyone-copy that could belong to any brand in any category. This is the AI sameness trap - and no bigger model fixes it.)" });
      return parts;
    }
    parts.push({ warn: false, label: "Tagline",
      t: state.voice
        ? "“Stop taking notes. Start being present.”"
        : "“Cadence captures your meeting notes and action items automatically.” (on-message, but the wording is flat without voice rules)" });

    var social = "For consultants who live in back-to-back calls, Cadence writes the notes so you can actually listen.";
    if (state.personality) social += " Calm, capable, quietly on your side - never another thing to manage.";
    else social += " (No personality set, so the attitude is generic - correct facts, no character.)";
    parts.push({ warn: false, label: "Social post", t: social });

    if (state.voice) parts.push({ warn: false, label: "Voice check", t: "On-voice: plain, warm, confident. Banned phrases avoided (no “revolutionary”, no “game-changer”, no hype)." });
    else parts.push({ warn: true, label: "Voice check", t: "No voice rules or never-say list, so hype words and off-tone phrasing slip through unchecked." });

    if (state.visual) parts.push({ warn: false, label: "Visual note", t: "Rendered in the brand system: ink-navy ground, coral accent, the wordmark locked - it looks like Cadence at a glance." });
    if (state.guidelines) parts.push({ warn: false, label: "At scale", t: "Guidelines + a brand GPT mean the next 100 assets come out this consistent without you in the room." });
    return parts;
  }

  host.innerHTML =
    '<div class="bl-shell">' +
      '<div class="bl-controls">' +
        '<div class="bl-ctitle">Build the brand system</div>' +
        '<div class="bl-levers"></div>' +
        '<div class="bl-modes">' +
          '<button type="button" class="bl-mode bl-on" data-mode="live">Live asset</button>' +
          '<button type="button" class="bl-mode" data-mode="score">Consistency scorecard</button>' +
        '</div>' +
      '</div>' +
      '<div class="bl-stage">' +
        '<div class="bl-meters">' +
          '<div class="bl-meter"><span class="bl-mlabel">On-brand consistency</span><span class="bl-mval" id="bl-score">10</span><div class="bl-bar"><i id="bl-bar"></i></div></div>' +
          '<div class="bl-meter"><span class="bl-mlabel">Asset types on-brand</span><span class="bl-mval" id="bl-assets">0 / 4</span></div>' +
        '</div>' +
        '<div id="bl-body"></div>' +
        '<p class="bl-rail">This model is a scripted teaching simulation - a real LLM words things differently. What is real is the lesson: without a documented brand system, AI makes every brand look and sound the same. The system is what lets AI scale your brand instead of diluting it - and a human still owns the brand soul.</p>' +
      '</div>' +
    '</div>';

  var leverWrap = host.querySelector(".bl-levers");
  LEVERS.forEach(function (l) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "bl-lever";
    b.setAttribute("data-lever", l.id);
    b.innerHTML = '<span class="bl-sw"></span><span class="bl-ltext"><b>' + l.label + '</b><span>' + l.hint + '</span></span>';
    b.addEventListener("click", function () { state[l.id] = !state[l.id]; render(); });
    leverWrap.appendChild(b);
  });
  host.querySelectorAll(".bl-mode").forEach(function (m) {
    m.addEventListener("click", function () { state.mode = m.getAttribute("data-mode"); render(); });
  });

  function render() {
    host.querySelectorAll(".bl-lever").forEach(function (b) {
      b.classList.toggle("bl-active", !!state[b.getAttribute("data-lever")]);
    });
    host.querySelectorAll(".bl-mode").forEach(function (m) {
      m.classList.toggle("bl-on", m.getAttribute("data-mode") === state.mode);
    });
    var s = score();
    host.querySelector("#bl-score").textContent = s;
    host.querySelector("#bl-bar").style.width = s + "%";
    var ob = onBrand();
    var aEl = host.querySelector("#bl-assets");
    aEl.textContent = ob + " / 4";
    aEl.className = "bl-mval" + (ob === 4 ? " bl-good" : "");

    var body = host.querySelector("#bl-body");
    if (state.mode === "score") {
      var rows = GOLDEN.map(function (a) {
        var ok = assetOk(a);
        return '<tr class="' + (ok ? "bl-r-ok" : "bl-r-no") + '"><td>' + a.name + '</td><td>' + a.why +
          '</td><td class="bl-rmark">' + (ok ? "✓" : "✗") + '</td></tr>';
      }).join("");
      body.innerHTML =
        '<div class="bl-scorehead">' + ob + ' of 4 asset types are on-brand <b>(' + Math.round((ob / 4) * 100) + '%)</b></div>' +
        '<table class="bl-table"><thead><tr><th>Asset type</th><th>On-brand needs</th><th>OK?</th></tr></thead><tbody>' + rows + '</tbody></table>' +
        '<p class="bl-note">Each asset type needs more of the system than the last. Fill the system in and watch every asset type turn on-brand - that is a brand AI can scale.</p>';
    } else {
      var d = draft();
      body.innerHTML =
        '<div class="bl-draftlabel">AI-generated Cadence brand assets</div>' +
        '<div class="bl-draft">' + d.map(function (p) {
          var lab = p.label ? '<span class="bl-tag">' + p.label + '</span> ' : '';
          return '<p class="bl-line' + (p.warn ? " bl-warn" : "") + '">' + lab + p.t + '</p>';
        }).join("") + '</div>';
    }
  }

  render();
})();
