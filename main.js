function Start() {
    LoadGNotes();
}

function LoadGNotes(){
    var db = firebase.firestore();

    db.collection("gnotes").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            console.log(doc.id,doc.data());
        });
    });

    document.getElementById("add-note-window").style.visibility = "hidden";

}

function CreateNote(){
    var title = document.getElementById("add-note-title").value;
    var description = document.getElementById("add-note-description").value;
    document.getElementById("add-note-window").style.visibility = "hidden"
    AddNote(title, description)
}

function AddNote(title, description){
    var db = firebase.firestore();

    db.collection("gnotes").add({
        title: title,
        description: description,
        date: new Date().getDate()+"."+(new Date().getMonth()+1)+"."+new Date().getFullYear(),
        time: new Date().getHours()+":"+new Date().getMinutes(),
        version: app_info.version,
        versionReleased: app_info.version_released,
        added: "guest"
    });
    
    console.clear();
    db.collection("gnotes").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            console.log(doc.id,doc.data());
        });
    });

}

function DialogCreateNote(){
    document.getElementById("add-note-window").style.visibility = "visible";
}

function DialogAccount(){
}

