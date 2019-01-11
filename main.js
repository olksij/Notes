
function LoadGNotes(){
    var db = firebase.firestore(); db.settings({timestampsInSnapshots: true});

    db.collection("gnotes").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            console.log(doc.id,doc.data());
        });
    });

    document.getElementById("add-note-shadow").style.visibility = "hidden";

}

function CreateNote(){
    var title = document.getElementById("add-note-title").value;
    document.getElementById("add-note-shadow").style.visibility = "hidden";
    AddNote(title)
}

function AddNote(notetext){
    var db = firebase.firestore(); db.settings({timestampsInSnapshots: true});

    db.collection("gnotes").add({
        title: notetext,
        date: new Date().getDate()+"."+(new Date().getMonth()+1)+"."+new Date().getFullYear(),
        time: new Date().getHours()+":"+new Date().getMinutes(),
        version: app_info.version,
        versionReleased: app_info.version_released,
        added: "guest"
    });
}

function DialogCreateNote(){
    document.getElementById("add-note-shadow").style.visibility = "visible";
}
