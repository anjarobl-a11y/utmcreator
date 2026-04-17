
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

  /* ========= Source: leer starten ========= */

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

  /* ========= Medium: disabled starten ========= */

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

  /* ========= UTM generieren + Historie speichern ========= */

  window.generateUTM = function () {
    const base = document.getElementById("base").value;
    const campaign = document.getElementById("campaign").value;
    const source = sourceSelect.value;
    const medium = mediumSelect.value;

    if (!base || !campaign || !source || !medium) {
      alert("Bitte alle Felder ausfüllen");
      return;
    }

    const url =
      `${base}?utm_source=${source}&utm_medium=${medium}&utm_campaign=${campaign}`;

    document.getElementById("result").value = url;

    const history = JSON.parse(localStorage.getItem("utmHistory")) || [];
    history.unshift(url);
    localStorage.setItem("utmHistory", JSON.stringify(history));
  };

  /* ========= Copy ========= */

  window.copyUTM = function () {
    const result = document.getElementById("result");
    result.select();
    document.execCommand("copy");
    alert("URL kopiert ✅");
  };

});

