// ===============================
// Videos Loader
// بوابة التمريض
// ===============================

function loadVideos(grade, subject){

    db.collection("videos")
    .where("grade","==",grade)
    .where("subject","==",subject)
    .orderBy("createdAt","desc")
    .get()

    .then(function(snapshot){

        let html="";

        if(snapshot.empty){

            html=`

            <div class="card">

            لا توجد فيديوهات حتى الآن.

            </div>

            `;

        }

        snapshot.forEach(function(doc){

            const video=doc.data();

            html+=`

            <div class="card">

                <h3>🎥 ${video.title}</h3>

                <p><b>📖 المادة:</b> ${video.subject}</p>

                <p><b>📄 الشابتر:</b> ${video.chapter}</p>

                <a
                class="button-link"
                href="${video.url}"
                target="_blank">

                ▶️ مشاهدة على يوتيوب

                </a>

            </div>

            `;

        });

        document.getElementById("videos").innerHTML=html;

    })

    .catch(function(error){

        console.log(error);

        document.getElementById("videos").innerHTML=`

        <div class="card">

        حدث خطأ أثناء تحميل الفيديوهات.

        </div>

        `;

    });

}
