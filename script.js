
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

  // Sicherheitscheck
  if (!sourceSelect || !mediumSelect) {
    console.error("Source or Medium select not found.");
    return;
  }

  // =========================
  // Initial State
  // =========================

  // Medium ist zunächst deaktiviert
  mediumSelect.disabled = true;

  // Source Dropdown befüllen
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

    if (!base || !campaign) {
      alert("Please enter landingpage URL and campaign");
      return;
    }

    const valid = /^[a-z0-9_]+$/;
    if (!valid.test(campaign)) {
      alert("Campaign only lowercase letters, numbers and underscores");
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
    alert("URL copied ✅");
  };

});
