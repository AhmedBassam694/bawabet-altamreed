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
question:"1- Malignant hyperthermia is a complication of:",
answers:[
"A) General anesthesia",
"B) Blood transfusion",
"C) DVT",
"D) Wound infection"
],
correct:0
},


{
question:"2- A symptom of pyrogenic reaction is:",
answers:[
"A) Slow pulse",
"B) Sudden rise in temperature with chills",
"C) Low temperature",
"D) High blood sugar"
],
correct:1
},


{
question:"3- Air embolism can occur with:",
answers:[
"A) Oral medication",
"B) Urinary catheter",
"C) Central venous catheter",
"D) Wound dressing"
],
correct:2
},


{
question:"4- Phlebitis appears as:",
answers:[
"A) High fever only",
"B) Vein swelling, pain and warmth",
"C) Bone fracture",
"D) Low blood pressure"
],
correct:1
},


{
question:"5- Wound dehiscence means:",
answers:[
"A) Opening of the wound",
"B) Wound healing",
"C) Skin allergy",
"D) Fluid overload"
],
correct:0
},


{
question:"6- Atelectasis results from:",
answers:[
"A) Kidney failure",
"B) Blood incompatibility",
"C) Bronchial obstruction and weak breathing",
"D) Liver disease"
],
correct:2
},


{
question:"7- Deep Vein Thrombosis occurs mainly due to:",
answers:[
"A) Prolonged immobility",
"B) Increased movement",
"C) Antibiotics",
"D) High temperature"
],
correct:0
},


{
question:"8- Diagnosis of DVT is done by:",
answers:[
"A) ECG",
"B) Chest X-ray",
"C) Blood group test",
"D) Duplex scan"
],
correct:3
},


{
question:"9- The most dangerous complication of blood transfusion is:",
answers:[
"A) Fever",
"B) Incompatibility reaction",
"C) Pain",
"D) Jaundice"
],
correct:1
},


{
question:"10- Rh factor is important especially during:",
answers:[
"A) Exercise",
"B) Surgery",
"C) Pregnancy",
"D) Eating"
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

subject:"General Surgery",

chapter:"Chapter 4",

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
"🎉 مبروك لقد نجحت":
"❌ حاول مرة أخرى"}
</h3>

`;



nextBtn.innerHTML = "إعادة الاختبار";


nextBtn.onclick = function(){

location.reload();

};


}


// Timer

let timeLeft = 300;

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





// Start Quiz

loadQuestion();

startTimer();
