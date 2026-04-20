document.addEventListener("DOMContentLoaded", () => {

  const utmConfig = {
    google: ["cpc", "organic"],
    bing: ["organic"],
    instagram: ["cpc", "organic"],
    facebook: ["cpc", "organic"],
    newsletter: ["email"],
    affiliate: ["awin"]
  };

  const sourceSelect = document.getElementById("source");
  const mediumSelect = document.getElementById("medium");

  const baseInput = document.getElementById("base");
  const campaignInput = document.getElementById("campaign");
  const termInput = document.getElementById("term");
  const contentInput = document.getElementById("content");
  const resultField = document.getElementById("result");

  /* Source leer */
  const sp = document.createElement("option");
  sp.textContent = "Bitte Source auswählen";
  sp.disabled = true;
  sp.selected = true;
  sourceSelect.appendChild(sp);

  Object.keys(utmConfig).forEach(src => {
    const o = document.createElement("option");
    o.value = src;
    o.textContent = src;
    sourceSelect.appendChild(o);
  });

  /* Medium disabled */
  mediumSelect.disabled = true;
  const mp = document.createElement("option");
  mp.textContent = "Bitte zuerst Source wählen";
  mp.disabled = true;
  mp.selected = true;
  mediumSelect.appendChild(mp);

  sourceSelect.addEventListener("change", () => {
    mediumSelect.innerHTML = "";
    utmConfig[sourceSelect.value].forEach(m => {
      const o = document.createElement("option");
      o.value = m;
      o.textContent = m;
      mediumSelect.appendChild(o);
    });
    mediumSelect.disabled = false;
  });

  /* Optional Toggle */
  const toggleBtn = document.querySelector(".optional-toggle");
  const optionalFields = document.querySelector(".optional-fields");

  toggleBtn.addEventListener("click", () => {
    const open = !optionalFields.hasAttribute("hidden");
    optionalFields.toggleAttribute("hidden");
    toggleBtn.textContent = open
      ? "Optionale Parameter anzeigen"
      : "Optionale Parameter ausblenden";
    toggleBtn.setAttribute("aria-expanded", String(!open));
  });

  /* UTM generieren */
  window.generateUTM = function () {
    if (!baseInput.value || !sourceSelect.value || !mediumSelect.value || !campaignInput.value) {
      alert("Bitte alle Pflichtfelder ausfüllen.");
      return;
    }

    let url =
      `${baseInput.value}?utm_source=${sourceSelect.value}` +
      `&utm_medium=${mediumSelect.value}` +
      `&utm_campaign=${campaignInput.value}`;

    if (termInput.value) {
      url += `&utm_term=${encodeURIComponent(termInput.value)}`;
    }
    if (contentInput.value) {
      url += `&utm_content=${encodeURIComponent(contentInput.value)}`;
    }

    resultField.value = url;

    const history = JSON.parse(localStorage.getItem("utmHistory")) || [];
    history.unshift({ url, createdAt: new Date().toISOString() });
    localStorage.setItem("utmHistory", JSON.stringify(history));
  };

  /* Copy */
  window.copyUTM = function () {
    resultField.select();
    document.execCommand("copy");
  };
});
