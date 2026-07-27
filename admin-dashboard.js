alert("أنا داخل الملف الصحيح");

firebase.auth().onAuthStateChanged(function(user){

    if(!user){
        alert("مفيش مستخدم مسجل دخول");
        return;
    }

    alert("المستخدم: " + user.email);

    db.collection("users").get()

    .then(function(snapshot){

        alert("عدد المستخدمين = " + snapshot.size);

    })

    .catch(function(error){

        alert("الخطأ: " + error.message);

    });

});
