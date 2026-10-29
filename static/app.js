(() => {
  const $ = (id) => document.getElementById(id);
  const tabs = [...document.querySelectorAll(".tab")];
  const panels = [...document.querySelectorAll(".panel")];
  tabs.forEach(tab => tab.addEventListener("click", () => {
    tabs.forEach(t => { const active = t === tab; t.classList.toggle("active", active); t.setAttribute("aria-selected", String(active)); });
    panels.forEach(p => p.classList.toggle("hidden", p.id !== tab.dataset.panel));
  }));

  $("contrastToggle").addEventListener("click", () => {
    const on = document.body.classList.toggle("high-contrast");
    $("contrastToggle").setAttribute("aria-pressed", String(on));
    $("contrastToggle").textContent = on ? "Standard contrast" : "High contrast";
  });

  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  let recognition = null, listening = false;
  const support = $("speechSupport");
  if (Recognition) {
    support.textContent = "Speech recognition available";
    support.classList.add("good");
    recognition = new Recognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.onstart = () => { listening = true; setListeningUI(); $("listeningStatus").textContent = "Listening. Speak clearly near the microphone."; };
    recognition.onresult = (event) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const text = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          const p = document.createElement("p");
          p.textContent = text;
          p.className = "caption-line";
          $("finalCaptions").appendChild(p);
        } else interim += text;
      }
      $("interimCaption").textContent = interim || (listening ? "Listening for speech…" : "Your live words will appear here…");
    };
    recognition.onerror = (event) => {
      const messages = { "not-allowed": "Microphone access was blocked. Allow microphone permission in your browser settings.", "no-speech": "No speech detected. Try again closer to the speaker.", "audio-capture": "No microphone was found.", "network": "Speech recognition needs a network connection in this browser." };
      $("listeningStatus").textContent = messages[event.error] || `Speech recognition error: ${event.error}. Please try again.`;
    };
    recognition.onend = () => {
      listening = false; setListeningUI();
      if ($("listeningStatus").textContent.startsWith("Listening")) $("listeningStatus").textContent = "Listening stopped.";
      $("interimCaption").textContent = "Your live words will appear here…";
    };
  } else {
    support.textContent = "Speech recognition not supported";
    support.classList.add("bad");
    $("listeningStatus").textContent = "Your browser does not support live speech recognition. Try a current desktop version of Google Chrome. Type & speak remains available.";
    $("startListening").disabled = true;
  }
  function setListeningUI() {
    $("startListening").disabled = listening || !Recognition;
    $("stopListening").disabled = !listening;
  }
  $("startListening").addEventListener("click", () => {
    if (!recognition) return;
    recognition.lang = $("languageSelect").value;
    $("listeningStatus").textContent = "Requesting microphone access…";
    try { recognition.start(); } catch (e) { $("listeningStatus").textContent = "Recognition is already starting. Please wait."; }
  });
  $("stopListening").addEventListener("click", () => { if (recognition && listening) recognition.stop(); });
  $("clearCaptions").addEventListener("click", () => { $("finalCaptions").replaceChildren(); $("interimCaption").textContent = "Your live words will appear here…"; });

  const reply = $("replyText");
  function updateLargeReply() { $("largeReply").textContent = reply.value.trim() || "Your typed message will appear in large text here."; }
  reply.addEventListener("input", updateLargeReply);
  $("clearReply").addEventListener("click", () => { reply.value = ""; updateLargeReply(); $("speechOutputStatus").textContent = ""; });
  $("speakReply").addEventListener("click", () => {
    const text = reply.value.trim();
    if (!text) { $("speechOutputStatus").textContent = "Type a message first."; reply.focus(); return; }
    if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) {
      $("speechOutputStatus").textContent = "Text-to-speech is not supported in this browser or device."; return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = $("voiceLanguage").value;
    utterance.onstart = () => $("speechOutputStatus").textContent = "Speaking message…";
    utterance.onend = () => $("speechOutputStatus").textContent = "Finished speaking.";
    utterance.onerror = () => $("speechOutputStatus").textContent = "Could not speak this message. Check installed voices and try again.";
    window.speechSynthesis.speak(utterance);
  });
  $("stopSpeaking").addEventListener("click", () => {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    $("speechOutputStatus").textContent = "Speech stopped.";
  });

  let phraseData = {};
  const phraseButtons = [...document.querySelectorAll(".category-button")];
  phraseButtons.forEach(btn => btn.addEventListener("click", async () => {
    phraseButtons.forEach(b => b.classList.toggle("selected", b === btn));
    const category = btn.dataset.category;
    try {
      if (!Object.keys(phraseData).length) {
        const response = await fetch("/api/phrase-categories");
        if (!response.ok) throw new Error("Could not load phrases");
        phraseData = await response.json();
      }
      renderPhrases(phraseData[category] || []);
    } catch (e) {
      $("phraseGrid").textContent = "Could not load phrases. Refresh the page and try again.";
    }
  }));
  function renderPhrases(phrases) {
    const grid = $("phraseGrid");
    grid.replaceChildren();
    phrases.forEach(phrase => {
      const button = document.createElement("button");
      button.className = "phrase-card";
      button.type = "button";
      const label = document.createElement("span");
      label.textContent = "＋";
      const text = document.createElement("span");
      text.textContent = phrase;
      button.append(text, label);
      button.addEventListener("click", () => {
        reply.value = phrase;
        updateLargeReply();
        tabs.find(t => t.dataset.panel === "replyPanel").click();
        reply.focus();
      });
      grid.appendChild(button);
    });
  }
  // Bind the initial server-rendered phrases too.
  $("phraseGrid").addEventListener("click", (event) => {
    const card = event.target.closest("[data-phrase]");
    if (!card) return;
    reply.value = card.dataset.phrase;
    updateLargeReply();
    tabs.find(t => t.dataset.panel === "replyPanel").click();
    reply.focus();
  });
})();
