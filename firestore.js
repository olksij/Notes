var FirestoreDB = firebase.firestore(); FirestoreDB.enablePersistence();
var fromVersion; var notesCounter;
if (typeof(AppOnline)!='undefined') UpdateConnection(); if (AccountEmail) SyncFData();

async function LoadUserData() {
    if (RealtimeNotes == 'False') {
        await LoadNotesOnce();
        document.getElementById('body').style.overflowY = 'auto';
        //document.getElementById('SplashScreen').style.display = 'none';
        if (userSettings) userSettings.notesCounter = notes.length;
        if (userSettings) {console.log('[i] Notes Loaded'); ANSync(1);}
    } else {
        if (userSettings==undefined)
        var usertInfo = await FirestoreDirectory.doc('#userInfo').get(); userSettings = usertInfo.data();
        console.log('[i] Connected to Firestore'); ANSync(0.5);
    }
}

function ANSync(value){
    document.getElementById('ANSBarActive').style.width = document.getElementById('ANSBar').offsetWidth*value+'px';
    document.getElementById('ANSText').innerHTML=(value*100)+'%';
    if(value==1){
        document.getElementById('ANS').style.marginTop='-81px';
        document.getElementById('ANS').style.opacity='0';
    }
}

async function LoadNotesOnce(){
    await FirestoreDirectory.get().then(function(querySnapshot) {
        console.log('[i] Connected to Firestore:'); ANSync(0.5);
        document.getElementById('ANSBarActive').style.width=document.getElementById('ANSBar').offsetWidth*0.5+'px';
        SyncDBNotes('clear');   
        querySnapshot.forEach(function(doc) {
            if (doc.id != '#userInfo'){
                console.log('[+] Notes:', (doc.id + ( userSettings == undefined || userSettings.notesCounter == 0 ? '' : (' - ' + (Math.round((notes.length+1)/userSettings.notesCounter*100) + '%'))) + ' - ' + (querySnapshot.metadata.fromCache ? "cache" : "server")));
                notes.push(doc.id);
                data.push(doc.data());  
                SyncDBNotes('add',{id: notes[notes.length-1], data: data[data.length-1]}) 
                RenderNote(notes.length);     
            } else { userSettings = doc.data(); }
        });
    })
}

function StartRealtimeNotes(){
    SyncDBNotes('clear');   
    FirestoreDirectory.onSnapshot({ includeMetadataChanges: true }, function(snapshot) {
        snapshot.docChanges().forEach(async function(change) {
            if (change.doc.id!="#userInfo") {
                if (change.type === "added") {
                    console.log('[+] Notes:', (change.doc.id + ( notesCounter == 0 ? '' : (' - ' + (Math.round((notes.length+1)/notesCounter*100) + '%'))) + ' - ' + (snapshot.metadata.fromCache ? "cache" : "server")));
                    ANSync(50+(Math.round(notes.length+1)/notesCounter*50));
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
                userSettings.notesCounter = notes.length;
                FirestoreDirectory.doc('#userInfo').set(userSettings)
                if (notesCounter == notes.length) { console.log('[i] Notes Loaded'); ANSync(1); }
            } else { 
                if (change.type == 'modified'){
                    userSettings = await change.doc.data();
                    Theme(userSettings.theme,'Code');
                }
            }
        });
    });    
}

async function SyncFData() { if (!AccountEmail) return;
    FirestoreDirectory = FirestoreDB.collection(AccountEmail);
    ANSync(0.2);
    await LoadUserData();

    if(userSettings){
        userSettings.realtimeNotes ? RealtimeNotes = userSettings.realtimeNotes : userSettings.realtimeNotes = RealtimeNotes; 
        userSettings.theme ? AppTheme = userSettings.theme : userSettings.theme = AppTheme; 
        userSettings.appLanguage ? AppLanguage = userSettings.appLanguage : userSettings.appLangauge = AppLanguage; 
        UpdateSettings('RealtimeNotes',RealtimeNotes); UpdateSettings('AppTheme',AppTheme); UpdateSettings('AppLanguage',AppLanguage);
        Theme(AppTheme,'Code');
    } else AddNote("Welcome to Notes!","It's your private space now. Introduction is coming soon. Cause of database rebasing progress, you can lose your notes sometimes.",'firestore');
    userSettings = {
        notesCounter: userSettings.notesCounter == undefined ? 0 : userSettings.notesCounter,
        version: FluxAppBuild,
        folders: userSettings.folders == undefined ? [] : userSettings.folders,
        theme: userSettings.theme == undefined ? 'Light' : userSettings.theme,
        language: userSettings.language == undefined ? 'English' : userSettings.language,
        realtimeNotes: userSettings.realtimeNotes == undefined ? 'True' : userSettings.realtimeNotes,
    }

    if (userSettings.version == undefined) fromVersion = 0; else fromVersion = parseInt(userSettings.version); 
    try{CheckUpdates(fromVersion);}catch{}

    notesCounter = userSettings.notesCounter == undefined ? 0 : userSettings.notesCounter;

    FirestoreDirectory.doc('#userInfo').set(userSettings)

    if (RealtimeNotes == 'True') ANSync(0.3), StartRealtimeNotes();
}

function CreateNote() {
    var title = document.getElementById("add-note-title").value;
    var description = document.getElementById("add-note-description").value;
    document.getElementById("add-note-window").style.visibility = "hidden";
    AddNote(title, description);
}

function DeleteNote() {
    FirestoreDirectory.doc(OpenedNote).delete().then(()=>{SyncDBNotes('remove',OpenedNote);}).catch(function(error) {
        console.log('[!] Error Removing Note:',OpenedNote + ": " + error);
    });
}

function AddNote(title, description,calledby) {
    FirestoreDirectory.add({
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

function SyncUserSettings(){ FirestoreDirectory.doc('#userInfo').set(userSettings); console.log(userSettings) }