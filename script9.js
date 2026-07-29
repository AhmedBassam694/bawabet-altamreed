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
question:"1- The ear is anatomically divided into:",
answers:[
"A) Two parts",
"B) Three parts",
"C) Four parts",
"D) Five parts"
],
correct:1
},

{
question:"2- Which tube connects the middle ear to the pharynx?",
answers:[
"A) Cochlear tube",
"B) Eustachian tube",
"C) Auditory nerve",
"D) External canal"
],
correct:1
},

{
question:"3- Cerumen is another name for:",
answers:[
"A) Ear bone",
"B) Ear wax",
"C) Ear drum",
"D) Cochlea"
],
correct:1
},

{
question:"4- The main function of ear wax is:",
answers:[
"A) Improve hearing",
"B) Protect the ear by trapping dust",
"C) Balance pressure",
"D) Produce sound"
],
correct:1
},

{
question:"5- Otitis externa affects the:",
answers:[
"A) Inner ear",
"B) Middle ear",
"C) External auditory canal",
"D) Cochlea"
],
correct:2
},

{
question:"6- Acute otitis media commonly follows:",
answers:[
"A) Eye infection",
"B) Upper respiratory infection",
"C) Kidney disease",
"D) Skin infection"
],
correct:1
},

{
question:"7- Myringotomy is done to:",
answers:[
"A) Remove ear wax",
"B) Drain pus from the middle ear",
"C) Repair the cochlea",
"D) Improve vision"
],
correct:1
},

{
question:"8- The correct first aid for epistaxis is:",
answers:[
"A) Tilt head backward",
"B) Lie flat",
"C) Sit leaning forward and pinch the nose",
"D) Drink cold water"
],
correct:2
},

{
question:"9- The definitive treatment for chronic tonsillitis is:",
answers:[
"A) Eye drops",
"B) Tonsillectomy",
"C) Nasal spray",
"D) Bed rest only"
],
correct:1
},

{
question:"10- Tracheostomy is performed to:",
answers:[
"A) Improve hearing",
"B) Treat sinusitis",
"C) Create an artificial airway",
"D) Remove tonsils"
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

chapter:"Chapter 9",

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
