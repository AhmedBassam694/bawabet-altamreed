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
question:"1- Anesthesia is:",
answers:[
"A) Permanent loss of sensation",
"B) Temporary loss of sensation",
"C) Permanent paralysis",
"D) Loss of memory only"
],
correct:1
},

{
question:"2- Which is NOT a type of anesthesia?",
answers:[
"A) General anesthesia",
"B) Regional anesthesia",
"C) Local anesthesia",
"D) Cardiac anesthesia"
],
correct:3
},

{
question:"3- General anesthesia includes:",
answers:[
"A) Loss of pain only",
"B) Muscle relaxation only",
"C) Loss of consciousness, analgesia and muscle relaxation",
"D) Fever and sedation"
],
correct:2
},

{
question:"4- Spinal anesthesia is used mainly for:",
answers:[
"A) Brain surgery",
"B) Lower limb surgery",
"C) Eye surgery",
"D) Thyroid surgery"
],
correct:1
},

{
question:"5- The minimum fasting period before anesthesia is:",
answers:[
"A) 2 hours",
"B) 4 hours",
"C) 6 hours",
"D) 12 hours"
],
correct:2
},

{
question:"6- Which drug is the antidote for Morphine?",
answers:[
"A) Atropine",
"B) Naloxone",
"C) Flumazenil",
"D) Diazepam"
],
correct:1
},

{
question:"7- Which drug is commonly used for rapid IV induction?",
answers:[
"A) Thiopental",
"B) Aspirin",
"C) Insulin",
"D) Digoxin"
],
correct:0
},

{
question:"8- Nitrous oxide is mainly used for:",
answers:[
"A) Analgesia",
"B) Lowering blood pressure",
"C) Treating infection",
"D) Muscle paralysis"
],
correct:0
},

{
question:"9- During anesthesia the nurse must monitor:",
answers:[
"A) ECG and Blood Pressure",
"B) Oxygen saturation",
"C) Heart rate",
"D) All of the above"
],
correct:3
},

{
question:"10- Before discharge from recovery room the patient should have:",
answers:[
"A) Stable vital signs",
"B) Normal consciousness",
"C) No active bleeding",
"D) All of the above"
],
correct:3
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

question.innerHTML = questions[currentQuestion].question;

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

let buttons = document.querySelectorAll("#answers button");

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

chapter: "Chapter 13",

score: score,

total: questions.length,

percentage: percentage,

date: firebase.firestore.FieldValue.serverTimestamp()

});

})

.then(()=>{

showResult(percentage);

})

.catch(()=>{

showResult(percentage);

});

}else{

showResult(percentage);

}

}

function showResult(percentage){

question.innerHTML = "🎉 انتهى الاختبار";

answers.innerHTML = `

<h2>درجتك: ${score} / ${questions.length}</h2>

<h2>النسبة: ${percentage}%</h2>

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

showResult(percentage);

}

},1000);

}

loadQuestion();

startTimer();
