// ===============================
// Chapter 6 Quiz
// Injuries
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
question:"1- The most common cause of immediate death after injuries is:",
answers:[
"A) Infection",
"B) Brain, spinal cord or heart injury",
"C) Kidney failure",
"D) Liver disease"
],
correct:1
},

{
question:"2- The golden hours refer to:",
answers:[
"A) Few hours after injury",
"B) One week after injury",
"C) One month after injury",
"D) Before the accident"
],
correct:0
},

{
question:"3- Primary assessment is known by:",
answers:[
"A) ABC",
"B) GCS",
"C) ABCDE",
"D) CPR"
],
correct:2
},

{
question:"4- The letter A in ABCDE stands for:",
answers:[
"A) Abdomen",
"B) Airway",
"C) Artery",
"D) Assessment"
],
correct:1
},

{
question:"5- A rapid weak pulse usually indicates:",
answers:[
"A) Fever",
"B) Infection",
"C) Neurogenic Shock",
"D) Bleeding Shock"
],
correct:3
},

{
question:"6- If neck fracture is suspected, the patient should:",
answers:[
"A) Walk carefully",
"B) Be moved immediately",
"C) Be immobilized with a cervical collar",
"D) Sit upright"
],
correct:2
},

{
question:"7- Secondary assessment includes examination of:",
answers:[
"A) Head and scalp",
"B) Abdomen",
"C) Spine",
"D) All of the above"
],
correct:3
},

{
question:"8- The highest priority patient is one with:",
answers:[
"A) Difficulty breathing",
"B) Minor burns",
"C) Simple fracture",
"D) Small wound"
],
correct:0
},

{
question:"9- Glasgow Coma Scale evaluates:",
answers:[
"A) Blood pressure",
"B) Eye, motor and verbal response",
"C) Pulse only",
"D) Temperature"
],
correct:1
},

{
question:"10- GCS of 8 or less requires:",
answers:[
"A) Home rest",
"B) Oral antibiotics",
"C) Endotracheal intubation",
"D) Physiotherapy"
],
correct:2
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

chapter: "Chapter 6",

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

showResult(percentage);

}

},1000);

}

// ===============================
// Start Quiz
// ===============================

loadQuestion();

startTimer();
