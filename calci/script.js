// ---------- Grab elements ----------
const currentEl = document.getElementById("current");
const previousEl = document.getElementById("previous");
const numberButtons = document.querySelectorAll("[data-number]");
const operatorButtons = document.querySelectorAll("[data-operator]");
const equalsButton = document.querySelector('[data-action="equals"]');
const clearButton = document.querySelector('[data-action="clear"]');
const backspaceButton = document.querySelector('[data-action="backspace"]');

// ---------- State ----------
let currentValue = "0";   // what the user is typing (kept as a STRING)
let previousValue = null; // the number stored before an operator (a NUMBER)
let operator = null;      // "+", "−", "×", "÷"
let resetNext = false;    // true = next digit starts a fresh number
let isError = false;      // true while an error message is showing
const MAX_DIGITS = 12;

// ---------- Display ----------
function updateDisplay() {
  currentEl.textContent = currentValue;
  currentEl.classList.toggle("error", isError);
  previousEl.textContent =
    previousValue !== null ? `${previousValue} ${operator}` : "";
}

// ---------- Reset and error ----------
function resetCalculator() {
  currentValue = "0";
  previousValue = null;
  operator = null;
  resetNext = false;
  isError = false;
  updateDisplay();
}

function showError(message) {
  currentValue = message;
  previousValue = null;
  operator = null;
  resetNext = true;
  isError = true;
  updateDisplay();
}

// ---------- Digits and decimal ----------
function appendNumber(char) {
  if (isError) resetCalculator();

  if (resetNext) {
    currentValue = "0";
    resetNext = false;
  }

  if (char === ".") {
    if (currentValue.includes(".")) return;
    currentValue += ".";
  } else if (currentValue === "0") {
    currentValue = char;
  } else {
    const digitCount = currentValue.replace("-", "").replace(".", "").length;
    if (digitCount >= MAX_DIGITS) return;
    currentValue += char;
  }

  updateDisplay();
}

// ---------- Backspace ----------
function deleteLast() {
  if (isError || resetNext) return;

  currentValue = currentValue.slice(0, -1);
  if (currentValue === "" || currentValue === "-") {
    currentValue = "0";
  }
  updateDisplay();
}

// ---------- Math ----------
function calculate(a, b, op) {
  switch (op) {
    case "+":
      return a + b;
    case "−":
      return a - b;
    case "×":
      return a * b;
    case "÷":
      return b === 0 ? null : a / b;
    default:
      return null;
  }
}

function formatResult(num) {
  return parseFloat(num.toPrecision(12)).toString();
}

// ---------- Operators (with chaining) ----------
function chooseOperator(op) {
  if (isError) return;

  // Operator pressed twice in a row -> swap the operator
  if (previousValue !== null && resetNext) {
    operator = op;
    updateDisplay();
    return;
  }

  // "a op b" is pending -> calculate it first (chaining)
  if (previousValue !== null && !resetNext) {
    const result = calculate(previousValue, parseFloat(currentValue), operator);
    if (result === null || !isFinite(result)) {
      showError("Cannot divide by zero");
      return;
    }
    currentValue = formatResult(result);
  }

  previousValue = parseFloat(currentValue);
  operator = op;
  resetNext = true;
  updateDisplay();
}

// ---------- Equals ----------
function evaluate() {
  if (isError) return;
  if (operator === null || previousValue === null || resetNext) return;

  const a = previousValue;
  const b = parseFloat(currentValue);
  const op = operator;
  const result = calculate(a, b, op);

  if (result === null || !isFinite(result)) {
    showError("Cannot divide by zero");
    return;
  }

  currentValue = formatResult(result);
  previousValue = null;
  operator = null;
  resetNext = true;

  updateDisplay();
  previousEl.textContent = `${a} ${op} ${b} =`;
}

// ---------- Event listeners ----------
numberButtons.forEach((button) => {
  button.addEventListener("click", () => {
    appendNumber(button.dataset.number);
  });
});

operatorButtons.forEach((button) => {
  button.addEventListener("click", () => {
    chooseOperator(button.dataset.operator);
  });
});

equalsButton.addEventListener("click", evaluate);
clearButton.addEventListener("click", resetCalculator);
backspaceButton.addEventListener("click", deleteLast);

updateDisplay();