
document.addEventListener("DOMContentLoaded", () => {

  // ✅ Erlaubte UTM-Kombinationen
  const utmConfig = {
    google: ["cpc", "organic"],
    bing: ["organic"],
    instagram: ["cpc", "organic"],
    facebook: ["cpc", "organic"],   // ✅ Syntaxfehler gefixt
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
    console.error("Source or Medium select not found in DOM");
    return;
  }

  // ✅ Source-Dropdown befüllen
  Object.keys(utmConfig).forEach(source => {
    const option = document.createElement("option");
    option.value = source;
    option.textContent = source;
    sourceSelect.appendChild(option);
  });

  // ✅ Medium abhängig von Source aktualisieren
  function updateMedium() {
    mediumSelect.innerHTML = "";

    const selectedSource = sourceSelect.value;
    if (!utmConfig[selectedSource]) return;

    utmConfig[selectedSource].forEach(medium => {
      const option = document.createElement("option");
      option.value = medium;
      option.textContent = medium;
      mediumSelect.appendChild(option);
    });
  }

  sourceSelect.addEventListener("change", updateMedium);

  // ✅ Initialer Zustand
  updateMedium();

  // ✅ UTM URL generieren
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
      alert("Campaign nur lowercase + underscores erlaubt");
      return;
    }

    const url =
      base +
      "?utm_source=" + encodeURIComponent(source) +
      "&utm_medium=" + encodeURIComponent(medium) +
      "&utm_campaign=" + encodeURIComponent(campaign);

    document.getElementById("result").value = url;
  };

  // ✅ URL kopieren
  window.copyUTM = function () {
    const result = document.getElementById("result");
    result.select();
    document.execCommand("copy");
    alert("URL copied ✅");
  };

});

