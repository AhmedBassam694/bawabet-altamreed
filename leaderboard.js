const leaderboardDiv = document.getElementById("leaderboard");


function loadLeaderboard(grade){

leaderboardDiv.innerHTML = "⏳ جاري تحميل الترتيب...";


db.collection("results")
.where("grade","==",grade)
.get()

.then((snapshot)=>{


if(snapshot.empty){

leaderboardDiv.innerHTML =
"❌ لا توجد نتائج حتى الآن";

return;

}



let students = {};



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





let leaderboard = Object.values(students);



// حساب المتوسط النهائي

leaderboard.forEach(student=>{


let total = 0;


student.scores.forEach(score=>{

total += score;

});


student.average =
(total / student.scores.length).toFixed(2);



});




// ترتيب من الأعلى للأقل

leaderboard.sort((a,b)=>{

return b.average - a.average;

});




let html = "";



leaderboard.forEach((student,index)=>{


let medal = "";

if(index === 0){

medal = "🥇";

}else if(index === 1){

medal = "🥈";

}else if(index === 2){

medal = "🥉";

}else{

medal = "🏅";

}



html += `

<div class="card leaderboard-card">


<h2>

${medal} المركز ${index + 1}

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


html += `

<div class="card">


<h3>

${index + 1} 🏆 ${student.name}

</h3>


<p>

📚 الصف: ${student.grade}

</p>


<p>

⭐ المتوسط النهائي: ${student.average}%

</p>


<p>

📝 عدد الاختبارات: ${student.scores.length}

</p>


</div>


`;


});



leaderboardDiv.innerHTML = html;



})

.catch((error)=>{


console.log(error);


leaderboardDiv.innerHTML =
"حدث خطأ في تحميل البيانات";


});


}



// عرض الصف الثاني عند فتح الصفحة

loadLeaderboard("الصف الثاني الثانوي التمريض");
