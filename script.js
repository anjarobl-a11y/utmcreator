
document.addEventListener("DOMContentLoaded", () => {

  const utmConfig = {
    google: ["cpc", "organic"],
    bing: ["organic"],
    instagram: ["cpc", "organic"],
    facebook: ["cpc", "organic"],
    newsletter: ["email"],
    affiliate: ["awin"]
  };

  const sourceSelect  = document.getElementById("source");
  const mediumSelect  = document.getElementById("medium");

  const baseInput     = document.getElementById("base");
  const campaignInput = document.getElementById("campaign");
  const termInput     = document.getElementById("term");
  const contentInput  = document.getElementById("content");
  const resultField   = document.getElementById("result");

  /* =========================
     Source – leer starten
  ========================= */

  const sourcePlaceholder = document.createElement("option");
  sourcePlaceholder.textContent = "Bitte Source auswählen";
  sourcePlaceholder.value = "";
  sourcePlaceholder.disabled = true;
  sourcePlaceholder.selected = true;
  sourceSelect.appendChild(sourcePlaceholder);

  Object.keys(utmConfig).forEach(source => {
    const option = document.createElement("option");
    option.value = source;
    option.textContent = source;
    sourceSelect.appendChild(option);
  });

  /* =========================
     Medium – disabled starten
  ========================= */

  mediumSelect.disabled = true;

  const mediumPlaceholder = document.createElement("option");
  mediumPlaceholder.textContent = "Bitte zuerst Source auswählen";
  mediumPlaceholder.disabled = true;
  mediumPlaceholder.selected = true;
  mediumSelect.appendChild(mediumPlaceholder);

  sourceSelect.addEventListener("change", () => {
    mediumSelect.innerHTML = "";
    mediumSelect.disabled = false;

    utmConfig[sourceSelect.value].forEach(medium => {
      const option = document.createElement("option");
      option.value = medium;
      option.textContent = medium;
      mediumSelect.appendChild(option);
    });
  });

  /* =========================
     UTM generieren
  ========================= */

  window.generateUTM = function () {

    const base     = baseInput.value.trim();
    const source   = sourceSelect.value;
    const medium   = mediumSelect.value;
    const campaign = campaignInput.value.trim();
    const term     = termInput.value.trim();
    const content  = contentInput.value.trim();

    // Pflichtfelder prüfen
    if (!base || !source || !medium || !campaign) {
      alert("Bitte Source, Medium, Campaign und Ziel‑URL ausfüllen.");
      return;
    }

    // Basis‑UTM
    let url =
      `${base}?utm_source=${encodeURIComponent(source)}` +
      `&utm_medium=${encodeURIComponent(medium)}` +
      `&utm_campaign=${encodeURIComponent(campaign)}`;

    // ✅ Optionale Parameter nur anhängen, wenn befüllt
    if (term) {
      url += `&utm_term=${encodeURIComponent(term)}`;
    }

    if (content) {
      url += `&utm_content=${encodeURIComponent(content)}`;
    }

    resultField.value = url;

    // Historie speichern
    const history = JSON.parse(localStorage.getItem("utmHistory")) || [];
    history.unshift({
      url,
      createdAt: new Date().toISOString()
    });
    localStorage.setItem("utmHistory", JSON.stringify(history));
  };

  /* =========================
     Copy
  ========================= */

  window.copyUTM = function () {
    resultField.select();
    document.execCommand("copy");
    alert("URL kopiert ✅");
  };

});


