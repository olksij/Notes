var notes = new Array(); var data = new Array(); var notes_len_px = 0;

function CreateNote(){
    var title = document.getElementById("add-note-title").value; var description = document.getElementById("add-note-description").value;
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
        version: FluxAppBuild,
        added: "guest"
    });
    
    console.clear(); db.collection("gnotes").get().then((querySnapshot) => {querySnapshot.forEach((doc) => { console.log(doc.id,doc.data());});});
    LoadNotes(true);
}

async function LoadNotes(reload){
    var db = firebase.firestore();
    
    if (reload==true){ for (var i=1; i<=notes.length; i++){ var element = document.getElementById(notes[i-1]+"-NoteCard"); element.parentNode.removeChild(element); } }

    data = new Array(); notes = new Array();

    db.collection("gnotes").onSnapshot({ includeMetadataChanges: true }, function(snapshot) {snapshot.docChanges().forEach(function(change) { var source = snapshot.metadata.fromCache ? "local cache" : "server"; console.log(change.doc.id,source,change.doc.data()); notes.push(change.doc.id); data.push(change.doc.data()); RenderNote(notes.length); }); });
}

function RenderNote(i){
    var NoteCard = document.createElement("div"); NoteCard.style.height = "90px"; NoteCard.style.position = "absolute"; NoteCard.style.left = "20px"; NoteCard.style.right = "20px"; NoteCard.style.top = (110*(i-1)+96)+"px"; NoteCard.setAttribute('class', 'FluxAppLiteCard'); NoteCard.setAttribute('id', notes[i-1]+"-NoteCard");
    document.getElementById("NoteList").appendChild(NoteCard);

    var NoteTitle = document.createElement("p"); NoteTitle.innerHTML = data[i-1].title; NoteTitle.setAttribute('class', 'NoteTitle'); NoteTitle.setAttribute('id', notes[i-1]+"-NoteTitle");
    document.getElementById(notes[i-1]+"-NoteCard").appendChild(NoteTitle);

    var NoteDescription = document.createElement("p"); var ds = data[i-1].description; if (ds.length > 37) {var dscr = ds.slice(0,40)+"..."; } else { var dscr = ds;}NoteDescription.innerHTML = dscr;NoteDescription.setAttribute('class', 'NoteDescription'); NoteDescription.setAttribute('id', notes[i-1]+"-NoteDescription");
    document.getElementById(notes[i-1]+"-NoteCard").appendChild(NoteDescription);

    var NoteDate = document.createElement("p"); NoteDate.innerHTML = data[i-1].date; NoteDate.setAttribute('class', 'NoteDate'); NoteDate.setAttribute('id', notes[i-1]+"-NoteDate");
    document.getElementById(notes[i-1]+"-NoteCard").appendChild(NoteDate);
}