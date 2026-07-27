const questions = [

{
question: "What is a hernia?",
answers: [
"Protrusion of viscera through an opening",
"Inflammation of the intestine",
"Enlargement of the liver",
"Fracture of a bone"
],
correct: 0
},

{
question: "Which type of hernia appears on the body surface?",
answers: [
"Internal hernia",
"External hernia",
"Diaphragmatic hernia",
"Hiatal hernia"
],
correct: 1
},

{
question: "The most dangerous complication of hernia is:",
answers: [
"Pain",
"Swelling",
"Strangulation",
"Fever"
],
correct: 2
},

{
question: "The thyroid gland secretes:",
answers: [
"Insulin",
"T3 and T4",
"Adrenaline",
"Cortisol"
],
correct: 1
},

{
question: "Hyperthyroidism means:",
answers: [
"Low thyroid hormones",
"High thyroid hormones",
"No thyroid hormones",
"Thyroid infection"
],
correct: 1
},

{
question: "The largest salivary gland is:",
answers: [
"Sublingual gland",
"Submandibular gland",
"Parotid gland",
"Lacrimal gland"
],
correct: 2
},

{
question: "Breast abscess is treated by:",
answers: [
"Antacids",
"Incision and drainage",
"Radiotherapy",
"Chemotherapy"
],
correct: 1
},

{
question: "Cardiac Achalasia mainly causes:",
answers: [
"Difficulty swallowing",
"Diarrhea",
"Constipation",
"Headache"
],
correct: 0
},

{
question: "The most common organism associated with gastric ulcer is:",
answers: [
"H. pylori",
"HIV",
"E. coli",
"Staphylococcus"
],
correct: 0
},

{
question: "The four main symptoms of intestinal obstruction are:",
answers: [
"Pain, vomiting, distension, constipation",
"Cough, fever, headache, rash",
"Chest pain, edema, cough, cyanosis",
"Polyuria, thirst, weight gain, itching"
],
correct: 0
}

];

let currentQuestion = 0;
let score = 0;
let selectedAnswer = null;

const question = document.getElementById("question");
const answers = document.getElementById("answers");
const nextBtn = document.getElementById("nextBtn");
const questionNumber = document.getElementById("questionNumber");
const progressFill = document.getElementById("progressFill");

function loadQuestion() {

selectedAnswer = null;

const q = questions[currentQuestion];

question.innerHTML = q.question;

questionNumber.innerHTML =
`السؤال ${currentQuestion + 1} / ${questions.length}`;

progressFill.style.width =
`${((currentQuestion + 1) / questions.length) * 100}%`;

answers.innerHTML = "";

q.answers.forEach((answer, index) => {

const btn = document.createElement("button");

btn.className = "answer-btn";

btn.innerHTML = answer;

btn.onclick = () => {

selectedAnswer = index;

document.querySelectorAll(".answer-btn")
.forEach(b => b.classList.remove("selected"));

btn.classList.add("selected");

};

answers.appendChild(btn);

});

}

nextBtn.onclick = () => {

if(selectedAnswer === null){

alert("اختر إجابة أولاً");

return;

}

if(selectedAnswer === questions[currentQuestion].correct){

score++;

}

currentQuestion++;

if(currentQuestion < questions.length){

loadQuestion();

}else{

clearInterval(timer);

question.innerHTML =
`🎉 انتهى الاختبار <br><br> درجتك ${score} من ${questions.length}`;

answers.innerHTML = "";

nextBtn.style.display = "none";

questionNumber.innerHTML = "";

progressFill.style.width = "100%";

document.getElementById("timer").innerHTML = "✅ انتهى الوقت";

}

};

let timeLeft = 360;

const timer = setInterval(() => {

let minutes = Math.floor(timeLeft / 60);

let seconds = timeLeft % 60;

document.getElementById("timer").innerHTML =
`⏱️ ${minutes}:${seconds.toString().padStart(2,"0")}`;

timeLeft--;

if(timeLeft < 0){

clearInterval(timer);

question.innerHTML =
`⏰ انتهى الوقت <br><br> درجتك ${score} من ${questions.length}`;

answers.innerHTML = "";

nextBtn.style.display = "none";

questionNumber.innerHTML = "";

progressFill.style.width = "100%";

}

},1000);

loadQuestion();
