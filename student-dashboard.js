// ===============================
// بيانات الطالب
// ===============================

const studentCode = localStorage.getItem("studentCode");

if (!studentCode) {
    window.location.href = "login.html";
}

const studentInfo = document.getElementById("studentInfo");
const resultsDiv = document.getElementById("results");
const averageDiv = document.getElementById("average");

loadStudentDashboard();

function loadStudentDashboard() {

    db.collection("students")
    .doc(studentCode)
    .get()

    .then(function(doc){

        if(!doc.exists){

            studentInfo.innerHTML = "❌ الطالب غير موجود";

            return;
        }

        const student = doc.data();

        studentInfo.innerHTML = `

        <h3>👨‍🎓 ${student.name}</h3>

        <p>📚 ${student.grade}</p>

        <p>🆔 ${studentCode}</p>

        `;

        return db.collection("results")
        .where("studentCode","==",studentCode)
        .get();

    })

    .then(function(snapshot){

        if(!snapshot){

            return;
        }

        if(snapshot.empty){

            resultsDiv.innerHTML =
            "<p>❌ لم يتم حل أي اختبار حتى الآن</p>";

            averageDiv.innerHTML =
            "<h2>0%</h2>";

            return;
        }

        let chapters = {};

        snapshot.forEach(function(doc){

            let data = doc.data();

            if(
                !chapters[data.chapter] ||
                data.percentage > chapters[data.chapter].percentage
            ){

                chapters[data.chapter] = data;

            }

        });

        let html = "";

        let total = 0;

        let count = 0;
              for (let chapter in chapters) {

            let result = chapters[chapter];

            total += result.percentage;
            count++;

            html += `

            <div class="card">

                <h3>📘 ${result.chapter}</h3>

                <p>📚 المادة: ${result.subject}</p>

                <p>✅ الدرجة: ${result.score} / ${result.total}</p>

                <p>⭐ النسبة: ${result.percentage}%</p>

            </div>

            `;

        }

        resultsDiv.innerHTML = html;

        let average = 0;

        if(count > 0){

            average = (total / count).toFixed(2);

        }

        averageDiv.innerHTML = `

        <h2>⭐ ${average}%</h2>

        <p>

        عدد الاختبارات المختلفة: ${count}

        </p>

        `;

    })

    .catch(function(error){

        console.log(error);

        studentInfo.innerHTML =

        "<p>❌ حدث خطأ أثناء تحميل البيانات</p>";

    });

}
