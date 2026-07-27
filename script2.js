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
question:"1- Water constitutes about ____ of body weight.",
answers:[
"A) 40%",
"B) 60%",
"C) 25%",
"D) 80%"
],
correct:1
},

{
question:"2- The largest amount of body water is found in:",
answers:[
"A) Plasma",
"B) Blood vessels",
"C) Intracellular fluid",
"D) Interstitial fluid"
],
correct:2
},

{
question:"3- The normal potassium level is:",
answers:[
"A) 8 - 10 mEq/L",
"B) 1 - 2 mEq/L",
"C) 3.5 - 5.0 mEq/L",
"D) 6 - 8 mEq/L"
],
correct:2
},

{
question:"4- A common cause of dehydration is:",
answers:[
"A) Reading",
"B) Walking",
"C) Severe diarrhea",
"D) Sleeping"
],
correct:2
},

{
question:"5- One symptom of dehydration is:",
answers:[
"A) Ear pain",
"B) Dry mouth",
"C) Hair loss",
"D) Blurred vision"
],
correct:1
},

{
question:"6- Low potassium may cause:",
answers:[
"A) Skin rash",
"B) Hearing loss",
"C) High fever",
"D) Muscle weakness"
],
correct:3
},

{
question:"7- Rapid IV potassium may lead to:",
answers:[
"A) Weight gain",
"B) Cardiac arrest",
"C) Improved vision",
"D) High appetite"
],
correct:1
},

{
question:"8- Calcium Gluconate should be given:",
answers:[
"A) By inhalation",
"B) Only orally",
"C) Slowly IV",
"D) Rapid IV push"
],
correct:2
},

{
question:"9- One cause of sodium deficiency is:",
answers:[
"A) Exercise",
"B) Hair cutting",
"C) Reading books",
"D) Diarrhea"
],
correct:3
},

{
question:"10- Rapid correction of sodium deficiency may cause:",
answers:[
"A) Better memory",
"B) High blood sugar",
"C) Brain damage",
"D) Improved appetite"
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

button.onclick=function(){

if(answered) return;

answered=true;

let buttons =
document.querySelectorAll("#answers button");

buttons.forEach(btn=>{

btn.disabled=true;

});

if(index === questions[currentQuestion].correct){

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

subject:"General Surgery",

chapter:"Chapter 2",

score:score,

total:questions.length,

percentage:percentage,

date:firebase.firestore.FieldValue.serverTimestamp()

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

question.innerHTML="🎉 انتهى الاختبار";

answers.innerHTML=`

<h2>  
درجتك: ${score} / ${questions.length}  
</h2>  <h2>  
النسبة: ${percentage}%  
</h2>  <h3>  
${percentage >= 50 ?  
"🎉 مبروك لقد نجحت":  
"❌ حاول مرة أخرى"}  
</h3>  `;

nextBtn.innerHTML="إعادة الاختبار";

nextBtn.onclick=function(){

location.reload();

};

}

// Timer

let timeLeft = 300;

let timerInterval;

const timer = document.getElementById("timer");

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

// Start Quiz

loadQuestion();

startTimer();
