document.addEventListener("DOMContentLoaded", () => {
  const utmConfig = {
    google_ads: ["⛔ no_manual_tracking"],
    microsoft_ads: ["⛔ no_manual_tracking"],
    awin: ["⛔ no_manual_tracking"],
    newsletter: ["⛔ no_manual_tracking"],
    amazon: ["sp", "sb", "sd", "dsp"],
    instagram: ["paid_social", "organic_social", "creator"],
    facebook: ["paid_social", "organic_social", "creator"],
    tiktok: ["paid_social", "organic_social", "creator"],
    youtube: ["organic_video", "creator"],
    intranet: ["internal"],
    offline: ["qr"],
    partner_brandname: ["collab"],
    cb: ["affiliate"],
    sovendus: ["affiliate"]
  };

  const NO_MANUAL_TRACKING_VALUE = "⛔ no_manual_tracking";
  const PARTNER_SOURCE_VALUE = "partner_brandname";
  const DISCOURAGED_CAMPAIGN_TOKENS = ["mail", "nl"];
  const FIXED_BASE_PREFIX = "https://www.stabilo.com/";
  const EMPTY_BASE_ERROR_MESSAGE = "Please add the landingpage path after https://www.stabilo.com/.";

  const sourceSelect = document.getElementById("source");
  const mediumSelect = document.getElementById("medium");
  const baseInput = document.getElementById("base");
  const campaignInput = document.getElementById("campaign");
  const contentInput = document.getElementById("content");
  const termInput = document.getElementById("term");
  const resultField = document.getElementById("result");
  const optionalWrapper = document.querySelector(".optional-wrapper");
  const createButton = document.querySelector('button[onclick="generateUTM()"]');
  const copyButton = document.querySelector('button[onclick="copyUTM()"]');

  const campaignLabel = campaignInput
    ? document.querySelector(`label[for="${campaignInput.id}"]`)
    : null;

  let baseError = document.getElementById("baseError");
  if (!baseError && baseInput) {
    baseError = document.createElement("div");
    baseError.id = "baseError";
    baseError.className = "field-error";
    baseError.setAttribute("aria-live", "polite");
    baseError.hidden = true;
    baseInput.insertAdjacentElement("afterend", baseError);
  }

  let campaignError = document.getElementById("campaignError");
  if (!campaignError && campaignInput) {
    campaignError = document.createElement("div");
    campaignError.id = "campaignError";
    campaignError.className = "field-error";
    campaignError.setAttribute("aria-live", "polite");
    campaignError.hidden = true;
    campaignInput.insertAdjacentElement("afterend", campaignError);
  }

  let campaignGuidance = document.getElementById("campaignGuidance");
  if (!campaignGuidance && campaignError) {
    campaignGuidance = document.createElement("p");
    campaignGuidance.id = "campaignGuidance";
    campaignGuidance.className = "field-guidance";
    campaignGuidance.textContent =
      "Rules: lowercase only, no spaces, use only a-z, 0-9, underscore (_) or hyphen (-).";
    campaignError.insertAdjacentElement("afterend", campaignGuidance);
  }

  if (baseInput) {
    baseInput.setAttribute("aria-describedby", "baseError");
  }

  if (campaignInput) {
    campaignInput.setAttribute("aria-describedby", "campaignError campaignGuidance");
  }

  const noManualTrackingNotice = document.createElement("div");
  noManualTrackingNotice.innerHTML =
    "⚡ this platform offers you a tracking template option - no manual UTM setup required";
  noManualTrackingNotice.setAttribute("role", "status");
  noManualTrackingNotice.setAttribute("aria-live", "polite");
  noManualTrackingNotice.style.display = "none";
  noManualTrackingNotice.style.marginTop = "16px";
  noManualTrackingNotice.style.fontSize = "13px";
  noManualTrackingNotice.style.fontWeight = "600";
  noManualTrackingNotice.style.lineHeight = "1.5";
  noManualTrackingNotice.style.color = "#555555";

  const copyStatusNotice = document.createElement("div");
  copyStatusNotice.setAttribute("role", "status");
  copyStatusNotice.setAttribute("aria-live", "polite");
  copyStatusNotice.hidden = true;
  copyStatusNotice.style.marginTop = "8px";
  copyStatusNotice.style.fontSize = "13px";
  copyStatusNotice.style.fontWeight = "600";
  copyStatusNotice.style.lineHeight = "1.5";
  copyStatusNotice.style.color = "#2e7d32";

  if (createButton) {
    createButton.parentNode.insertBefore(noManualTrackingNotice, createButton);
  }

  if (copyButton) {
    copyButton.insertAdjacentElement("afterend", copyStatusNotice);
  }

  const partnerSourceInput = document.createElement("input");
  partnerSourceInput.id = "partnerSource";
  partnerSourceInput.type = "text";
  partnerSourceInput.placeholder = "Please enter partner brand name";
  partnerSourceInput.hidden = true;
  partnerSourceInput.autocomplete = "off";
  partnerSourceInput.setAttribute("aria-label", "Partner brand name");

  const changeSourceBackLink = document.createElement("a");
  changeSourceBackLink.href = "#";
  changeSourceBackLink.textContent = "Choose another source";
  changeSourceBackLink.hidden = true;
  changeSourceBackLink.style.display = "none";
  changeSourceBackLink.style.marginTop = "8px";
  changeSourceBackLink.style.fontSize = "13px";
  changeSourceBackLink.style.fontWeight = "400";
  changeSourceBackLink.style.color = "#0000ee";
  changeSourceBackLink.style.textDecoration = "underline";
  changeSourceBackLink.style.cursor = "pointer";

  if (sourceSelect) {
    sourceSelect.insertAdjacentElement("afterend", partnerSourceInput);
    partnerSourceInput.insertAdjacentElement("afterend", changeSourceBackLink);
  }

  changeSourceBackLink.addEventListener("mouseenter", () => {
    if (changeSourceBackLink.style.display !== "none") {
      changeSourceBackLink.style.textDecoration = "underline";
    }
  });

  changeSourceBackLink.addEventListener("mouseleave", () => {
    changeSourceBackLink.style.textDecoration = "underline";
  });

  function setChangeSourceLinkVisibility(shouldShow) {
    changeSourceBackLink.hidden = !shouldShow;
    changeSourceBackLink.style.display = shouldShow ? "block" : "none";
    if (!shouldShow) {
      changeSourceBackLink.style.textDecoration = "underline";
    }
  }

  function resetSourceSelection() {
    disablePartnerSourceMode();
    sourceSelect.selectedIndex = 0;
    resetMediumToPlaceholder();
    toggleNoManualTrackingMode();
    validateCampaignField();
    sourceSelect.focus();
  }

  changeSourceBackLink.addEventListener("click", (event) => {
    event.preventDefault();
    resetSourceSelection();
  });

  function showCopyStatus(message, isError = false) {
    if (!copyStatusNotice) {
      return;
    }

    copyStatusNotice.textContent = message;
    copyStatusNotice.style.color = isError ? "#e4002b" : "#2e7d32";
    copyStatusNotice.hidden = false;

    window.clearTimeout(showCopyStatus.timeoutId);
    showCopyStatus.timeoutId = window.setTimeout(() => {
      copyStatusNotice.hidden = true;
      copyStatusNotice.textContent = "";
    }, 3000);
  }

  function resetMediumToPlaceholder() {
    mediumSelect.innerHTML = "";
    mediumSelect.disabled = true;

    const mediumPlaceholder = document.createElement("option");
    mediumPlaceholder.value = "";
    mediumPlaceholder.textContent = "Please select Medium";
    mediumPlaceholder.disabled = true;
    mediumPlaceholder.selected = true;
    mediumSelect.appendChild(mediumPlaceholder);
  }

  function setMediumOptions(sourceValue) {
    mediumSelect.innerHTML = "";

    const mediumPlaceholder = document.createElement("option");
    mediumPlaceholder.value = "";
    mediumPlaceholder.textContent = "Please select Medium";
    mediumPlaceholder.disabled = true;
    mediumPlaceholder.selected = true;
    mediumSelect.appendChild(mediumPlaceholder);

    (utmConfig[sourceValue] || []).forEach((mediumValue) => {
      const option = document.createElement("option");
      option.value = mediumValue;
      option.textContent = mediumValue;
      mediumSelect.appendChild(option);
    });

    mediumSelect.disabled = false;
  }

  function isPartnerSourceMode() {
    return !partnerSourceInput.hidden;
  }

  function getEffectiveSourceValue() {
    return isPartnerSourceMode()
      ? partnerSourceInput.value.trim()
      : sourceSelect.value;
  }

  function enablePartnerSourceMode() {
    partnerSourceInput.hidden = false;
    setChangeSourceLinkVisibility(false);
    partnerSourceInput.focus();
  }

  function disablePartnerSourceMode() {
    partnerSourceInput.value = "";
    partnerSourceInput.hidden = true;
  }

  function normalizeTokens(value) {
    return String(value || "")
      .toLowerCase()
      .split(/[_-]+/)
      .filter(Boolean);
  }

  function normalizeTrackingInputValue(inputElement) {
    const originalValue = inputElement.value;
    const selectionStart = inputElement.selectionStart ?? originalValue.length;
    const valueBeforeCursor = originalValue.slice(0, selectionStart);

    const normalizedValue = originalValue
      .toLowerCase()
      .replace(/\s+/g, "_");
    const normalizedValueBeforeCursor = valueBeforeCursor
      .toLowerCase()
      .replace(/\s+/g, "_");

    if (originalValue !== normalizedValue) {
      inputElement.value = normalizedValue;
      const newCursorPosition = normalizedValueBeforeCursor.length;
      inputElement.setSelectionRange(newCursorPosition, newCursorPosition);
    }
  }

  function sanitizeStabiloPath(value) {
    let path = String(value || "").trim();

    if (!path) {
      return "";
    }

    path = path.replace(/^https?:\/\/([^/]+)\/?/i, "");
    path = path.replace(/^www\.stabilo\.com\/?/i, "");
    path = path.replace(/^stabilo\.com\/?/i, "");
    path = path.replace(/^\/+/, "");
    path = path.replace(/\s+/g, "");

    return path;
  }

  function renderBaseState() {
    const hasManualPath = sanitizeStabiloPath(baseInput.value).length > 0;

    if (hasManualPath) {
      baseInput.style.color = "#111111";
      baseInput.style.borderColor = "";
      baseInput.classList.remove("input-error");
      baseInput.removeAttribute("aria-invalid");
      if (baseError) {
        baseError.hidden = true;
        baseError.textContent = "";
      }
      return true;
    }

    baseInput.style.color = "#888888";
    return false;
  }

  function validateBaseField() {
    const hasManualPath = sanitizeStabiloPath(baseInput.value).length > 0;

    if (hasManualPath) {
      renderBaseState();
      return true;
    }

    if (baseError) {
      baseError.textContent = EMPTY_BASE_ERROR_MESSAGE;
      baseError.hidden = false;
    }

    baseInput.classList.add("input-error");
    baseInput.setAttribute("aria-invalid", "true");
    baseInput.style.borderColor = "#e4002b";
    baseInput.style.color = "#888888";
    return false;
  }

  function enforceFixedBaseInput() {
    if (!baseInput) {
      return;
    }

    const selectionStart = baseInput.selectionStart ?? FIXED_BASE_PREFIX.length;
    const safeSelectionStart = Math.max(selectionStart, FIXED_BASE_PREFIX.length);
    const currentValue = baseInput.value || "";
    const editablePart = currentValue.startsWith(FIXED_BASE_PREFIX)
      ? currentValue.slice(FIXED_BASE_PREFIX.length)
      : currentValue;
    const sanitizedPath = sanitizeStabiloPath(editablePart);
    const normalizedValue = `${FIXED_BASE_PREFIX}${sanitizedPath}`;

    if (baseInput.value !== normalizedValue) {
      baseInput.value = normalizedValue;
      const cursorTarget = Math.min(
        normalizedValue.length,
        Math.max(FIXED_BASE_PREFIX.length, safeSelectionStart)
      );
      baseInput.setSelectionRange(cursorTarget, cursorTarget);
    }

    renderBaseState();
  }

  function getNormalizedBaseUrl() {
    const sanitizedPath = sanitizeStabiloPath(baseInput.value);
    return `${FIXED_BASE_PREFIX}${sanitizedPath}`;
  }

  function buildTrackingUrl(baseUrl, params) {
    const separator = baseUrl.includes("?")
      ? (baseUrl.endsWith("?") || baseUrl.endsWith("&") ? "" : "&")
      : "?";

    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        searchParams.set(key, value);
      }
    });

    return `${baseUrl}${separator}${searchParams.toString()}`;
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
      errors.push(
        "Do not use other special characters. Only a-z, 0-9, underscore (_) and hyphen (-) are allowed."
      );
    }

    const campaignTokens = normalizeTokens(campaignValue);
    const duplicateFields = [
      { label: "source", value: getEffectiveSourceValue() },
      { label: "medium", value: mediumSelect.value },
      { label: "content", value: contentInput.value },
      { label: "term", value: termInput.value }
    ];

    duplicateFields.forEach((field) => {
      const comparisonTokens = normalizeTokens(field.value);
      const hasDuplicateToken = comparisonTokens.some((token) => campaignTokens.includes(token));
      if (hasDuplicateToken) {
        errors.push(
          `Avoid duplicated information across your UTM parameters. The campaign repeats information from utm_${field.label}.`
        );
      }
    });

    const discouragedTokensFound = DISCOURAGED_CAMPAIGN_TOKENS.filter((token) =>
      campaignTokens.includes(token)
    );

    if (discouragedTokensFound.length > 0) {
      errors.push(
        "Use consistent vocabulary across all campaigns. For email traffic, use email instead of mail or nl. If the naming convention is missing in the template, ask to extend the template instead of inventing one yourself."
      );
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
      campaignInput.style.borderColor = "";
      return;
    }

    campaignError.innerHTML = errors.map((error) => `<div>${error}</div>`).join("");
    campaignError.hidden = false;
    campaignInput.classList.add("input-error");
    campaignInput.setAttribute("aria-invalid", "true");
    campaignInput.style.borderColor = "#e4002b";
  }

  function isNoManualTrackingSelected() {
    return mediumSelect.value === NO_MANUAL_TRACKING_VALUE;
  }

  function toggleNoManualTrackingMode() {
    const isBlocked = isNoManualTrackingSelected();

    [campaignLabel, campaignInput, campaignError, campaignGuidance].forEach((element) => {
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

    if (copyStatusNotice) {
      copyStatusNotice.hidden = isBlocked;
      copyStatusNotice.textContent = "";
    }

    setChangeSourceLinkVisibility(isBlocked);
    noManualTrackingNotice.style.display = isBlocked ? "block" : "none";

    if (isBlocked) {
      campaignInput.classList.remove("input-error");
      campaignInput.removeAttribute("aria-invalid");
      campaignInput.style.borderColor = "";

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

  async function copyTextToClipboard(text) {
    if (!text) {
      return false;
    }

    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (error) {
        // fallback below
      }
    }

    resultField.focus();
    resultField.select();
    resultField.setSelectionRange(0, resultField.value.length);

    try {
      return document.execCommand("copy");
    } catch (error) {
      return false;
    }
  }

  function openUrlPreview(url) {
    if (!url) {
      return;
    }

    window.open(url, "_blank", "noopener,noreferrer");
  }

  const sourcePlaceholder = document.createElement("option");
  sourcePlaceholder.value = "";
  sourcePlaceholder.textContent = "Please select Source";
  sourcePlaceholder.disabled = true;
  sourcePlaceholder.selected = true;
  sourceSelect.appendChild(sourcePlaceholder);

  Object.keys(utmConfig).forEach((source) => {
    const option = document.createElement("option");
    option.value = source;
    option.textContent = source;
    sourceSelect.appendChild(option);
  });

  resetMediumToPlaceholder();
  enforceFixedBaseInput();
  setChangeSourceLinkVisibility(false);

  sourceSelect.addEventListener("change", () => {
    setMediumOptions(sourceSelect.value);

    if (sourceSelect.value === PARTNER_SOURCE_VALUE) {
      enablePartnerSourceMode();
    } else {
      disablePartnerSourceMode();
    }

    toggleNoManualTrackingMode();
    validateCampaignField();
  });

  mediumSelect.addEventListener("change", () => {
    toggleNoManualTrackingMode();
    validateCampaignField();
  });

  baseInput.addEventListener("focus", () => {
    enforceFixedBaseInput();
    const caretPosition = Math.max(baseInput.selectionStart ?? 0, FIXED_BASE_PREFIX.length);
    baseInput.setSelectionRange(caretPosition, caretPosition);
  });

  baseInput.addEventListener("click", () => {
    if ((baseInput.selectionStart ?? 0) < FIXED_BASE_PREFIX.length) {
      baseInput.setSelectionRange(FIXED_BASE_PREFIX.length, FIXED_BASE_PREFIX.length);
    }
  });

  baseInput.addEventListener("keydown", (event) => {
    const selectionStart = baseInput.selectionStart ?? 0;
    const selectionEnd = baseInput.selectionEnd ?? 0;
    const hasSelection = selectionEnd > selectionStart;

    const isProtectedKey =
      (event.key === "Backspace" && selectionStart <= FIXED_BASE_PREFIX.length && !hasSelection) ||
      (event.key === "Delete" && selectionStart < FIXED_BASE_PREFIX.length) ||
      (event.key === "ArrowLeft" && selectionStart <= FIXED_BASE_PREFIX.length && selectionEnd <= FIXED_BASE_PREFIX.length) ||
      (event.key === "Home");

    if (isProtectedKey) {
      event.preventDefault();
      baseInput.setSelectionRange(FIXED_BASE_PREFIX.length, FIXED_BASE_PREFIX.length);
    }
  });

  baseInput.addEventListener("paste", (event) => {
    event.preventDefault();
    const pastedText = (event.clipboardData || window.clipboardData).getData("text");
    const sanitizedPath = sanitizeStabiloPath(pastedText);
    baseInput.value = `${FIXED_BASE_PREFIX}${sanitizedPath}`;
    baseInput.setSelectionRange(baseInput.value.length, baseInput.value.length);
    renderBaseState();
  });

  baseInput.addEventListener("input", () => {
    enforceFixedBaseInput();
  });

  campaignInput.addEventListener("input", () => {
    normalizeTrackingInputValue(campaignInput);
    validateCampaignField();
  });

  partnerSourceInput.addEventListener("input", () => {
    normalizeTrackingInputValue(partnerSourceInput);
    validateCampaignField();
  });

  contentInput.addEventListener("input", validateCampaignField);
  termInput.addEventListener("input", validateCampaignField);

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

  window.generateUTM = async function () {
    if (isNoManualTrackingSelected()) {
      toggleNoManualTrackingMode();
      return;
    }

    const effectiveSourceValue = getEffectiveSourceValue();
    const normalizedBaseUrl = getNormalizedBaseUrl();

    if (!validateBaseField()) {
      return;
    }

    if (!effectiveSourceValue || !mediumSelect.value || !campaignInput.value) {
      alert("Please fill in all required fields.");
      return;
    }

    if (!validateCampaignField()) {
      return;
    }

    baseInput.value = normalizedBaseUrl;
    renderBaseState();

    const url = buildTrackingUrl(normalizedBaseUrl, {
      utm_source: effectiveSourceValue,
      utm_medium: mediumSelect.value,
      utm_campaign: campaignInput.value,
      utm_content: contentInput.value,
      utm_term: termInput.value
    });

    resultField.value = url;

    const history = JSON.parse(localStorage.getItem("utmHistory")) || [];
    history.unshift({ url, createdAt: new Date().toISOString() });
    localStorage.setItem("utmHistory", JSON.stringify(history));

    const wasCopied = await copyTextToClipboard(url);
    if (wasCopied) {
      showCopyStatus("URL copied");
    } else {
      showCopyStatus("URL generated, but copy failed", true);
    }

    openUrlPreview(url);
  };

  window.copyUTM = async function () {
    const wasCopied = await copyTextToClipboard(resultField.value);
    if (wasCopied) {
      showCopyStatus("URL copied");
    } else if (resultField.value) {
      showCopyStatus("Copy failed", true);
    }
  };

  toggleNoManualTrackingMode();
  renderBaseState();
});


