let currentUser = null;


firebase.auth().onAuthStateChanged(function(user){


if(user){

currentUser = user;

loadStudentDashboard();


}else{


window.location.href = "login.html";


}


});





function loadStudentDashboard(){



// جلب بيانات الطالب

db.collection("users")
.doc(currentUser.uid)
.get()


.then((doc)=>{


if(!doc.exists){

document.getElementById("studentInfo").innerHTML =
"❌ لا توجد بيانات للطالب";

return;

}



let userData = doc.data();



document.getElementById("studentInfo").innerHTML = `

<h3>
👨‍🎓 الاسم: ${userData.name}
</h3>

<p>
📚 الصف: ${userData.grade}
</p>

<p>
📧 البريد: ${userData.email}
</p>

`;



// جلب الاختبارات

return db.collection("results")

.where("uid","==",currentUser.uid)

.get()



.then((snapshot)=>{



if(snapshot.empty){


document.getElementById("results").innerHTML =
"❌ لم يتم عمل أي اختبارات حتى الآن";


document.getElementById("average").innerHTML =
"0%";


return;


}




let totalPercentage = 0;

let count = 0;


let html = "";



snapshot.forEach((doc)=>{


let data = doc.data();


totalPercentage += data.percentage;

count++;



html += `


<div class="card">


<h3>

📘 ${data.chapter}

</h3>


<p>

المادة:
${data.subject}

</p>


<p>

الدرجة:
${data.score}/${data.total}

</p>


<p>

⭐ النسبة:
${data.percentage}%

</p>


</div>


`;



});




// عرض النتائج

document.getElementById("results").innerHTML = html;




// حساب المتوسط النهائي


let average = (totalPercentage / count).toFixed(2);



document.getElementById("average").innerHTML = `


<h1>

⭐ ${average}%

</h1>


<p>

عدد الاختبارات:
${count}

</p>


`;



});



})


.catch((error)=>{


console.log(error);


document.getElementById("studentInfo").innerHTML =
"حدث خطأ في تحميل البيانات";


});


}
