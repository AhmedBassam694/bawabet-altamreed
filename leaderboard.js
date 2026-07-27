const leaderboardDiv = document.getElementById("leaderboard");


function loadLeaderboard(grade){

leaderboardDiv.innerHTML = "⏳ جاري تحميل الترتيب...";


db.collection("results")
.where("grade","==",grade)
.orderBy("percentage","desc")
.limit(20)
.get()

.then((snapshot)=>{


if(snapshot.empty){

leaderboardDiv.innerHTML =
"لا توجد نتائج حتى الآن";

return;

}


let html = "";


let rank = 1;


snapshot.forEach((doc)=>{


let data = doc.data();


html += `

<div class="card">

<h3>
🏅 ${rank} - ${data.name}
</h3>

<p>
📚 المادة: ${data.subject}
</p>

<p>
📖 ${data.chapter}
</p>

<p>
⭐ النتيجة: ${data.percentage}%
</p>

</div>

`;

rank++;


});


leaderboardDiv.innerHTML = html;


})

.catch((error)=>{

console.log(error);

leaderboardDiv.innerHTML =
"حدث خطأ في تحميل البيانات";

});


}


// تحميل الصف الثاني افتراضياً
loadLeaderboard("الصف الثاني الثانوي التمريض");
