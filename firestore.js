var notes = new Array(); var data = new Array();

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
        url: window.location.pathname,
        version: FluxAppBuild,
    });
    
    console.clear(); db.collection("gnotes").get().then((querySnapshot) => {querySnapshot.forEach((doc) => { console.log(doc.id,doc.data());});});
    LoadNotes(true);
}

async function LoadNotes(reload){ var db = firebase.firestore(); if (reload==true){ for (var i=1; i<=notes.length; i++){ var element = document.getElementById(notes[i-1]+"-NoteCard"); element.parentNode.removeChild(element); } }
    data = new Array(); notes = new Array(); g_r_height = 96;
    db.collection("gnotes").onSnapshot({ includeMetadataChanges: true }, function(snapshot) {snapshot.docChanges().forEach(function(change) { var source = snapshot.metadata.fromCache ? "local cache" : "server"; console.log(change.doc.id,source,change.doc.data()); notes.push(change.doc.id); data.push(change.doc.data()); RenderNote(notes.length); }); });
}

var g_r_height = 96;
function RenderNote(i){
    var NoteCard = document.createElement("div"); NoteCard.style.position = "absolute"; NoteCard.style.left = "20px"; NoteCard.style.right = "20px"; NoteCard.style.top = 96+(i-1)*110+"px"; NoteCard.setAttribute('class', 'NoteCard'); NoteCard.setAttribute('id', notes[i-1]+"-NoteCard"); NoteCard.setAttribute('onclick', "OpenNote('"+notes[i-1]+"')"); NoteCard.setAttribute('onmouseover', "NoteHover('"+notes[i-1]+"')"); NoteCard.setAttribute('onmouseout', "NoteMouseOut('"+notes[i-1]+"')");
    document.getElementById("NoteList").appendChild(NoteCard);

    var NoteTitle = document.createElement("p"); NoteTitle.innerHTML = data[i-1].title; NoteTitle.setAttribute('class', 'NoteTitle'); NoteTitle.setAttribute('id', notes[i-1]+"-NoteTitle");
    document.getElementById(notes[i-1]+"-NoteCard").appendChild(NoteTitle);

    var NoteDescription = document.createElement("p"); NoteDescription.innerHTML = data[i-1].description; NoteDescription.setAttribute('class', 'NoteDescription'); NoteDescription.setAttribute('id', notes[i-1]+"-NoteDescription");
    document.getElementById(notes[i-1]+"-NoteCard").appendChild(NoteDescription);

    var NoteDate = document.createElement("p"); NoteDate.innerHTML = data[i-1].date; NoteDate.setAttribute('class', 'NoteDate'); NoteDate.setAttribute('id', notes[i-1]+"-NoteDate");
    document.getElementById(notes[i-1]+"-NoteCard").appendChild(NoteDate);

    var NoteCardC = document.getElementById(notes[i-1]+"-NoteCard"); NoteCardC.style.height = (76 + NoteDescription.offsetHeight)+"px";    NoteCardC.style.top = g_r_height+"px";  g_r_height = g_r_height + 20 + NoteCardC.offsetHeight;  document.getElementById(notes[i-1]+"-NoteCard").style.top = NoteCardC.style.top; document.getElementById(notes[i-1]+"-NoteCard").style.height = NoteCardC.style.height;
}