
// ✏️ HIER DEFINIERST DU ERLAUBTE UTM-KOMBINATIONEN
const utmConfig = {
  google: ["cpc", "organic"],
  meta: ["paid_social"],
  newsletter: ["email"],
  affiliate: ["affiliate"]
};

const sourceSelect = document.getElementById("source");
const mediumSelect = document.getElementById("medium");

// Source Dropdown befüllen
Object.keys(utmConfig).forEach(source => {
  const option = document.createElement("option");
  option.value = source;
  option.textContent = source;
  sourceSelect.appendChild(option);
});

// Medium abhängig von Source aktualisieren
function updateMedium() {
  mediumSelect.innerHTML = "";
  utmConfig[sourceSelect.value].forEach(medium => {
    const option = document.createElement("option");
    option.value = medium;
    option.textContent = medium;
    mediumSelect.appendChild(option);
  });
}

sourceSelect.addEventListener("change", updateMedium);
updateMedium();

// UTM URL generieren
function generateUTM() {
  const base = document.getElementById("base").value;
  const source = sourceSelect.value;
  const medium = mediumSelect.value;
  const campaign = document.getElementById("campaign").value;

  if (!base || !campaign) {
    alert("Bitte Ziel-URL und Campaign ausfüllen");
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
}

// URL kopieren
function copyUTM() {
  const result = document.getElementById("result");
  result.select();
  document.execCommand("copy");
  alert("UTM URL kopiert ✅");
}
