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
question:"1- The upper urinary tract consists of:",
answers:[
"A) Bladder and urethra",
"B) Kidneys and ureters",
"C) Kidney and bladder",
"D) Ureters and urethra"
],
correct:1
},

{
question:"2- The most important urinary symptom is:",
answers:[
"A) Fever",
"B) Nausea",
"C) Hematuria",
"D) Hypertension"
],
correct:2
},

{
question:"3- Renal colic is commonly caused by:",
answers:[
"A) Kidney infection",
"B) Bladder tumor",
"C) Ureteric stone",
"D) Prostate enlargement"
],
correct:2
},

{
question:"4- The basic investigation for urinary diseases is:",
answers:[
"A) MRI",
"B) Ultrasound",
"C) ECG",
"D) Colonoscopy"
],
correct:1
},

{
question:"5- The cornerstone investigation for bladder tumors is:",
answers:[
"A) CT Scan",
"B) IVP",
"C) Cystoscopy",
"D) Renal Scan"
],
correct:2
},

{
question:"6- The most common type of urinary stone is:",
answers:[
"A) Uric acid",
"B) Calcium oxalate",
"C) Struvite",
"D) Cystine"
],
correct:1
},

{
question:"7- The most common route of urinary tract infection is:",
answers:[
"A) Blood stream",
"B) Lymphatics",
"C) Ascending through urethra",
"D) Direct trauma"
],
correct:2
},

{
question:"8- Benign prostatic hyperplasia usually affects men over:",
answers:[
"A) 30 years",
"B) 40 years",
"C) 50 years",
"D) 70 years"
],
correct:2
},

{
question:"9- The first treatment for acute urinary retention is:",
answers:[
"A) Dialysis",
"B) Foley catheter",
"C) Chemotherapy",
"D) Nephrectomy"
],
correct:1
},

{
question:"10- Smoking is an important risk factor for:",
answers:[
"A) Kidney cancer",
"B) Bladder cancer",
"C) Both A and B",
"D) Urinary tract infection"
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
(score/questions.length)*100
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

chapter: "Chapter 12",

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

${percentage>=50?

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
(score/questions.length)*100
);

showResult(percentage);

}

},1000);

}

loadQuestion();

startTimer();
