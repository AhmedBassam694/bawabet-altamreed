const leaderboardDiv = document.getElementById("leaderboard");


// تحميل لوحة المتصدرين حسب الصف
function loadLeaderboard(grade){

leaderboardDiv.innerHTML = "⏳ جاري تحميل الترتيب...";


db.collection("results")
.where("grade","==",grade)
.get()

.then((snapshot)=>{


if(snapshot.empty){

leaderboardDiv.innerHTML =
"❌ لا توجد نتائج لهذا الصف حتى الآن";

return;

}



let students = {};


// تجميع نتائج كل طالب

snapshot.forEach((doc)=>{

let data = doc.data();


if(!students[data.uid]){

students[data.uid] = {

name:data.name,

grade:data.grade,

scores:[]

};

}


students[data.uid].scores.push(data.percentage);


});




// حساب المتوسط النهائي لكل طالب

let leaderboard = Object.values(students);


leaderboard.forEach(student=>{


let sum = 0;


student.scores.forEach(score=>{

sum += score;

});


student.average =
(sum / student.scores.length).toFixed(2);


});




// ترتيب الطلاب

leaderboard.sort((a,b)=>{

return b.average - a.average;

});




// عرض البيانات

let html = "";


leaderboard.forEach((student,index)=>{


let medal;


if(index === 0){

medal="🥇";

}else if(index === 1){

medal="🥈";

}else if(index === 2){

medal="🥉";

}else{

medal="🏅";

}



html += `

<div class="card leaderboard-card">


<h2>

${medal} المركز ${index+1}

</h2>


<h3>

👨‍🎓 ${student.name}

</h3>


<p>

📚 ${student.grade}

</p>


<div class="leader-score">

⭐ المتوسط النهائي

<br>

<b>

${student.average}%

</b>


</div>


<p>

📝 عدد الاختبارات:
${student.scores.length}

</p>


</div>


`;



});



leaderboardDiv.innerHTML = html;


})


.catch((error)=>{


console.log(error);


leaderboardDiv.innerHTML =
"❌ حدث خطأ في تحميل لوحة المتصدرين";


});


}



// فتح الصفحة على الصف الثاني افتراضيًا

loadLeaderboard("الصف الثاني الثانوي التمريض");
