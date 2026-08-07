const leaderboardDiv = document.getElementById("leaderboard");

function loadLeaderboard(grade){

leaderboardDiv.innerHTML="⏳ جاري تحميل البيانات...";

db.collection("results")

.where("grade","==",grade)

.get()

.then(function(snapshot){

if(snapshot.empty){

leaderboardDiv.innerHTML="❌ لا توجد نتائج";

return;

}

let students={};

// تجميع أفضل درجة لكل Chapter لكل طالب

snapshot.forEach(function(doc){

let data=doc.data();

let code=data.studentCode;

if(!students[code]){

students[code]={

studentCode:code,

name:data.name,

grade:data.grade,

chapters:{}

};

}

if(

!students[code].chapters[data.chapter] ||

data.percentage>

students[code].chapters[data.chapter].percentage

){

students[code].chapters[data.chapter]=data;

}

});

let leaderboard=[];

// حساب المتوسط النهائي

for(let code in students){

let student=students[code];

let total=0;

let count=0;

for(let chapter in student.chapters){

total+=student.chapters[chapter].percentage;

count++;

}

student.average=(total/count).toFixed(2);

student.count=count;

leaderboard.push(student);

}

// ترتيب الطلاب

leaderboard.sort(function(a,b){

return b.average-a.average;

});

// عرض البيانات

let html="";

leaderboard.forEach(function(student,index){

let medal="🏅";

if(index==0) medal="🥇";
if(index==1) medal="🥈";
if(index==2) medal="🥉";

html+=`

<div class="card leaderboard-card">

<h2>${medal} المركز ${index+1}</h2>

<h3>👨‍🎓 ${student.name}</h3>

<p>📚 ${student.grade}</p>

<p>⭐ المتوسط النهائي: <b>${student.average}%</b></p>

<p>📝 عدد الاختبارات: ${student.count}</p>

</div>

`;

});

leaderboardDiv.innerHTML=html;

})

.catch(function(error){

console.log(error);

leaderboardDiv.innerHTML="❌ حدث خطأ";

});

}

loadLeaderboard("الصف الثاني الثانوي التمريض");
