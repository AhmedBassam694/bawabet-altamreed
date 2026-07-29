// ===============================
// Chapter 7 Quiz
// Laser Surgery
// ===============================

let currentUser = null;

firebase.auth().onAuthStateChanged(function(user){

if(user){

currentUser = user;

}else{

window.location.href = "login.html";

}

});

const questions = [

{

question:"1- Laser is:",

answers:[

"A) A surgical instrument made of steel",

"B) A concentrated beam of light",

"C) A type of medicine",

"D) A blood vessel"

],

correct:1

},

{

question:"2- Laser is called:",

answers:[

"A) Golden Knife",

"B) Electric Scalpel",

"C) Plastic Knife",

"D) Light Scalpel"

],

correct:3

},

{

question:"3- Which of the following is an advantage of Laser Surgery?",

answers:[

"A) Reduced bleeding",

"B) Higher infection rate",

"C) Large wounds",

"D) Longer hospital stay"

],

correct:0

},

{

question:"4- Which gas is used in laparoscopic surgery?",

answers:[

"A) Oxygen",

"B) Nitrogen",

"C) Carbon Dioxide (CO₂)",

"D) Hydrogen"

],

correct:2

},

{

question:"5- Maximum abdominal pressure during laparoscopy is:",

answers:[

"A) 5 mmHg",

"B) 15 mmHg",

"C) 30 mmHg",

"D) 50 mmHg"

],

correct:1

},

{

question:"6- Which of the following is a common laparoscopic operation?",

answers:[

"A) Cholecystectomy",

"B) Eye surgery",

"C) Brain surgery",

"D) Tooth extraction"

],

correct:0

},

{

question:"7- One disadvantage of Laser Surgery is:",

answers:[

"A) Less pain",

"B) Small wounds",

"C) Reduced bleeding",

"D) High cost"

],

correct:3

},

{

question:"8- Laparoscopic surgery is performed through:",

answers:[

"A) Large wounds",

"B) Open chest only",

"C) Small incisions",

"D) Bone openings"

],

correct:2

},

{

question:"9- Kidney transplantation is indicated in:",

answers:[

"A) Asthma",

"B) Chronic renal failure",

"C) Diabetes only",

"D) Hypertension"

],

correct:1

},

{

question:"10- After organ transplantation, patients need:",

answers:[

"A) Immunosuppressive drugs",

"B) Antibiotics only",

"C) Vitamins only",

"D) Painkillers only"

],

correct:0

}

];

let currentQuestion = 0;

let score = 0;

let answered = false;

const question = document.getElementById("question");

const answers = document.getElementById("answers");

const nextBtn = document.getElementById("nextBtn");

function loadQuestion(){

answered = false;

answers.innerHTML = "";

question.innerHTML =
questions[currentQuestion].question;

document.getElementById("questionNumber").innerHTML =
"السؤال " + (currentQuestion + 1) + " / " + questions.length;

document.getElementById("progressFill").style.width =
((currentQuestion + 1) / questions.length) * 100 + "%";

questions[currentQuestion].answers.forEach((answer,index)=>{

let button = document.createElement("button");

button.innerHTML = answer;

button.className = "quiz-answer";

button.onclick = function(){

if(answered) return;

answered = true;

let buttons =
document.querySelectorAll("#answers button");

buttons.forEach(btn=>{

btn.disabled = true;

});

if(index === questions[currentQuestion].correct){

score++;

button.style.background = "green";

button.style.color = "#fff";

}else{

button.style.background = "red";

button.style.color = "#fff";

buttons[questions[currentQuestion].correct].style.background = "green";

buttons[questions[currentQuestion].correct].style.color = "#fff";

}

};

answers.appendChild(button);

});

}

nextBtn.onclick = function(){

if(!answered){

alert("من فضلك اختر إجابة أولاً");

return;

}

currentQuestion++;

if(currentQuestion < questions.length){

loadQuestion();

}else{

let percentage = Math.round(

(score / questions.length) * 100

);

saveResult(percentage);

}

};
function saveResult(percentage){

if(currentUser){

db.collection("users")
.doc(currentUser.uid)
.get()

.then((doc)=>{

let userData = doc.data();

return db.collection("results").add({

uid: currentUser.uid,

name: userData.name,

grade: userData.grade,

email: currentUser.email,

subject: "General Surgery",

chapter: "Chapter 7",

score: score,

total: questions.length,

percentage: percentage,

date: firebase.firestore.FieldValue.serverTimestamp()

});

})

.then(()=>{

showResult(percentage);

})

.catch((error)=>{

console.log(error);

showResult(percentage);

});

}else{

showResult(percentage);

}

}

function showResult(percentage){

question.innerHTML = "🎉 انتهى الاختبار";

answers.innerHTML = `

<h2>

درجتك: ${score} / ${questions.length}

</h2>

<h2>

النسبة: ${percentage}%

</h2>

<h3>

${percentage >= 50 ?

"🎉 مبروك لقد نجحت"

:

"❌ حاول مرة أخرى"

}

</h3>

`;

nextBtn.innerHTML = "إعادة الاختبار";

nextBtn.onclick = function(){

location.reload();

};

}

// ===============================
// Timer
// ===============================

let timeLeft = 360;

let timerInterval;

const timer = document.getElementById("timer");

function startTimer(){

timerInterval = setInterval(()=>{

let minutes = Math.floor(timeLeft / 60);

let seconds = timeLeft % 60;

if(seconds < 10){

seconds = "0" + seconds;

}

timer.innerHTML =

"⏱️ الوقت: " + minutes + ":" + seconds;

timeLeft--;

if(timeLeft < 0){

clearInterval(timerInterval);

let percentage = Math.round(

(score / questions.length) * 100

);

saveResult(percentage);

}

},1000);

}

// ===============================
// Start Quiz
// ===============================

loadQuestion();

startTimer();
