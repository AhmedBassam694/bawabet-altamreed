const leaderboard = document.getElementById("leaderboard");


// تحميل المتصدرين حسب الصف
function loadLeaderboard(grade){


leaderboard.innerHTML = `
<p>
⏳ جاري تحميل ترتيب ${grade}...
</p>
`;


// جلب كل النتائج
db.collection("results")
.get()

.then((snapshot)=>{


let students = {};


// تجميع درجات كل طالب
snapshot.forEach((doc)=>{


let data = doc.data();


// التأكد من الصف المطلوب
if(data.grade !== grade) return;



if(!students[data.uid]){


students[data.uid] = {

name:data.name,

grade:data.grade,

total:0,

count:0

};


}


// إضافة الدرجة
students[data.uid].total += data.percentage;

students[data.uid].count++;


});



// حساب المتوسط النهائي

let ranking = [];


for(let uid in students){


let student = students[uid];


student.average =
(student.total / student.count).toFixed(2);


ranking.push(student);


}



// ترتيب من الأعلى للأقل

ranking.sort((a,b)=>{

return b.average - a.average;

});



// عرض النتائج

if(ranking.length === 0){


leaderboard.innerHTML = `

<h3>
لا يوجد طلاب في هذا الصف حتى الآن
</h3>

`;

return;

}



leaderboard.innerHTML="";



ranking.forEach((student,index)=>{


let medal="🏅";


if(index===0) medal="🥇";

if(index===1) medal="🥈";

if(index===2) medal="🥉";



leaderboard.innerHTML += `

<div class="card" style="margin:15px 0;">


<h3>

${medal} ${student.name}

</h3>


<p>

🎓 ${student.grade}

</p>


<p>

📊 المتوسط النهائي:

<b>
${student.average}%
</b>

</p>


</div>

`;


});



})


.catch((error)=>{


console.log(error);


leaderboard.innerHTML=

"<p>حدث خطأ أثناء تحميل البيانات</p>";


});


}
