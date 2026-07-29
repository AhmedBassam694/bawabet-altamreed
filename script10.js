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
question:"1- What is the most common dental disease?",
answers:[
"A) Gingivitis",
"B) Dental Caries",
"C) Pulpitis",
"D) Dental Abscess"
],
correct:1
},

{
question:"2- Which bacteria is mainly responsible for Dental Caries?",
answers:[
"A) Staphylococcus",
"B) Streptococcus mutans",
"C) E. coli",
"D) Salmonella"
],
correct:1
},

{
question:"3- Dental caries first affects which layer of the tooth?",
answers:[
"A) Pulp",
"B) Dentin",
"C) Enamel",
"D) Cementum"
],
correct:2
},

{
question:"4- Acute pulpitis usually causes:",
answers:[
"A) Mild painless swelling",
"B) Sharp severe pain",
"C) No symptoms",
"D) Tooth discoloration only"
],
correct:1
},

{
question:"5- The definitive treatment of acute pulpitis is:",
answers:[
"A) Mouthwash only",
"B) Root canal treatment",
"C) Tooth brushing",
"D) Vitamin supplements"
],
correct:1
},
  {
question:"6- Attrition is:",
answers:[
"A) Chemical wear of enamel",
"B) Physiological wear with aging",
"C) Bacterial infection",
"D) Gum inflammation"
],
correct:1
},

{
question:"7- Which vitamin deficiency is associated with chronic gingivitis?",
answers:[
"A) Vitamin A",
"B) Vitamin D",
"C) Vitamin C",
"D) Vitamin K"
],
correct:2
},

{
question:"8- ANUG is mainly caused by:",
answers:[
"A) Viruses",
"B) Spirochete bacteria",
"C) Fungi",
"D) Protozoa"
],
correct:1
},

{
question:"9- A dental abscess is commonly treated by:",
answers:[
"A) Antibiotics only",
"B) Drainage and root canal treatment",
"C) Eye drops",
"D) Ear irrigation"
],
correct:1
},

{
question:"10- The standard method for sterilizing dental instruments is:",
answers:[
"A) Boiling water",
"B) Alcohol",
"C) Steam Autoclave",
"D) Sunlight"
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

chapter: "Chapter 10",

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

clearInterval(timerInterval);

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
