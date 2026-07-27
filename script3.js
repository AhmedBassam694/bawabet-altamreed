let currentUser = null;

firebase.auth().onAuthStateChanged(function(user){

if(user){

currentUser = user;

}else{

alert("يجب تسجيل الدخول أولاً");

window.location.href = "login.html";

}

});

const questions = [

{
question:"1- Shock is:",
answers:[
"A) A lung disease",
"B) A drop in blood circulation",
"C) A bone disease",
"D) An increase in blood pressure"
],
correct:1
},

{
question:"2- Which type of shock is caused by severe blood loss?",
answers:[
"A) Neurogenic Shock",
"B) Septic Shock",
"C) Surgical Shock",
"D) Cardiogenic Shock"
],
correct:2
},

{
question:"3- Which stage of shock responds to treatment?",
answers:[
"A) Septic Shock",
"B) Terminal Shock",
"C) Irreversible Shock",
"D) Reversible Shock"
],
correct:3
},

{
question:"4- A common symptom of Surgical Shock is:",
answers:[
"A) High blood pressure",
"B) Bradycardia",
"C) Rapid weak pulse",
"D) Slow breathing"
],
correct:2
},

{
question:"5- Neurogenic Shock is mainly caused by:",
answers:[
"A) Severe pain",
"B) Infection",
"C) Bleeding",
"D) Burns"
],
correct:0
},

{
question:"6- Which type of shock is caused by severe infection?",
answers:[
"A) Hypovolemic Shock",
"B) Septic Shock",
"C) Surgical Shock",
"D) Neurogenic Shock"
],
correct:1
},

{
question:"7- One treatment for Septic Shock is:",
answers:[
"A) Calcium tablets",
"B) Bed rest only",
"C) Strong antibiotics",
"D) Vitamin C only"
],
correct:2
},

{
question:"8- Which IV fluid may be used in Surgical Shock?",
answers:[
"A) Distilled Water",
"B) Fruit Juice",
"C) Milk",
"D) Ringer's Solution"
],
correct:3
},

{
question:"9- Low blood pressure is a symptom of:",
answers:[
"A) Hypertension",
"B) Shock",
"C) Common Cold",
"D) Asthma"
],
correct:1
},

{
question:"10- The first step in managing shock is:",
answers:[
"A) Delay treatment",
"B) Allow the patient to walk",
"C) Treat the cause",
"D) Give antibiotics to everyone"
],
correct:2
}

];

let currentQuestion = 0;
let score = 0;
let answered = false;

let timeLeft = 300;
let timerInterval;

const question = document.getElementById("question");
const answers = document.getElementById("answers");
const nextBtn = document.getElementById("nextBtn");
const timer = document.getElementById("timer");

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

let allButtons = document.querySelectorAll("#answers button");

allButtons.forEach(btn=>{

btn.disabled = true;

});

if(index === questions[currentQuestion].correct){

score++;

button.style.background = "green";
button.style.color = "#fff";

}else{

button.style.background = "red";
button.style.color = "#fff";

allButtons[questions[currentQuestion].correct].style.background = "green";
allButtons[questions[currentQuestion].correct].style.color = "#fff";

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

clearInterval(timerInterval);

let percentage = Math.round(
(score / questions.length) * 100
);

if(currentUser){

db.collection("users").doc(currentUser.uid).get()

.then((doc)=>{

const userData = doc.data();

return db.collection("results").add({

uid: currentUser.uid,

name: userData.name,

grade: userData.grade,

email: currentUser.email,

subject: "General Surgery",

chapter: "Chapter 3",

score: score,

total: questions.length,

percentage: percentage,

date: firebase.firestore.FieldValue.serverTimestamp()

})

.then(()=>{

return db.collection("leaderboard")
.doc(currentUser.uid)
.get();

})

.then((leaderDoc)=>{

if(!leaderDoc.exists || percentage > leaderDoc.data().percentage){

return db.collection("leaderboard")
.doc(currentUser.uid)
.set({

uid: currentUser.uid,

name: userData.name,

grade: userData.grade,

email: currentUser.email,

subject: "General Surgery",

chapter: "Chapter 3",

score: score,

percentage: percentage,

date: firebase.firestore.FieldValue.serverTimestamp()

});

}

})

.then(()=>{

showResult(percentage);

});

}else{

showResult(percentage);

}

}

};

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
"🎉 مبروك لقد نجحت" :
"❌ حاول مرة أخرى"}
</h3>

`;

nextBtn.innerHTML = "إعادة الاختبار";

nextBtn.onclick = function(){

location.reload();

};

}
// =========================
// Timer
// =========================

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

if(currentUser){

db.collection("users").doc(currentUser.uid).get()

.then((doc)=>{

const userData = doc.data();

return db.collection("results").add({

uid: currentUser.uid,

name: userData.name,

grade: userData.grade,

email: currentUser.email,

subject: "General Surgery",

chapter: "Chapter 3",

score: score,

total: questions.length,

percentage: percentage,

date: firebase.firestore.FieldValue.serverTimestamp()

});

})

.finally(()=>{

question.innerHTML = "⏰ انتهى الوقت";

answers.innerHTML = `

<h2>
انتهى وقت الاختبار
</h2>

<h2>
درجتك: ${score} / ${questions.length}
</h2>

<h2>
النسبة: ${percentage}%
</h2>

`;

nextBtn.style.display = "none";

});

}else{

question.innerHTML = "⏰ انتهى الوقت";

answers.innerHTML = `

<h2>
انتهى وقت الاختبار
</h2>

<h2>
درجتك: ${score} / ${questions.length}
</h2>

<h2>
النسبة: ${percentage}%
</h2>

`;

nextBtn.style.display = "none";

}

}

},1000);

}

// =========================
// Start Quiz
// =========================

loadQuestion();

startTimer();
