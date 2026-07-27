firebase.auth().onAuthStateChanged(function(user){

if(!user){

window.location.href = "login.html";
return;

}

db.collection("users").doc(user.uid).get()

.then(function(doc){

if(doc.exists){

const data = doc.data();

document.getElementById("studentName").innerHTML =
"👋 مرحبًا يا " + data.name;

document.getElementById("studentGrade").innerHTML =
"🏫 " + data.grade;

}else{

document.getElementById("studentName").innerHTML =
"👋 الطالب";

document.getElementById("studentGrade").innerHTML =
"🏫 لم يتم العثور على البيانات";

}

})

.catch(function(error){

console.log(error);

alert("حدث خطأ أثناء تحميل بيانات الطالب");

});

db.collection("results")
.where("uid","==",user.uid)
.get()

.then(function(snapshot){

let totalScore = 0;
let highest = 0;
let lastQuiz = "لا يوجد";
let count = snapshot.size;

snapshot.forEach(function(doc){

const result = doc.data();

totalScore += result.percentage;

if(result.percentage > highest){

highest = result.percentage;

}

lastQuiz = result.chapter;

});

document.getElementById("quizCount").innerHTML = count;

if(count > 0){

document.getElementById("average").innerHTML =
Math.round(totalScore / count) + "%";

document.getElementById("highestScore").innerHTML =
highest + "%";

document.getElementById("lastQuiz").innerHTML =
lastQuiz;

}else{

document.getElementById("average").innerHTML = "0%";
document.getElementById("highestScore").innerHTML = "0%";
document.getElementById("lastQuiz").innerHTML = "لا يوجد";

}

})

.catch(function(error){

console.log(error);

alert("حدث خطأ أثناء تحميل نتائج الاختبارات");

});

});
