
document.addEventListener("DOMContentLoaded", () => {

  const utmConfig = {
    google: ["cpc"],
    bing: ["cpc"],

    facebook: ["paid_social"],
    instagram: ["paid_social"],
    tiktok: ["paid_social"],

    newsletter: ["email"],

    corporate_benefits: ["partnerprogramme"],
    sovendus: ["partnerprogramme"],
    awin: ["affiliate"]
  };

  const sourceSelect = document.getElementById("source");
  const mediumSelect = document.getElementById("medium");
  const campaignInput = document.getElementById("campaign");
  const errorEl = document.getElementById("campaign-error");

  /* Source */
  const sourcePlaceholder = document.createElement("option");
  sourcePlaceholder.textContent = "Bitte Source auswählen";
  sourcePlaceholder.disabled = true;
  sourcePlaceholder.selected = true;
  sourceSelect.appendChild(sourcePlaceholder);

  Object.keys(utmConfig).forEach(source => {
    const opt = document.createElement("option");
    opt.value = source;
    opt.textContent = source;
    sourceSelect.appendChild(opt);
  });

  /* Medium */
  mediumSelect.disabled = true;

  sourceSelect.addEventListener("change", () => {
    mediumSelect.innerHTML = "";
    utmConfig[sourceSelect.value].forEach(m => {
      const opt = document.createElement("option");
      opt.value = m;
      opt.textContent = m;
      mediumSelect.appendChild(opt);
    });
    mediumSelect.disabled = false;
  });

  /* Optionale Felder */
  document.querySelector(".optional-toggle").addEventListener("click", e => {
    const fields = document.querySelector(".optional-fields");
    fields.toggleAttribute("hidden");
    e.target.textContent = fields.hasAttribute("hidden")
      ? "Optionale Parameter anzeigen"
      : "Optionale Parameter ausblenden";
  });

  /* Campaign Validierung */
  function validateCampaign(campaign, source, medium) {
    errorEl.textContent = "";
    campaignInput.classList.remove("invalid");

    if (campaign.length > 50) {
      errorEl.textContent = "Campaign darf maximal 50 Zeichen lang sein.";
      campaignInput.classList.add("invalid");
      return false;
    }

    const pattern = /^[a-z0-9_]+$/;
    if (!pattern.test(campaign)) {
      errorEl.textContent =
        "Nur Kleinbuchstaben, Zahlen und Unterstriche erlaubt (keine Leerzeichen).";
      campaignInput.classList.add("invalid");
      return false;
    }

    if (campaign.includes(source) || campaign.includes(medium)) {
      errorEl.textContent =
        "Campaign darf Source oder Medium nicht enthalten.";
      campaignInput.classList.add("invalid");
      return false;
    }

    return true;
  }

  /* UTM generieren */
  window.generateUTM = function () {
    const base = document.getElementById("base").value.trim();
    const source = sourceSelect.value;
    const medium = mediumSelect.value;
    const campaign = campaignInput.value.trim().toLowerCase();
    const term = document.getElementById("term").value.trim();
    const content = document.getElementById("content").value.trim();

    if (!base || !source || !medium || !campaign) return;
    if (!validateCampaign(campaign, source, medium)) return;

    let url =
      `${base}?utm_source=${source}` +
      `&utm_medium=${medium}` +
      `&utm_campaign=${campaign}`;

    if (term) url += `&utm_term=${encodeURIComponent(term)}`;
    if (content) url += `&utm_content=${encodeURIComponent(content)}`;

    document.getElementById("result").value = url;
  };

  window.copyUTM = function () {
    const result = document.getElementById("result");
    result.select();
    document.execCommand("copy");
  };

});
