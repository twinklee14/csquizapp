const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const quizBox = document.getElementById('quiz');
const questionEl = document.getElementById('question');
const optionsEl = document.getElementById('options');
const scoreBox = document.getElementById('score-box');
const timerEl = document.getElementById('timer');
const setup = document.getElementById('setup');

let questions = [];
let current = 0;
let score = 0;
let timer;
let timeLeft = 15;

startBtn.onclick = async () => {
  const difficulty = document.getElementById('difficulty').value;
  setup.style.display = 'none';
  await loadQuestions(difficulty);
  quizBox.style.display = 'block';
  showQuestion();
};

async function loadQuestions(difficulty) {
  const url = `https://opentdb.com/api.php?amount=10&category=18&difficulty=${difficulty}&type=multiple`;
  const res = await fetch(url);
  const data = await res.json();
  questions = formatQuestions(data.results);
}

function formatQuestions(apiData) {
  return apiData.map(q => {
    const options = [...q.incorrect_answers];
    const correctIndex = Math.floor(Math.random() * 4);
    options.splice(correctIndex, 0, q.correct_answer);
    return {
      question: decodeHTML(q.question),
      options: options.map(decodeHTML),
      correctIndex
    };
  });
}

function decodeHTML(str) {
  const txt = document.createElement('textarea');
  txt.innerHTML = str;
  return txt.value;
}

function showQuestion() {
  clearInterval(timer);
  if (current >= questions.length) return showScore();

  const q = questions[current];
  questionEl.textContent = `Q${current + 1}. ${q.question}`;
  optionsEl.innerHTML = '';
  q.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.classList.add('option');
    btn.textContent = opt;
    btn.onclick = () => checkAnswer(i);
    optionsEl.appendChild(btn);
  });

  nextBtn.style.display = 'none';
  startTimer();
}

function startTimer() {
  timeLeft = 15;
  timerEl.textContent = `⏱️ Time left: ${timeLeft}s`;
  timer = setInterval(() => {
    timeLeft--;
    timerEl.textContent = `⏱️ Time left: ${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(timer);
      autoTimeout();
    }
  }, 1000);
}

function autoTimeout() {
  const correct = questions[current].correctIndex;
  const allBtns = document.querySelectorAll('.option');
  allBtns.forEach((btn, i) => {
    btn.disabled = true;
    if (i === correct) btn.style.background = '#28a745';
  });
  nextBtn.style.display = 'block';
}

function checkAnswer(selectedIndex) {
  clearInterval(timer);
  const correct = questions[current].correctIndex;
  if (selectedIndex === correct) score++;
  const allBtns = document.querySelectorAll('.option');
  allBtns.forEach((btn, i) => {
    btn.disabled = true;
    if (i === correct) btn.style.background = '#28a745';
    else if (i === selectedIndex) btn.style.background = '#dc3545';
  });
  nextBtn.style.display = 'block';
}

nextBtn.onclick = () => {
  current++;
  showQuestion();
};

function showScore() {
  clearInterval(timer);
  quizBox.style.display = 'none';
  scoreBox.innerHTML = ` You scored ${score} / ${questions.length}`;
}

