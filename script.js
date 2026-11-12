// Saudação
const saudacao = document.getElementById("saudacao");
const hora = new Date().getHours();

let texto = "Bom dia";
if (hora >= 12 && hora < 18) texto = "Boa tarde";
if (hora >= 18) texto = "Boa noite";

saudacao.textContent = `${texto}, Carlos 🌴`;

// Data de hoje
const dataEl = document.getElementById("data-hoje");
const hoje = new Date();
const opcoes = { weekday: "long", day: "numeric", month: "long" };
dataEl.textContent = hoje.toLocaleDateString("pt-BR", opcoes);

// Checkboxes com persistência
const checkboxes = document.querySelectorAll('#lista-tarefas input[type="checkbox"]');

checkboxes.forEach((cb, index) => {
  const salvo = localStorage.getItem(`tarefa-${index}`);
  if (salvo === "true") cb.checked = true;

  cb.addEventListener("change", () => {
    localStorage.setItem(`tarefa-${index}`, cb.checked);
  });
});

// Timer
let segundos = 25 * 60;
let intervalo = null;
const timerEl = document.getElementById("timer");
const btnStart = document.getElementById("btn-start");
const btnReset = document.getElementById("btn-reset");

function atualizarTimer() {
  const min = String(Math.floor(segundos / 60)).padStart(2, "0");
  const seg = String(segundos % 60).padStart(2, "0");
  timerEl.textContent = `${min}:${seg}`;
}

function iniciar() {
  if (intervalo) return;
  intervalo = setInterval(() => {
    if (segundos <= 0) {
      clearInterval(intervalo);
      intervalo = null;
      timerEl.textContent = "Fim! 🌴";
      return;
    }
    segundos--;
    atualizarTimer();
  }, 1000);
}

function zerar() {
  clearInterval(intervalo);
  intervalo = null;
  segundos = 25 * 60;
  atualizarTimer();
}

btnStart.addEventListener("click", iniciar);
btnReset.addEventListener("click", zerar);
atualizarTimer();
// Streak (dias seguidos aparecendo)
const streakNumeroEl = document.getElementById("streak-numero");
const streakStatusEl = document.getElementById("streak-status");

function hojeString() {
  return new Date().toISOString().slice(0, 10); // "2026-11-11"
}

function ontemString() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

function atualizarStreak() {
  let streak = Number(localStorage.getItem("streak") || 0);
  const ultimoDia = localStorage.getItem("ultimoDia");
  const hoje = hojeString();

  if (ultimoDia === hoje) {
    streakStatusEl.textContent = "✅ Hoje você apareceu";
  } else if (ultimoDia === ontemString()) {
    streak = streak + 1;
    localStorage.setItem("streak", streak);
    localStorage.setItem("ultimoDia", hoje);
    streakStatusEl.textContent = "🔥 Você voltou! Streak somou +1";
  } else if (ultimoDia) {
    streak = 1;
    localStorage.setItem("streak", streak);
    localStorage.setItem("ultimoDia", hoje);
    streakStatusEl.textContent = "🌱 Recomeçando, sem culpa";
  } else {
    streakStatusEl.textContent = "Marque uma tarefa pra começar hoje";
  }

  streakNumeroEl.textContent = `${streak} ${streak === 1 ? "dia" : "dias"}`;
}

// Marcar tarefa = aparecer hoje
checkboxes.forEach((cb) => {
  cb.addEventListener("change", () => {
    if (cb.checked) {
      const hoje = hojeString();
      const ultimoDia = localStorage.getItem("ultimoDia");
      if (ultimoDia !== hoje) {
        localStorage.setItem("ultimoDia", hoje);
      }
      atualizarStreak();
    }
  });
});

atualizarStreak();