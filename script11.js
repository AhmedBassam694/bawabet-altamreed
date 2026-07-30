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
question:"1- A fracture is:",
answers:[
"A) Joint inflammation",
"B) Separation of a bone into two or more parts",
"C) Muscle tear",
"D) Bone infection"
],
correct:1
},

{
question:"2- A fracture with a skin wound is called:",
answers:[
"A) Closed fracture",
"B) Greenstick fracture",
"C) Compound fracture",
"D) Spiral fracture"
],
correct:2
},

{
question:"3- Which fracture commonly occurs in children?",
answers:[
"A) Depressed fracture",
"B) Greenstick fracture",
"C) Comminuted fracture",
"D) Impacted fracture"
],
correct:1
},

{
question:"4- Which type has multiple bone fragments?",
answers:[
"A) Comminuted fracture",
"B) Simple fracture",
"C) Oblique fracture",
"D) Spiral fracture"
],
correct:0
},

{
question:"5- Crepitus means:",
answers:[
"A) Fever",
"B) Bone grating sound",
"C) Skin wound",
"D) Bleeding"
],
correct:1
},

{
question:"6- The best investigation for most fractures is:",
answers:[
"A) MRI",
"B) Ultrasound",
"C) Plain X-ray",
"D) ECG"
],
correct:2
},

{
question:"7- CT scan is especially useful in:",
answers:[
"A) Rib fractures",
"B) Finger fractures",
"C) Spinal fractures",
"D) Toe fractures"
],
correct:2
},

{
question:"8- Fat embolism usually occurs with:",
answers:[
"A) Multiple fractures",
"B) Ear infection",
"C) Dislocation",
"D) Sprain"
],
correct:0
},

{
question:"9- The first step in fracture management is:",
answers:[
"A) Surgery",
"B) First aid",
"C) Physiotherapy",
"D) Exercise"
],
correct:1
},

{
question:"10- One purpose of splinting is:",
answers:[
"A) Increase movement",
"B) Reduce pain",
"C) Cause bleeding",
"D) Delay healing"
],
correct:1
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

chapter: "Chapter 11",

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
