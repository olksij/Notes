function Start() {
    LoadGNotes();

    document.getElementById("SearchBar").style.width = ((document.getElementById('body').offsetWidth)-116-76)+"px";
    document.getElementById("AddNoteTitle").style.width = ((document.getElementById('body').offsetWidth)-80)+"px";
    document.getElementById("AddNoteDescription").style.width = ((document.getElementById('body').offsetWidth)-80)+"px";

    document.getElementById("AddNoteWindow").style.visibility = "hidden";
}

function Resized() {
    document.getElementById("AddNoteTitle").style.width = ((document.getElementById('body').offsetWidth)-60-20)+"px";
    document.getElementById("AddNoteDescription").style.width = ((document.getElementById('body').offsetWidth)-60-20)+"px";
    document.getElementById("SearchBar").style.width = ((document.getElementById('body').offsetWidth)-116-76)+"px";
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
    document.getElementById("add-note-window").style.visibility = "hidden";
    AddNote(title, description);
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
function CloseAddNoteWindow(){
    document.getElementById("add-note-window").style.visibility = "hidden";
}

function DialogAccount(){
}

function MobileDialogCreateNote(){
    document.getElementById("AddNoteWindow").style.visibility = "visible";
}

function CreateNoteMobile(){
    document.getElementById("AddNoteWindow").style.visibility = "hidden";
    var title = document.getElementById("AddNoteTitle").value;
    var description = document.getElementById("AddNoteDescription").value;
    AddNote(title,description);
}

function CloseDialogCreateNote(){
    document.getElementById("AddNoteWindow").style.visibility = "hidden";
}
