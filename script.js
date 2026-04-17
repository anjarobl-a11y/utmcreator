
document.addEventListener("DOMContentLoaded", () => {

  // =========================
  // UTM-Konfiguration
  // =========================
  const utmConfig = {
    google: ["cpc", "organic"],
    bing: ["organic"],
    instagram: ["cpc", "organic"],
    facebook: ["cpc", "organic"],
    cb: ["partnerprogramme"],
    sovendus: ["partnerprogramme"],
    newsletter: ["email"],
    affiliate: ["awin"],
    qr: ["qr"],
    cooperation: ["cooperation"]
  };

  const sourceSelect = document.getElementById("source");
  const mediumSelect = document.getElementById("medium");

  if (!sourceSelect || !mediumSelect) {
    console.error("Select elements not found");
    return;
  }

  // =========================
  // Initial State
  // =========================

  // Source: leer + Platzhalter
  const sourcePlaceholder = document.createElement("option");
  sourcePlaceholder.value = "";
  sourcePlaceholder.textContent = "Bitte Source auswählen";
  sourcePlaceholder.disabled = true;
  sourcePlaceholder.selected = true;
  sourceSelect.appendChild(sourcePlaceholder);

  // Medium initial deaktiviert
  mediumSelect.disabled = true;

  const mediumPlaceholder = document.createElement("option");
  mediumPlaceholder.value = "";
  mediumPlaceholder.textContent = "Bitte zuerst Source auswählen";
  mediumPlaceholder.disabled = true;
  mediumPlaceholder.selected = true;
  mediumSelect.appendChild(mediumPlaceholder);

  // =========================
  // Source Dropdown befüllen
  // =========================
  Object.keys(utmConfig).forEach(source => {
    const option = document.createElement("option");
    option.value = source;
    option.textContent = source;
    sourceSelect.appendChild(option);
  });

  // =========================
  // Medium abhängig von Source
  // =========================
  function updateMedium() {
    mediumSelect.innerHTML = "";

    const selectedSource = sourceSelect.value;

    if (!selectedSource || !utmConfig[selectedSource]) {
      mediumSelect.disabled = true;

      const placeholder = document.createElement("option");
      placeholder.textContent = "Bitte zuerst Source auswählen";
      placeholder.disabled = true;
      placeholder.selected = true;
      mediumSelect.appendChild(placeholder);

      return;
    }

    mediumSelect.disabled = false;

    utmConfig[selectedSource].forEach(medium => {
      const option = document.createElement("option");
      option.value = medium;
      option.textContent = medium;
      mediumSelect.appendChild(option);
    });
  }

  sourceSelect.addEventListener("change", updateMedium);

  // =========================
  // UTM generieren
  // =========================
  window.generateUTM = function () {
    const base = document.getElementById("base").value;
    const campaign = document.getElementById("campaign").value;
    const source = sourceSelect.value;
    const medium = mediumSelect.value;

    if (!base || !campaign || !source || !medium) {
      alert("Bitte alle Felder ausfüllen");
      return;
    }

    const valid = /^[a-z0-9_]+$/;
    if (!valid.test(campaign)) {
      alert("Campaign nur lowercase + underscore erlaubt");
      return;
    }

    const url =
      base +
      "?utm_source=" + encodeURIComponent(source) +
      "&utm_medium=" + encodeURIComponent(medium) +
      "&utm_campaign=" + encodeURIComponent(campaign);

    document.getElementById("result").value = url;
  };

  // =========================
  // Copy to Clipboard
  // =========================
  window.copyUTM = function () {
    const result = document.getElementById("result");
    result.select();
    document.execCommand("copy");
    alert("URL kopiert ✅");
  };

});
