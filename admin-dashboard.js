let currentUser = null;

firebase.auth().onAuthStateChanged(function(user){

    if(!user){
        window.location.href = "login.html";
        return;
    }

    currentUser = user;

    db.collection("users")
    .doc(user.uid)
    .get()
    .then((doc)=>{

        if(!doc.exists){
            alert("المستخدم غير موجود");
            window.location.href = "index.html";
            return;
        }

        const data = doc.data();

        if(data.role !== "admin"){
            alert("ليس لديك صلاحية الدخول.");
            window.location.href = "index.html";
            return;
        }

        loadDashboard();

    });

});


function loadDashboard(){

    Promise.all([
        db.collection("users").get(),
        db.collection("results").get()
    ])

    .then(([usersSnapshot, resultsSnapshot])=>{

        let totalUsers = usersSnapshot.size;
        let totalResults = resultsSnapshot.size;

        let firstYear = 0;
        let secondYear = 0;

        usersSnapshot.forEach(doc=>{

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
                <h3>👨‍🎓 عدد الطلاب</h3>
                <h2>${totalUsers}</h2>
            </div>

            <div class="card">
                <h3>📚 الصف الأول</h3>
                <h2>${firstYear}</h2>
            </div>

            <div class="card">
                <h3>📚 الصف الثاني</h3>
                <h2>${secondYear}</h2>
            </div>

            <div class="card">
                <h3>📝 عدد الاختبارات</h3>
                <h2>${totalResults}</h2>
            </div>
        `;

    });

}
