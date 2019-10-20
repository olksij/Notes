var FirestoreDB = firebase.firestore(); FirestoreDB.enablePersistence();
var fromVersion; var notesCounter;
if (typeof(AppOnline)!='undefined') UpdateConnection(); if (AccountEmail) SyncFData();

async function LoadUserData() {
    if (RealtimeNotes == 'False') {
        SyncDBNotes('clear');
        await LoadNotesOnce();
        document.getElementById('body').style.overflowY = 'auto';
        //document.getElementById('SplashScreen').style.display = 'none';
        if (userInfo) userInfo.notesCounter = notes.length;
        if (userInfo) {console.log('[i] Notes Loaded'); ANSync(1);}
    } else {
        if (userInfo==undefined)
        var usertInfo = await FirestoreDB.collection("data").doc('notes').collection(AccountEmail).doc('#userInfo').get(); userInfo = usertInfo.data();
        console.log('[i] Connected to Firestore'); ANSync(0.5);
        SyncDBNotes('clear');   
    }
}

function ANSync(value){
    document.getElementById('ANSBarActive').style.width = document.getElementById('ANSBar').offsetWidth*value+'px';
    if(value==1){
        document.getElementById('ANS').style.marginTop='-81px';
        document.getElementById('ANS').style.opacity='0'
    }
}

async function LoadNotesOnce(){
    await FirestoreDB.collection("data").doc('notes').collection(AccountEmail).get().then(function(querySnapshot) {
        console.log('[i] Connected to Firestore:'); ANSync(0.5);
        document.getElementById('ANSBarActive').style.width=document.getElementById('ANSBar').offsetWidth*0.5+'px';
        querySnapshot.forEach(function(doc) {
            if (doc.id != '#userInfo'){
                console.log('[+] Notes:', (doc.id + ( userInfo == undefined || userInfo.notesCounter == 0 ? '' : (' - ' + (Math.round((notes.length+1)/userInfo.notesCounter*100) + '%'))) + ' - ' + (querySnapshot.metadata.fromCache ? "cache" : "server")));
                notes.push(doc.id);
                data.push(doc.data());  
                SyncDBNotes('add',{id: notes[notes.length-1], data: data[data.length-1]}) 
                RenderNote(notes.length);     
            } else { userInfo = doc.data(); }
        });
    })
}

function StartRealtimeNotes(){
    FirestoreDB.collection("data").doc('notes').collection(AccountEmail).onSnapshot({ includeMetadataChanges: true }, function(snapshot) {
        snapshot.docChanges().forEach(function(change) {
            if (change.doc.id!="#userInfo") {
                if (change.type === "added") {
                    console.log('[+] Notes:', (change.doc.id + ( notesCounter == 0 ? '' : (' - ' + (Math.round((notes.length+1)/notesCounter*100) + '%'))) + ' - ' + (snapshot.metadata.fromCache ? "cache" : "server")));
                    ANSync(Math.round((notes.length+1)/notesCounter));
                    notes.push(change.doc.id);
                    data.push(change.doc.data()); 
                    SyncDBNotes('add',{id: notes[notes.length-1], data: data[data.length-1]})
                    RenderNote(notes.length); 
                } if (change.type === "modified") {
                    console.log('[/] Notes:', change.doc.id + " - " + snapshot.metadata.fromCache ? "cache" : "server");
                    ClearNote(change.doc.id);
                    notes.push(change.doc.id); data.push(change.doc.data()); 
                    SyncDBNotes('remove',notes[notes.length-1]);
                    SyncDBNotes('add',{id: notes[notes.length-1], data: data[data.length-1]})
                    RenderNote(notes.length); 
                } if (change.type === "removed") {
                    console.log('[-] Notes:', change.doc.id + " - " + snapshot.metadata.fromCache ? "cache" : "server");
                    SyncDBNotes('remove',notes[notes.length-1]);
                    ClearNote(change.doc.id);
                } 
                ResizeNote(); setTimeout(function() { ResizeNote(); }, 300);   
                userInfo = {
                    name: AccountEmail,
                    notesCounter: notes.length,
                    version: FluxAppBuild,
                    folders: userInfo.folders
                };   
                FirestoreDB.collection("data").doc('notes').collection(AccountEmail).doc('#userInfo').set(userInfo)
                if (notesCounter == notes.length) { console.log('[i] Notes Loaded'); ANSync(1); }
            }
        });
    });    
}

async function SyncFData() {
    if (!AccountEmail) return;
    ANSync(0.2);
    await LoadUserData();

    if (!userInfo) {
        userInfo = {
            name: AccountEmail,
            notesCounter: 0,
            version: FluxAppBuild,
            folders: 0
        }
        AddNote("Welcome to Notes!","It's your private space now. Introdiction is coming soon. Cause of database rebasing progress, you can lose your notes sometimes.",'firestore');
        console.log('[i] Account Created');
    }

    if (userInfo.version == undefined) fromVersion = 0; else fromVersion = parseInt(userInfo.version); 
    try{CheckUpdates(fromVersion);}catch{}

    userInfo = {
        name: AccountEmail,
        notesCounter: userInfo.notesCounter == undefined ? 0 : userInfo.notesCounter,
        version: FluxAppBuild,
        folders: userInfo.folders == undefined ? 0 : userInfo.folders
    }
    notesCounter = userInfo.notesCounter == undefined ? 0 : userInfo.notesCounter;

    FirestoreDB.collection("data").doc('notes').collection(AccountEmail).doc('#userInfo').set(userInfo)

    if (RealtimeNotes == 'True') ANSync(0.3), StartRealtimeNotes();
}

function CreateNote() {
    var title = document.getElementById("add-note-title").value;
    var description = document.getElementById("add-note-description").value;
    document.getElementById("add-note-window").style.visibility = "hidden";
    AddNote(title, description);
}

function DeleteNote() {
    FirestoreDB.collection("data").doc('notes').collection(AccountEmail).doc(OpenedNote).delete().then(()=>{SyncDBNotes('remove',OpenedNote);}).catch(function(error) {
        console.log('[!] Error Removing Note:',OpenedNote + ": " + error);
    });
}

function AddNote(title, description,calledby) {
    FirestoreDB.collection("data").doc('notes').collection(AccountEmail).add({
        title: title,
        description: description,
        date: new Date().getDate() + "." + (new Date().getMonth() + 1) + "." + new Date().getFullYear(),
        time: new Date().getHours() + ":" + new Date().getMinutes(),
        url: window.location.hostname,
        email: AccountEmail,
        version: FluxAppBuild,
        folder: NotesFolderOpened
    });
    if (RealtimeNotes == false) {viewDBNotes = true; LoadNotesOnce();}
}

function ClearNote(a) {
    document.getElementById(a+"-NoteCard").remove();
    notes.splice(notes.indexOf(a), 1);
}

function RenderNote(i) {
    if (viewDBNotes == true) {document.getElementById('NoteList').innerHTML = ''; viewDBNotes = false}
    if ((NotesFolderOpened == data[i - 1].folder && NotesFolderOpened!='') || NotesFolderOpened=='') {
        var NoteCard = document.createElement("div");
        NoteCard.setAttribute('class', 'NoteCard ripple');
        NoteCard.setAttribute('id', notes[i - 1] + "-NoteCard");
        NoteCard.setAttribute('onclick', "OpenNote('" + notes[i - 1] + "')");
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
        NoteCardC.style.height = (38 + NoteDescription.offsetHeight) + "px";
        //NoteCardC.style.top = g_r_height + "px";
        g_r_height = g_r_height + 20 + NoteCardC.offsetHeight;
        //document.getElementById(notes[i - 1] + "-NoteCard").style.top = NoteCardC.style.top;
        document.getElementById(notes[i - 1] + "-NoteCard").style.height = NoteCardC.style.height;

        ResizeNote(); setTimeout(function() { ResizeNote(); }, 300);  
    } 
}

function UpdateConnection() {
    if (AppOnline != AppOnlineF) {
        AppOnlineF = AppOnline;
        if (AppOnline){
            firebase.firestore().enableNetwork();
            console.log('[$] Status:','Online');
            document.getElementById('ANO').style.marginTop='-76px';
            document.getElementById('ANO').style.opacity='0';   
        } else {
            firebase.firestore().disableNetwork();
            console.log('[$] Status:','Offline');
            document.getElementById('ANO').style.marginTop='0px';
            document.getElementById('ANO').style.opacity='1'; 
        }
    }
}