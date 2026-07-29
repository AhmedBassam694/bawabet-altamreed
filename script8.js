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
question:"1- Which layer of the eye receives light?",
answers:[
"A) Retina",
"B) Cornea",
"C) Iris",
"D) Sclera"
],
correct:0
},

{
question:"2- Which disease is caused by Chlamydia trachomatis?",
answers:[
"A) Cataract",
"B) Trachoma",
"C) Glaucoma",
"D) Chalazion"
],
correct:1
},

{
question:"3- What is the main treatment for Cataract?",
answers:[
"A) Eye drops only",
"B) Antibiotics",
"C) Surgery with artificial lens",
"D) Laser only"
],
correct:2
},

{
question:"4- Which disease causes increased intraocular pressure?",
answers:[
"A) Myopia",
"B) Corneal Ulcer",
"C) Trachoma",
"D) Glaucoma"
],
correct:3
},

{
question:"5- Corneal ulcer is diagnosed by:",
answers:[
"A) Fluorescein dye",
"B) Blood test",
"C) MRI",
"D) ECG"
],
correct:0
},

{
question:"6- Which refractive error is corrected with concave lenses?",
answers:[
"A) Astigmatism",
"B) Myopia",
"C) Hypermetropia",
"D) Glaucoma"
],
correct:1
},

{
question:"7- The normal function of the lens is:",
answers:[
"A) Produce tears",
"B) Detect sound",
"C) Refract light",
"D) Control eye muscles"
],
correct:2
},

{
question:"8- Which eye disease may lead to permanent blindness if untreated?",
answers:[
"A) Chalazion",
"B) Blepharitis",
"C) Cataract",
"D) Glaucoma"
],
correct:3
},

{
question:"9- Which disease commonly affects diabetic patients?",
answers:[
"A) Diabetic Retinopathy",
"B) Entropion",
"C) Trichiasis",
"D) Pterygium"
],
correct:0
},

{
question:"10- Hypermetropia is corrected using:",
answers:[
"A) Convex lenses",
"B) Concave lenses",
"C) Eye patch",
"D) Antibiotic drops"
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

let button=document.createElement("button");

button.innerHTML=answer;

button.className="quiz-answer";

button.onclick=function(){

if(answered) return;

answered=true;

let buttons=document.querySelectorAll("#answers button");

buttons.forEach(btn=>{

btn.disabled=true;

});

if(index===questions[currentQuestion].correct){

score++;

button.style.background="green";
button.style.color="#fff";

}else{

button.style.background="red";
button.style.color="#fff";

buttons[questions[currentQuestion].correct].style.background="green";
buttons[questions[currentQuestion].correct].style.color="#fff";

}

};

answers.appendChild(button);

});

}

nextBtn.onclick=function(){

if(!answered){

alert("من فضلك اختر إجابة أولاً");

return;

}

currentQuestion++;

if(currentQuestion<questions.length){

loadQuestion();

}else{

let percentage=Math.round(
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

let userData=doc.data();

return db.collection("results").add({

uid:currentUser.uid,

name:userData.name,

grade:userData.grade,

email:currentUser.email,

subject:"General Surgery",

chapter:"Chapter 8",

score:score,

total:questions.length,

percentage:percentage,

date:firebase.firestore.FieldValue.serverTimestamp()

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

question.innerHTML="🎉 انتهى الاختبار";

answers.innerHTML=`

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

nextBtn.innerHTML="إعادة الاختبار";

nextBtn.onclick=function(){

location.reload();

};

}

// ======================
// Timer
// ======================

let timeLeft=360;

let timerInterval;

const timer=document.getElementById("timer");

function startTimer(){

timerInterval=setInterval(()=>{

let minutes=Math.floor(timeLeft/60);

let seconds=timeLeft%60;

if(seconds<10){

seconds="0"+seconds;

}

timer.innerHTML=

"⏱️ الوقت: "+minutes+":"+seconds;

timeLeft--;

if(timeLeft<0){

clearInterval(timerInterval);

let percentage=Math.round(

(score/questions.length)*100

);

showResult(percentage);

}

},1000);

}

loadQuestion();

startTimer();
