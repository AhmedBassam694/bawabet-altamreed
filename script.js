const questions = [

{
question:"1- Inflammation is the body's reaction against:",
answers:[
"A) Internal hormones",
"B) Any external stimulus",
"C) Lack of sleep",
"D) High blood pressure"
],
correct:1
},

{
question:"2- The most common inflammation in surgery is:",
answers:[
"A) Viral inflammation",
"B) Fungal inflammation",
"C) Bacterial inflammation",
"D) Allergic inflammation"
],
correct:2
},

{
question:"3- Which of the following is NOT a type of bacterial inflammation?",
answers:[
"A) Acute inflammation",
"B) Chronic inflammation",
"C) Specific inflammation",
"D) Congenital inflammation"
],
correct:3
},

{
question:"4- Tuberculosis is an example of:",
answers:[
"A) Non-specific inflammation",
"B) Specific inflammation",
"C) Viral inflammation",
"D) Chemical inflammation"
],
correct:1
},

{
question:"5- Which of the following is a non-specific inflammation?",
answers:[
"A) Tetanus",
"B) Tuberculosis",
"C) Abscess",
"D) Erysipelas"
],
correct:2
},

{
question:"6- An abscess is:",
answers:[
"A) Collection of blood under the skin",
"B) Collection of pus under the skin or in an organ",
"C) Bone infection",
"D) Burn of the skin"
],
correct:1
},

{
question:"7- Carbuncle is:",
answers:[
"A) A group of boils",
"B) A skin allergy",
"C) A burn",
"D) A fracture"
],
correct:0
},

{
question:"8- Cellulitis usually does NOT lead directly to:",
answers:[
"A) Formation of an abscess",
"B) Blood poisoning",
"C) Skin burn",
"D) Spread of microbes"
],
correct:2
},

{
question:"9- Inflammation of wounds after operations usually appears on:",
answers:[
"A) First day",
"B) Second day",
"C) Third or fifth day",
"D) Tenth day"
],
correct:2
},

{
question:"10- Which of the following is a local symptom of inflammation?",
answers:[
"A) Increased pulse",
"B) Sweating",
"C) Pain at the site of inflammation",
"D) Chills"
],
correct:2
}

];

let currentQuestion=0;
let score=0;
let answered=false;

const question=document.getElementById("question");
const answers=document.getElementById("answers");
const nextBtn=document.getElementById("nextBtn");

function loadQuestion(){

answered=false;

answers.innerHTML="";

question.innerHTML=questions[currentQuestion].question;

questions[currentQuestion].answers.forEach((answer,index)=>{

const button=document.createElement("button");

button.innerHTML=answer;

button.onclick=function(){

if(answered) return;

answered=true;

const buttons=document.querySelectorAll("#answers button");

buttons.forEach(btn=>btn.disabled=true);

buttons[questions[currentQuestion].correct].style.background="green";

if(index===questions[currentQuestion].correct){

score++;

}else{

button.style.background="red";

}
 };

answers.appendChild(button);

});

}

nextBtn.onclick = function(){

if(!answered){
alert("من فضلك اختر إجابة أولاً.");
return;
}

currentQuestion++;

if(currentQuestion < questions.length){

loadQuestion();

}else{

let percentage = Math.round((score / questions.length) * 100);

let message = "";

if(percentage >= 50){

message = "🎉 مبروك! لقد نجحت.";

}else{

message = "❌ حاول مرة أخرى.";

}

question.innerHTML = "انتهى الاختبار";

answers.innerHTML = `
<h2>درجتك: ${score} / ${questions.length}</h2>
<h2>النسبة: ${percentage}%</h2>
<h3>${message}</h3>
`;

nextBtn.innerHTML = "إعادة الاختبار";

nextBtn.onclick = function(){

currentQuestion = 0;
score = 0;
answered = false;

nextBtn.innerHTML = "التالي";

nextBtn.onclick = arguments.callee;

loadQuestion();

};

}

};

loadQuestion(); 
