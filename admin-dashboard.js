// ===============================
// Admin Dashboard
// بوابة التمريض
// ===============================

const ADMIN_UID = "4TbambkNbZUvsoc95q0cdy15fGn1";

let allStudents = [];
let allResults = [];

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

        allStudents = [];
        allResults = [];

        usersSnapshot.forEach(function(doc){

            let student = doc.data();
            student.id = doc.id;

            allStudents.push(student);

        });

        resultsSnapshot.forEach(function(doc){

            let result = doc.data();
            result.id = doc.id;

            allResults.push(result);

        });

        loadStats();

        loadStudents(allStudents);

        loadResults(allResults);

    })

    .catch(function(error){

        console.log(error);

        alert(error.message);

    });

}

function loadStats(){

    let firstYear = 0;
    let secondYear = 0;

    allStudents.forEach(function(student){

        if(student.grade === "الصف الأول الثانوي التمريض"){

            firstYear++;

        }

        if(student.grade === "الصف الثاني الثانوي التمريض"){

            secondYear++;

        }

    });

    document.getElementById("stats").innerHTML = `

    <div class="card">

        <h3>👨‍🎓 عدد الطلاب</h3>

        <h1>${allStudents.length}</h1>

    </div>

    <div class="card">

        <h3>📘 الصف الأول</h3>

        <h1>${firstYear}</h1>

    </div>

    <div class="card">

        <h3>📗 الصف الثاني</h3>

        <h1>${secondYear}</h1>

    </div>

    <div class="card">

        <h3>📝 عدد الاختبارات</h3>

        <h1>${allResults.length}</h1>

    </div>

    `;

}
// ===============================
// Students
// ===============================

function loadStudents(students){

    renderStudents(students);

}

function renderStudents(students){

    let html = "";

    students.forEach(function(student){

        html += `

        <div class="card student-card">

            <h3>👨‍🎓 ${student.name || "بدون اسم"}</h3>

            <p><b>📧 البريد:</b> ${student.email || "-"}</p>

            <p><b>📚 الصف:</b> ${student.grade || "-"}</p>

            <div style="margin-top:15px;display:flex;gap:10px;flex-wrap:wrap;">

                <button
                onclick="viewStudent('${student.id}')">
                👁️ عرض
                </button>

                <button
                onclick="editStudent('${student.id}')">
                ✏️ تعديل
                </button>

                <button
                onclick="deleteStudent('${student.id}')">
                🗑️ حذف
                </button>

            </div>

        </div>

        `;

    });

    if(html === ""){

        html = `

        <div class="card">

        لا يوجد طلاب.

        </div>

        `;

    }

    document.getElementById("students").innerHTML = html;

}

// ===============================
// Search
// ===============================

function searchStudents(){

    let keyword = document
    .getElementById("searchStudent")
    .value
    .toLowerCase();

    let filtered = allStudents.filter(function(student){

        let name = (student.name || "").toLowerCase();
        let email = (student.email || "").toLowerCase();

        return name.includes(keyword) ||
               email.includes(keyword);

    });

    renderStudents(filtered);

}

// ===============================
// Student Actions
// ===============================

function viewStudent(id){

    let student = allStudents.find(function(s){

        return s.id === id;

    });

    if(!student){

        return;

    }

    alert(

`الاسم: ${student.name}

البريد: ${student.email}

الصف: ${student.grade}`

    );

}

function editStudent(id){

    alert("سيتم إضافة تعديل بيانات الطالب قريبًا.");

}

function deleteStudent(id){

    if(!confirm("هل تريد حذف الطالب؟")){

        return;

    }

    db.collection("users")
    .doc(id)
    .delete()

    .then(function(){

        alert("تم حذف الطالب.");

        loadDashboard();

    })

    .catch(function(error){

        alert(error.message);

    });

                                }
// ===============================
// Results
// ===============================

function loadResults(results){

    results.sort(function(a,b){

        return b.percentage - a.percentage;

    });

    let html = "";

    results.forEach(function(result,index){

        let medal = "🏅";

        if(index == 0) medal = "🥇";
        if(index == 1) medal = "🥈";
        if(index == 2) medal = "🥉";

        html += `

        <div class="card">

            <h3>${medal} ${result.name}</h3>

            <p><b>📚 الصف:</b> ${result.grade}</p>

            <p><b>📖 المادة:</b> ${result.subject}</p>

            <p><b>📄 الشابتر:</b> ${result.chapter}</p>

            <p><b>⭐ الدرجة:</b> ${result.percentage}%</p>

            <button onclick="deleteResult('${result.id}')">

            🗑️ حذف النتيجة

            </button>

        </div>

        `;

    });

    if(html==""){

        html=`

        <div class="card">

        لا توجد نتائج حتى الآن.

        </div>

        `;

    }

    document.getElementById("results").innerHTML=html;

}

// ===============================
// Delete Result
// ===============================

function deleteResult(id){

    if(!confirm("هل تريد حذف هذه النتيجة؟")){

        return;

    }

    db.collection("results")
    .doc(id)
    .delete()

    .then(function(){

        alert("تم حذف النتيجة.");

        loadDashboard();

    })

    .catch(function(error){

        alert(error.message);

    });

}
// ===============================
// Top Students
// ===============================

function getTopStudents(){

    let students={};

    allResults.forEach(function(result){

        if(!students[result.uid]){

            students[result.uid]={

                name:result.name,

                total:0,

                count:0

            };

        }

        students[result.uid].total+=result.percentage;

        students[result.uid].count++;

    });

    let list=[];

    Object.values(students).forEach(function(student){

        student.average=(student.total/student.count).toFixed(2);

        list.push(student);

    });

    list.sort(function(a,b){

        return b.average-a.average;

    });

    console.log(list);

    }
