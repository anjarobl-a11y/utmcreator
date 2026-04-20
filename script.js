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

  // Source: leer starten
  const sourcePlaceholder = document.createElement("option");
  sourcePlaceholder.textContent = "Please select Source";
  sourcePlaceholder.disabled = true;
  sourcePlaceholder.selected = true;
  sourceSelect.appendChild(sourcePlaceholder);

  Object.keys(utmConfig).forEach(source => {
    const o = document.createElement("option");
    o.value = source;
    o.textContent = source;
    sourceSelect.appendChild(o);
  });

  // Medium: disabled starten
  mediumSelect.disabled = true;
  const mediumPlaceholder = document.createElement("option");
  mediumPlaceholder.textContent = "Please select Source first";
  mediumPlaceholder.disabled = true;
  mediumPlaceholder.selected = true;
  mediumSelect.appendChild(mediumPlaceholder);

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

  // Optionale Felder ein/ausklappen
  const toggleBtn = document.querySelector(".optional-toggle");
  const optionalFields = document.querySelector(".optional-fields");

  toggleBtn.addEventListener("click", () => {
    const isOpen = !optionalFields.hasAttribute("hidden");
    optionalFields.toggleAttribute("hidden");
    toggleBtn.textContent = isOpen
      ? "Optionale Parameter anzeigen"
      : "Optionale Parameter ausblenden";
    toggleBtn.setAttribute("aria-expanded", String(!isOpen));
  });

  // UTM generieren
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

  // Copy
  window.copyUTM = function () {
    resultField.select();
    document.execCommand("copy");
  };

});
