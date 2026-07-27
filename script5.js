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
let answered = false;

const question = document.getElementById("question");
const answers = document.getElementById("answers");
const nextBtn = document.getElementById("nextBtn");
const questionNumber = document.getElementById("questionNumber");
const progressFill = document.getElementById("progressFill");

function loadQuestion() {

selectedAnswer = null;
answered = false;

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

if(answered) return;

answered = true;

selectedAnswer = index;

const allBtns = document.querySelectorAll(".answer-btn");

allBtns.forEach(b => b.disabled = true);

if(index === q.correct){

btn.style.background = "#28a745";
btn.style.color = "#fff";

}else{

btn.style.background = "#dc3545";
btn.style.color = "#fff";

allBtns[q.correct].style.background = "#28a745";
allBtns[q.correct].style.color = "#fff";

}

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

question.innerHTML = `
<h2>🎉 انتهى الاختبار</h2>

<p style="font-size:24px;margin:20px 0;">
درجتك
<br><br>
<b>${score} / ${questions.length}</b>
</p>

<p style="font-size:20px;">
${score >= 8 ? "🏆 ممتاز جدًا" :
score >= 6 ? "👏 جيد جدًا" :
score >= 5 ? "🙂 جيد" :
"📚 تحتاج إلى مذاكرة أكثر"}
</p>
`;

answers.innerHTML = "";

nextBtn.style.display = "none";

questionNumber.innerHTML = "";

progressFill.style.width = "100%";

document.getElementById("timer").innerHTML = "✅ انتهى الاختبار";

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

question.innerHTML = `
<h2>⏰ انتهى الوقت</h2>

<p style="font-size:24px;margin:20px 0;">
درجتك
<br><br>
<b>${score} / ${questions.length}</b>
</p>

<p>
انتهى الوقت قبل إكمال الاختبار.
</p>
`;

answers.innerHTML = "";

nextBtn.style.display = "none";

questionNumber.innerHTML = "";

progressFill.style.width = "100%";

}

},1000);

loadQuestion();
