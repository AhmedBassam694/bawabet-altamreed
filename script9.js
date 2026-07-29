const quizData = [

{
question: "The ear is anatomically divided into how many parts?",
answers: [
"Two parts",
"Three parts",
"Four parts",
"Five parts"
],
correct: 1
},

{
question: "Which structure connects the middle ear to the pharynx?",
answers: [
"Cochlea",
"Eustachian tube",
"Optic nerve",
"External canal"
],
correct: 1
},

{
question: "The main function of ear wax (Cerumen) is:",
answers: [
"Improve hearing",
"Trap dust and protect the ear",
"Balance pressure",
"Produce sound"
],
correct: 1
},

{
question: "Which type of otitis externa is common in diabetic patients?",
answers: [
"Diffuse otitis externa",
"Otomycosis",
"Malignant otitis externa",
"Furuncle"
],
correct: 2
},

{
question: "Acute otitis media commonly occurs after:",
answers: [
"Eye infection",
"Common cold",
"Skin allergy",
"Kidney disease"
],
correct: 1
},

{
question: "The most common symptom of acute otitis media is:",
answers: [
"Chest pain",
"Ear pain",
"Abdominal pain",
"Back pain"
],
correct: 1
},

{
question: "The doctor performs Myringotomy to:",
answers: [
"Remove ear wax",
"Drain pus from the middle ear",
"Treat hearing loss",
"Repair the cochlea"
],
correct: 1
},

{
question: "The correct first aid for epistaxis is:",
answers: [
"Lie flat",
"Tilt the head backward",
"Sit leaning forward and pinch the nose",
"Drink cold water"
],
correct: 2
},

{
question: "Which of the following is a common symptom of sinusitis?",
answers: [
"Headache",
"Leg pain",
"Chest pain",
"Palpitations"
],
correct: 0
},

{
question: "The definitive treatment of chronic tonsillitis is:",
answers: [
"Antibiotics only",
"Tonsillectomy",
"Nasal drops",
"Eye ointment"
],
correct: 1
}

];

let currentQuestion = 0;
let score = 0;

let timeLeft = 360;

const timer = document.getElementById("timer");

const countdown = setInterval(() => {

let minutes = Math.floor(timeLeft / 60);
let seconds = timeLeft % 60;

timer.textContent =
`⏳ ${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}`;

timeLeft--;

if(timeLeft < 0){

clearInterval(countdown);

showResult();

}

},1000);
const quizContainer = document.getElementById("quiz");
const submitBtn = document.getElementById("submit-btn");
const result = document.getElementById("result");

function loadQuiz() {
  let output = "";

  quizData.forEach((q, index) => {
    output += `
      <div class="question">
        <h3>${index + 1}. ${q.question}</h3>

        <label>
          <input type="radio" name="q${index}" value="A">
          A) ${q.options.A}
        </label><br>

        <label>
          <input type="radio" name="q${index}" value="B">
          B) ${q.options.B}
        </label><br>

        <label>
          <input type="radio" name="q${index}" value="C">
          C) ${q.options.C}
        </label><br>

        <label>
          <input type="radio" name="q${index}" value="D">
          D) ${q.options.D}
        </label>
      </div>
      <hr>
    `;
  });

  quizContainer.innerHTML = output;
}

loadQuiz();

submitBtn.addEventListener("click", () => {
  let score = 0;

  quizData.forEach((q, index) => {
    const answer = document.querySelector(
      `input[name="q${index}"]:checked`
    );

    if (answer && answer.value === q.correct) {
      score++;
    }
  });

  clearInterval(timer);

  const percentage = Math.round((score / quizData.length) * 100);

  result.innerHTML = `
    <h2>✅ النتيجة</h2>
    <p>الإجابات الصحيحة: <strong>${score}</strong> من <strong>${quizData.length}</strong></p>
    <p>النسبة: <strong>${percentage}%</strong></p>
  `;

  submitBtn.disabled = true;

  document
    .querySelectorAll("input[type='radio']")
    .forEach((input) => (input.disabled = true));
});
