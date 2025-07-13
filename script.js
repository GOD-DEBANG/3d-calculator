const display = document.getElementById('display');
const historyBox = document.getElementById('history');
let isDark = true;
let memory = 0;

function appendNumber(num) {
  if (display.innerText === '0' || display.innerText === 'Error') {
    display.innerText = num;
  } else {
    display.innerText += num;
  }
}

function appendOperator(op) {
  const lastChar = display.innerText.slice(-1);
  if ('+-*/'.includes(lastChar)) {
    display.innerText = display.innerText.slice(0, -1) + op;
  } else {
    display.innerText += op;
  }
}

function appendFunction(func) {
  if (display.innerText === '0' || display.innerText === 'Error') {
    display.innerText = func;
  } else {
    display.innerText += func;
  }
}

function clearDisplay() {
  display.innerText = '0';
}

function deleteLast() {
  if (display.innerText.length === 1 || display.innerText === 'Error') {
    display.innerText = '0';
  } else {
    display.innerText = display.innerText.slice(0, -1);
  }
}

function calculate() {
  try {
    const result = eval(display.innerText);
    historyBox.innerHTML += `<div>${display.innerText} = ${result}</div>`;
    display.innerText = result;
  } catch {
    display.innerText = 'Error';
  }
}

function copyResult() {
  navigator.clipboard.writeText(display.innerText)
    .then(() => alert('Copied!'))
    .catch(() => alert('Failed to copy'));
}

function toggleTheme() {
  document.body.style.background = isDark
    ? "linear-gradient(to right, #00c6ff, #0072ff)"
    : "radial-gradient(circle at 20% 20%, #1b2735, #090a0f)";
  isDark = !isDark;
}

function memoryStore() {
  memory = parseFloat(display.innerText) || 0;
}

function memoryRecall() {
  display.innerText = memory.toString();
}

function memoryClear() {
  memory = 0;
}

function startVoiceInput() {
  if (!('webkitSpeechRecognition' in window)) {
    alert('Speech recognition not supported in this browser.');
    return;
  }

  const recognition = new webkitSpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = function (event) {
    let transcript = event.results[0][0].transcript.toLowerCase();

    transcript = transcript
      .replace(/what is|calculate|the result of/g, '')
      .replace(/plus/g, '+')
      .replace(/minus/g, '-')
      .replace(/times|multiplied by|into/g, '*')
      .replace(/divided by|by/g, '/')
      .replace(/equals|equal to/g, '');

    transcript = transcript.replace(/[^0-9+\-*/().]/g, '');

    if (transcript.trim() === '') {
      display.innerText = 'Error';
    } else {
      display.innerText = transcript;
      calculate();
    }
  };

  recognition.start();
}

document.addEventListener('keydown', (e) => {
  const key = e.key;
  if (!isNaN(key) || ['+', '-', '*', '/', '.'].includes(key)) {
    appendNumber(key);
  } else if (key === 'Enter') {
    e.preventDefault();
    calculate();
  } else if (key === 'Backspace') {
    deleteLast();
  } else if (key.toLowerCase() === 'c') {
    clearDisplay();
  }
});
