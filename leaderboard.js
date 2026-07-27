firebase.auth().onAuthStateChanged(function(user){

if(!user){

window.location.href = "login.html";
return;

}

loadLeaderboard();

});

function loadLeaderboard(){

db.collection("results")
.orderBy("percentage","desc")
.limit(20)
.get()

.then((snapshot)=>{

let html = "";

let rank = 1;

snapshot.forEach((doc)=>{

const data = doc.data();

let medal = "";

if(rank === 1){

medal = "🥇";

}else if(rank === 2){

medal = "🥈";

}else if(rank === 3){

medal = "🥉";

}else{

medal = "🏅";

}

html += `

<div class="card">

<h3>${medal} #${rank}</h3>

<p><b>👤 ${data.name}</b></p>

<p>🏫 ${data.grade}</p>

<p>📚 ${data.chapter}</p>

<p>📊 ${data.percentage}%</p>

</div>

`;

rank++;

});

if(snapshot.empty){

html = "<p>لا توجد نتائج حتى الآن.</p>";

}

document.getElementById("leaderboard").innerHTML = html;

})

.catch((error)=>{

console.log(error);

document.getElementById("leaderboard").innerHTML =
"<p>حدث خطأ أثناء تحميل النتائج.</p>";

});

}
