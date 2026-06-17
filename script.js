document.addEventListener("DOMContentLoaded", () => {
  const utmConfig = {
    google_ads: ["⛔ no_manual_tracking"],
    microsoft_ads: ["⛔ no_manual_tracking"],
    awin: ["⛔ no_manual_tracking"],
    newsletter: ["⛔ no_manual_tracking"],
    amazon: ["sp", "sb", "sd", "dsp"],
    instagram: ["paid social", "organic social", "creator"],
    facebook: ["paid social", "organic social", "creator"],
    tiktok: ["paid social", "organic social", "creator"],
    youtube: ["organic video", "creator"],
    intranet: ["internal"],
    offline: ["qr"],
    partner_brandname: ["collab"],
    cb: ["affiliate"],
    sovendus: ["affiliate"]
  };

  const NO_MANUAL_TRACKING_VALUE = "⛔ no_manual_tracking";
  const DISCOURAGED_CAMPAIGN_TOKENS = ["mail", "nl"];

  const sourceSelect = document.getElementById("source");
  const mediumSelect = document.getElementById("medium");
  const baseInput = document.getElementById("base");
  const campaignInput = document.getElementById("campaign");
  const contentInput = document.getElementById("content");
  const termInput = document.getElementById("term");
  const resultField = document.getElementById("result");
  const campaignError = document.getElementById("campaignError");
  const campaignGuidance = document.getElementById("campaignGuidance");
  const optionalWrapper = document.querySelector(".optional-wrapper");
  const createButton = document.querySelector('button[onclick="generateUTM()"]');
  const copyButton = document.querySelector('button[onclick="copyUTM()"]');

  const campaignLabel = campaignInput ? document.querySelector(`label[for="${campaignInput.id}"]`) : null;

  const noManualTrackingNotice = document.createElement("div");
  noManualTrackingNotice.innerHTML = "⚡ this platform offers you a tracking template option - no manual UTM setup required";
  noManualTrackingNotice.setAttribute("role", "status");
  noManualTrackingNotice.setAttribute("aria-live", "polite");
  noManualTrackingNotice.style.display = "none";
  noManualTrackingNotice.style.marginTop = "16px";
  noManualTrackingNotice.style.fontSize = "13px";
  noManualTrackingNotice.style.fontWeight = "600";
  noManualTrackingNotice.style.lineHeight = "1.5";
  noManualTrackingNotice.style.color = "#555555";

  if (createButton) {
    createButton.parentNode.insertBefore(noManualTrackingNotice, createButton);
  }

  function normalizeTokens(value) {
    return String(value || "")
      .toLowerCase()
      .split(/[_-]+/)
      .filter(Boolean);
  }

  function getCampaignErrors() {
    const errors = [];
    const campaignValue = campaignInput.value.trim();

    if (!campaignValue) {
      return errors;
    }

    if (/[A-Z]/.test(campaignValue)) {
      errors.push("Use lowercase letters only. UTM parameters are case sensitive.");
    }

    if (/\s/.test(campaignValue)) {
      errors.push("Do not use spaces. Please use underscore (_) or hyphen (-) instead.");
    }

    if (!/^[a-z0-9_-]+$/.test(campaignValue)) {
      errors.push("Do not use other special characters. Only a-z, 0-9, underscore (_) and hyphen (-) are allowed.");
    }

    const campaignTokens = normalizeTokens(campaignValue);
    const duplicateFields = [
      { label: "source", value: sourceSelect.value },
      { label: "medium", value: mediumSelect.value },
      { label: "content", value: contentInput.value },
      { label: "term", value: termInput.value }
    ];

    duplicateFields.forEach(field => {
      const comparisonTokens = normalizeTokens(field.value);
      const hasDuplicateToken = comparisonTokens.some(token => campaignTokens.includes(token));

      if (hasDuplicateToken) {
        errors.push(`Avoid duplicated information across your UTM parameters. The campaign repeats information from utm_${field.label}.`);
      }
    });

    const discouragedTokensFound = DISCOURAGED_CAMPAIGN_TOKENS.filter(token => campaignTokens.includes(token));
    if (discouragedTokensFound.length > 0) {
      errors.push("Use consistent vocabulary across all campaigns. For email traffic, use email instead of mail or nl. If the naming convention is missing in the template, ask to extend the template instead of inventing one yourself.");
    }

    return [...new Set(errors)];
  }

  function renderCampaignErrors(errors) {
    if (!campaignError) {
      return;
    }

    if (errors.length === 0) {
      campaignError.hidden = true;
      campaignError.innerHTML = "";
      campaignInput.classList.remove("input-error");
      campaignInput.removeAttribute("aria-invalid");
      return;
    }

    campaignError.innerHTML = errors.map(error => `<div>${error}</div>`).join("");
    campaignError.hidden = false;
    campaignInput.classList.add("input-error");
    campaignInput.setAttribute("aria-invalid", "true");
  }

  function isNoManualTrackingSelected() {
    return mediumSelect.value === NO_MANUAL_TRACKING_VALUE;
  }

  function toggleNoManualTrackingMode() {
    const isBlocked = isNoManualTrackingSelected();

    [campaignLabel, campaignInput, campaignError, campaignGuidance].forEach(element => {
      if (!element) return;
      element.hidden = isBlocked;
    });

    if (optionalWrapper) {
      optionalWrapper.hidden = isBlocked;
    }

    if (createButton) {
      createButton.hidden = isBlocked;
      createButton.disabled = isBlocked;
    }

    if (resultField) {
      resultField.hidden = isBlocked;
    }

    if (copyButton) {
      copyButton.hidden = isBlocked;
      copyButton.disabled = isBlocked;
    }

    noManualTrackingNotice.style.display = isBlocked ? "block" : "none";

    if (isBlocked) {
      campaignInput.classList.remove("input-error");
      campaignInput.removeAttribute("aria-invalid");
      if (campaignError) {
        campaignError.hidden = true;
        campaignError.innerHTML = "";
      }
      campaignInput.value = "";
      contentInput.value = "";
      termInput.value = "";
      resultField.value = "";
    }
  }

  function validateCampaignField() {
    if (isNoManualTrackingSelected()) {
      renderCampaignErrors([]);
      return true;
    }

    const errors = getCampaignErrors();
    renderCampaignErrors(errors);
    return errors.length === 0;
  }

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
    toggleNoManualTrackingMode();
    validateCampaignField();
  });

  mediumSelect.addEventListener("change", () => {
    toggleNoManualTrackingMode();
    validateCampaignField();
  });

  campaignInput.addEventListener("input", validateCampaignField);
  contentInput.addEventListener("input", validateCampaignField);
  termInput.addEventListener("input", validateCampaignField);

  // Optionale Felder ein/ausklappen
  const toggleBtn = document.querySelector(".optional-toggle");
  const optionalFields = document.querySelector(".optional-fields");

  if (toggleBtn && optionalFields) {
    toggleBtn.addEventListener("click", () => {
      const isOpen = !optionalFields.hasAttribute("hidden");
      optionalFields.toggleAttribute("hidden");
      toggleBtn.textContent = isOpen
        ? "Show optional parameters"
        : "Hide optional parameters";
      toggleBtn.setAttribute("aria-expanded", String(!isOpen));
    });
  }

  // UTM generieren
  window.generateUTM = function () {
    if (isNoManualTrackingSelected()) {
      toggleNoManualTrackingMode();
      return;
    }

    if (!baseInput.value || !sourceSelect.value || !mediumSelect.value || !campaignInput.value) {
      alert("Please fill in all required fields.");
      return;
    }

    if (!validateCampaignField()) {
      return;
    }

    let url =
      `${baseInput.value}?utm_source=${sourceSelect.value}` +
      `&utm_medium=${mediumSelect.value}` +
      `&utm_campaign=${campaignInput.value}`;

    if (contentInput.value) {
      url += `&utm_content=${encodeURIComponent(contentInput.value)}`;
    }

    if (termInput.value) {
      url += `&utm_term=${encodeURIComponent(termInput.value)}`;
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

  toggleNoManualTrackingMode();
});


