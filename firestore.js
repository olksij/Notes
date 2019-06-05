var notes = new Array();
var data = new Array();
var db = firebase.firestore();

async function SyncNotes() {
    var doc = await db.collection("notes").doc("users").collection(account.email).doc("UserInfo").get();
    if (!doc.exists) {
        db.collection("notes").doc("users").collection(account.email).add({
            title: "Welcome to Notes!",
            description: "It's your private space now. Introdiction is coming soon.",
            date: new Date().getDate() + "." + (new Date().getMonth() + 1) + "." + new Date().getFullYear(),
            time: new Date().getHours() + ":" + new Date().getMinutes(),
            url: window.location.href,
            user: account.displayName,
            email: account.email,
            version: FluxAppBuild,
        });

        db.collection("notes").doc("users").collection(account.email).doc("UserInfo").set({
            name: account.email,
        })
    }

    db.collection("notes").doc("users").collection(account.email).onSnapshot(/*{ includeMetadataChanges: true }, */function(snapshot) {
        snapshot.docChanges().forEach(function(change) {
            if (change.doc.id!="UserInfo") {
                if (change.type === "added") {
                    console.log("%c[+]",'color: green', change.doc.id, "-", snapshot.metadata.fromCache ? "cache" : "server");
                    notes.push(change.doc.id);
                    data.push(change.doc.data());   
                    RenderNote(notes.length); 
                }
    
                if (change.type === "modified") {
                    console.log("%c[#]",'color: yellow', change.doc.id, "-", snapshot.metadata.fromCache ? "cache" : "server");
                    ClearNote(change.doc.id);
                    notes.push(change.doc.id); data.push(change.doc.data());   
                    RenderNote(notes.length); 
                }
    
                if (change.type === "removed") {
                    console.log("%c[-]", 'color: red', change.doc.id, "-", snapshot.metadata.fromCache ? "cache" : "server");
                    ClearNote(change.doc.id);
                }
                ResizeNote();
                setTimeout(function() {
                    ResizeNote();
                }, 300);    
            }
        });
    });
}

function CreateNote() {
    var title = document.getElementById("add-note-title").value;
    var description = document.getElementById("add-note-description").value;
    document.getElementById("add-note-window").style.visibility = "hidden";
    AddNote(title, description);
}

function DeleteNote() {
    db.collection("notes").doc("users").collection(account.email).doc(OpenedNote).delete().catch(function(error) {
        console.error("[!] Error removing " + OpenedNote + ": ", error);
    });
}

function AddNote(title, description) {
    db.collection("notes").doc("users").collection(account.email).add({
        title: title,
        description: description,
        date: new Date().getDate() + "." + (new Date().getMonth() + 1) + "." + new Date().getFullYear(),
        time: new Date().getHours() + ":" + new Date().getMinutes(),
        url: window.location.pathname,
        user: account.displayName,
        email: account.email,
        version: FluxAppBuild,
    });
    console.log('%c[i]', 'color: blue', 'Added note');
}

function ClearNote(a) {
    document.getElementById(a+"-NoteCard").remove();
    notes.splice(notes.indexOf(a), 1);

}

var g_r_height = 96;
function RenderNote(i) {
    var NoteCard = document.createElement("div");
    NoteCard.style.position = "absolute";
    NoteCard.style.left = "20px";
    NoteCard.style.right = "20px";
    NoteCard.style.top = 96 + (i - 1) * 110 + "px";
    NoteCard.setAttribute('class', 'NoteCard');
    NoteCard.setAttribute('id', notes[i - 1] + "-NoteCard");
    NoteCard.setAttribute('onclick', "OpenNote('" + notes[i - 1] + "')");
    NoteCard.setAttribute('onmouseover', "NoteHover('" + notes[i - 1] + "')");
    NoteCard.setAttribute('onmouseout', "NoteMouseOut('" + notes[i - 1] + "')");
    document.getElementById("NoteList").appendChild(NoteCard);

    var NoteTitle = document.createElement("p");
    NoteTitle.innerHTML = data[i - 1].title;
    NoteTitle.setAttribute('class', 'NoteTitle');
    NoteTitle.setAttribute('id', notes[i - 1] + "-NoteTitle");
    document.getElementById(notes[i - 1] + "-NoteCard").appendChild(NoteTitle);

    var NoteDescription = document.createElement("p");
    NoteDescription.innerHTML = data[i - 1].description;
    NoteDescription.setAttribute('class', 'NoteDescription');
    NoteDescription.setAttribute('id', notes[i - 1] + "-NoteDescription");
    document.getElementById(notes[i - 1] + "-NoteCard").appendChild(NoteDescription);

    var NoteDate = document.createElement("p");
    NoteDate.innerHTML = data[i - 1].date;
    NoteDate.setAttribute('class', 'NoteDate');
    NoteDate.setAttribute('id', notes[i - 1] + "-NoteDate");
    document.getElementById(notes[i - 1] + "-NoteCard").appendChild(NoteDate);

    var NoteCardC = document.getElementById(notes[i - 1] + "-NoteCard");
    NoteCardC.style.height = (76 + NoteDescription.offsetHeight) + "px";
    NoteCardC.style.top = g_r_height + "px";
    g_r_height = g_r_height + 20 + NoteCardC.offsetHeight;
    document.getElementById(notes[i - 1] + "-NoteCard").style.top = NoteCardC.style.top;
    document.getElementById(notes[i - 1] + "-NoteCard").style.height = NoteCardC.style.height;
}