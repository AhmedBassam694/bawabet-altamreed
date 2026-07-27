// ===============================
// Admin Dashboard
// بوابة التمريض
// ===============================

const ADMIN_UID = "4TbambkNbZUvsoc95q0cdy15fGn1";

firebase.auth().onAuthStateChanged(function(user){

    if(!user){
        window.location.href = "login.html";
        return;
    }

    if(user.uid !== ADMIN_UID){
        alert("ليس لديك صلاحية الدخول.");
        window.location.href = "index.html";
        return;
    }

    loadDashboard();

});

function loadDashboard(){

    Promise.all([

        db.collection("users").get(),

        db.collection("results").get()

    ])

    .then(function([usersSnapshot, resultsSnapshot]){

        loadStats(usersSnapshot, resultsSnapshot);

        loadStudents(usersSnapshot);

        loadResults(resultsSnapshot);

    })

    .catch(function(error){

        console.log(error);

        alert(error.message);

    });

}

// ===============================
// Statistics
// ===============================

function loadStats(usersSnapshot, resultsSnapshot){

    let firstYear = 0;
    let secondYear = 0;

    usersSnapshot.forEach(function(doc){

        const user = doc.data();

        if(user.grade === "الصف الأول الثانوي التمريض"){
            firstYear++;
        }

        if(user.grade === "الصف الثاني الثانوي التمريض"){
            secondYear++;
        }

    });

    document.getElementById("stats").innerHTML = `

<div class="card">

<h2>👨‍🎓 عدد الطلاب</h2>

<h1>${usersSnapshot.size}</h1>

</div>

<div class="card">

<h2>📘 الصف الأول</h2>

<h1>${firstYear}</h1>

</div>

<div class="card">

<h2>📗 الصف الثاني</h2>

<h1>${secondYear}</h1>

</div>

<div class="card">

<h2>📝 عدد الاختبارات</h2>

<h1>${resultsSnapshot.size}</h1>

</div>

`;

}

// ===============================
// Students
// ===============================

function loadStudents(usersSnapshot){

    let html = "";

    usersSnapshot.forEach(function(doc){

        const user = doc.data();

        html += `

<div class="card">

<h3>👨‍🎓 ${user.name || "بدون اسم"}</h3>

<p>📧 ${user.email || "-"}</p>

<p>📚 ${user.grade || "-"}</p>

</div>

`;

    });

    document.getElementById("students").innerHTML = html;

}

// ===============================
// Results
// ===============================

function loadResults(resultsSnapshot){

    let html = "";

    resultsSnapshot.forEach(function(doc){

        const result = doc.data();

        html += `

<div class="card">

<h3>👨‍🎓 ${result.name}</h3>

<p>📚 ${result.grade}</p>

<p>📖 ${result.subject}</p>

<p>📄 ${result.chapter}</p>

<p>⭐ ${result.percentage}%</p>

</div>

`;

    });

    if(html === ""){

        html = `

<div class="card">

لا توجد نتائج حتى الآن.

</div>

`;

    }

    document.getElementById("results").innerHTML = html;

}
