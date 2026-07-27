alert("dashboard.js شغال");

firebase.auth().onAuthStateChanged(function(user){

if(!user){

window.location.href = "login.html";
return;

}

db.collection("users").doc(user.uid).get()

.then((doc)=>{

const data = doc.data();

document.getElementById("studentName").innerHTML =
"👋 مرحبًا يا " + data.name;

document.getElementById("studentGrade").innerHTML =
"🏫 " + data.grade;

});

db.collection("results")

.where("uid","==",user.uid)

.get()

.then((snapshot)=>{

let totalScore = 0;

let highest = 0;

let lastQuiz = "لا يوجد";

let count = snapshot.size;

snapshot.forEach((doc)=>{

const result = doc.data();

totalScore += result.percentage;

if(result.percentage > highest){

highest = result.percentage;

}

lastQuiz = result.chapter;

});

document.getElementById("quizCount").innerHTML =
count;

if(count > 0){

document.getElementById("average").innerHTML =
Math.round(totalScore / count) + "%";

document.getElementById("highestScore").innerHTML =
highest + "%";

document.getElementById("lastQuiz").innerHTML =
lastQuiz;

}else{

document.getElementById("average").innerHTML =
"0%";

document.getElementById("highestScore").innerHTML =
"0%";

document.getElementById("lastQuiz").innerHTML =
"لا يوجد";

}

});

});
