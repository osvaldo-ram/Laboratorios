const form = document.getElementById("password-form");
const passwordInput = document.getElementById("password");
const confirmInput = document.getElementById("confirm-password");
const requirementsList = document.getElementById("requirements-list");
const helpBox = document.getElementById("password-help");
const counter = document.getElementById("char-counter");
const matchMessage = document.getElementById("match-message");
const strengthLabel = document.getElementById("strength-label");
const strengthBar = document.getElementById("strength-bar");
const strengthBarContainer = document.getElementById("strength-bar-container");
const formStatus = document.getElementById("form-status");

const togglePasswordButton = document.getElementById("toggle-password");
const toggleConfirmButton = document.getElementById("toggle-confirm");

const rules = {
  length: (value) => value.length >= 8,
  uppercase: (value) => /[A-Z]/.test(value),
  lowercase: (value) => /[a-z]/.test(value),
  number: (value) => /\d/.test(value),
  special: (value) => /[^A-Za-z0-9]/.test(value),
};

function evaluatePassword(passwordValue) {
  const results = {
    length: rules.length(passwordValue),
    uppercase: rules.uppercase(passwordValue),
    lowercase: rules.lowercase(passwordValue),
    number: rules.number(passwordValue),
    special: rules.special(passwordValue),
  };

  const score = Object.values(results).filter(Boolean).length;
  return { results, score };
}

function getStrengthData(score, lengthOk) {
  if (score <= 2) {
    return { label: "Débil", width: 30, color: "#dc2626" };
  }

  if (score === 3 || (score === 4 && !lengthOk)) {
    return { label: "Media", width: 65, color: "#ea580c" };
  }

  if (score === 4) {
    return { label: "Buena", width: 82, color: "#0891b2" };
  }

  return { label: "Fuerte", width: 100, color: "#059669" };
}

function updateChecklist(results) {
  const items = requirementsList.querySelectorAll("li");

  items.forEach((item) => {
    const key = item.dataset.rule;
    const passed = results[key];
    item.classList.toggle("pass", passed);
  });
}

function updateMatchState() {
  const passwordValue = passwordInput.value;
  const confirmValue = confirmInput.value;

  if (!confirmValue) {
    matchMessage.textContent = "";
    matchMessage.className = "match-message";
    confirmInput.classList.remove("valid", "invalid");
    return false;
  }

  const isMatch = passwordValue === confirmValue;

  if (isMatch) {
    matchMessage.textContent = "Las contraseñas coinciden.";
    matchMessage.className = "match-message ok";
    confirmInput.classList.add("valid");
    confirmInput.classList.remove("invalid");
  } else {
    matchMessage.textContent = "Las contraseñas no coinciden.";
    matchMessage.className = "match-message error";
    confirmInput.classList.add("invalid");
    confirmInput.classList.remove("valid");
  }

  return isMatch;
}

function updateUI() {
  const passwordValue = passwordInput.value;
  const { results, score } = evaluatePassword(passwordValue);
  const lengthOk = results.length;

  counter.textContent = `${passwordValue.length} / 8 caracteres mínimos`;
  updateChecklist(results);

  const strength = getStrengthData(score, lengthOk);
  strengthLabel.textContent = passwordValue ? strength.label : "Muy débil";
  strengthBar.style.width = `${passwordValue ? strength.width : 0}%`;
  strengthBar.style.backgroundColor = passwordValue ? strength.color : "#94a3b8";
  strengthBarContainer.setAttribute("aria-valuenow", String(passwordValue ? strength.width : 0));

  const allRulesPassed = Object.values(results).every(Boolean);

  passwordInput.classList.toggle("valid", allRulesPassed);
  passwordInput.classList.toggle("invalid", passwordValue.length > 0 && !allRulesPassed);

  const matchOk = updateMatchState();

  return { allRulesPassed, matchOk };
}

function toggleInputVisibility(input, button) {
  const willShow = input.type === "password";
  input.type = willShow ? "text" : "password";
  button.textContent = willShow ? "Ocultar" : "Mostrar";
}

passwordInput.addEventListener("focus", () => {
  helpBox.classList.remove("hidden");
});

passwordInput.addEventListener("blur", () => {
  if (!passwordInput.value) {
    helpBox.classList.add("hidden");
  }
});

passwordInput.addEventListener("input", () => {
  updateUI();
});

confirmInput.addEventListener("input", () => {
  updateUI();
});

// Cambios de estilo con eventos distintos de click.
passwordInput.addEventListener("keydown", () => {
  document.body.style.letterSpacing = "0.12px";
});

passwordInput.addEventListener("keyup", () => {
  document.body.style.letterSpacing = "0";
});

strengthBarContainer.addEventListener("mouseover", () => {
  strengthLabel.style.textDecoration = "underline";
});

strengthBarContainer.addEventListener("mouseout", () => {
  strengthLabel.style.textDecoration = "none";
});

togglePasswordButton.addEventListener("click", () => {
  toggleInputVisibility(passwordInput, togglePasswordButton);
});

toggleConfirmButton.addEventListener("click", () => {
  toggleInputVisibility(confirmInput, toggleConfirmButton);
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const { allRulesPassed, matchOk } = updateUI();
  const isFormValid = allRulesPassed && matchOk;

  if (isFormValid) {
    formStatus.textContent = "OK: contraseña válida y verificada. No se enviaron datos al servidor.";
    formStatus.className = "status ok";
    passwordInput.classList.add("valid");
    confirmInput.classList.add("valid");
    return;
  }

  formStatus.textContent = "Faltan requisitos o las contraseñas no coinciden. Revisa los campos marcados.";
  formStatus.className = "status error";

  if (!allRulesPassed) {
    passwordInput.classList.add("invalid");
  }

  if (!matchOk) {
    confirmInput.classList.add("invalid");
  }
});

// Estado inicial.
updateUI();
