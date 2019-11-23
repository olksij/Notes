var FirestoreDB = firebase.firestore(); FirestoreDB.enablePersistence();
var fromVersion; ANSync(0.1)
if (typeof(AppOnline)!='undefined') UpdateConnection();
NoteMetadata=['title','description','date','time','url','email','varsion','label']

function ANSync(value){
    document.getElementById('ANSBarActive').style.width = document.getElementById('ANSBar').offsetWidth*value+'px';
    document.getElementById('ANSText').innerHTML=(value*100)+'%';
    if(value>=1){
        document.getElementById('ANS').style.marginTop='-81px';
        document.getElementById('ANS').style.opacity='0';
    }
}

function StartRealtimeNotes(){
    AppUpdateD.style.visibility = 'hidden'; 
    AppUpdateD.style.opacity = '0'; 
    AppUpdateD.style.zIndex = '0';
    AppUpdateD.style.transition = '0s';
    SyncDBNotes('clear');   
    FirestoreDirectory.onSnapshot({ includeMetadataChanges: true }, function(snapshot) {
        snapshot.docChanges().forEach(async function(change) {
            if (change.doc.id!="#userInfo") {
                if (change.type === "added") {
                    console.log('[+] Notes:', (change.doc.id + ' - ' + (snapshot.metadata.fromCache ? "cache" : "server")));
                    ANSync(1);
                    notes.push(change.doc.id);
                    var tmpntd1=change.doc.data();
                    var tmpntd2 = {
                        title: await e3kit.decrypt(tmpntd1.title,UserPublicKey),
                        description: await e3kit.decrypt(tmpntd1.description,UserPublicKey),
                        date: await e3kit.decrypt(tmpntd1.date,UserPublicKey),
                        time: await e3kit.decrypt(tmpntd1.time,UserPublicKey),
                        url: await e3kit.decrypt(tmpntd1.url,UserPublicKey),
                        email: await e3kit.decrypt(tmpntd1.email,UserPublicKey),
                        version: await e3kit.decrypt(tmpntd1.version,UserPublicKey),
                        label: await e3kit.decrypt(tmpntd1.label,UserPublicKey)
                    }
                    data.push(tmpntd2); 
                    SyncDBNotes('add',{id: change.doc.id, data: data[data.length-1]})
                    RenderNote(data.length); 
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
                FirestoreDirectory.doc('#userInfo').set(userSettings)
            } else { 
                if (change.type == 'modified'){
                    userSettings = await change.doc.data();
                    Theme(userSettings.theme,'Code');
                }
            }
        });
    });    
}

async function SyncFData() { if (!userSettings.email) return;
    FirestoreDirectory = FirestoreDB.collection(userSettings.email);
    FirebaseLoaded = true; SyncUserSettings();
    ANSync(0.3);
    var usertInfo = await FirestoreDirectory.doc('#userInfo').get(); userInfot=usertInfo.data(); userSettings = userInfot || userSettings;
    console.log('[i] Connected to Firestore'); ANSync(0.4);

    console.log(userInfot)
    if(userInfot){ UpdateSettings(); Theme(userSettings.theme,'Code'); } else UploadNote("Welcome to Notes!","It's your private space now. Introduction is coming soon. Cause of database rebasing progress, you can lose your notes sometimes.",'firestore');

    if (userSettings.version == undefined) fromVersion = 0; else fromVersion = parseInt(userSettings.version); 
    CheckUpdates(fromVersion);

    userSettings = {
        version: AppPublicVersion,
        labels: userSettings.labels || [],
        theme: userSettings.theme || 'Light',
        email: userSettings.email,
        language: userSettings.language || 'En',
        screenContrast: userSettings.screenContrast || '0',
    }
    FirestoreDirectory.doc('#userInfo').set(userSettings)

    StartRealtimeNotes();
}

function CreateNote() {
    var title = document.getElementById("AddNoteTitle").value;
    var description = document.getElementById("AddNoteDescription").value;
    FA2Animation('-','AddNoteWindow');
    if (title!=''&&description!='') UploadNote(title, description);
}

function DeleteNote() {
    FirestoreDirectory.doc(OpenedNote).delete().then(()=>{SyncDBNotes('remove',OpenedNote);}).catch(function(error) {
        console.log('[!] Error Removing Note:',OpenedNote + ": " + error);
    });
}

async function UploadNote(title, description,calledby) {
    FirestoreDirectory.add({
        title: await e3kit.encrypt(title,UserPublicKey),
        description: await e3kit.encrypt(description,UserPublicKey),
        date: await e3kit.encrypt(new Date().getDate() + "." + (new Date().getMonth() + 1) + "." + new Date().getFullYear(),UserPublicKey),
        time: await e3kit.encrypt(new Date().getHours() + ":" + new Date().getMinutes(),UserPublicKey),
        url: await e3kit.encrypt(window.location.hostname,UserPublicKey),
        email: await e3kit.encrypt(userSettings.email,UserPublicKey),
        version: await e3kit.encrypt(AppDevVersion,UserPublicKey),
        label: await e3kit.encrypt(NotesLabelOpened,UserPublicKey)
    });
}

function ClearNote(a) {
    document.getElementById(a+"-NoteCard").remove();
    notes.splice(notes.indexOf(a), 1);
}

function RenderNote(i) {
    if (viewDBNotes == true) {NoteList.innerHTML = ''; viewDBNotes = false}
    if ((NotesLabelOpened == data[i - 1].label && NotesLabelOpened!='') || NotesLabelOpened=='') {
        var NoteCard = document.createElement("div");
        NoteCard.setAttribute('class', 'NoteCard ripple');
        NoteCard.setAttribute('id', notes[i - 1] + "-NoteCard");
        NoteCard.setAttribute('onclick', "OpenNote('" + notes[i - 1] + "')");
        NoteList.appendChild(NoteCard);

        var NoteTitle = document.createElement("p");
        NoteTitle.innerHTML = data[i - 1].title;
        NoteTitle.setAttribute('class', 'NoteTitle');
        NoteTitle.setAttribute('id', notes[i - 1] + "-NoteTitle");
        NoteCard.appendChild(NoteTitle);

        var NoteDescription = document.createElement("p");
        NoteDescription.innerHTML = data[i - 1].description;
        NoteDescription.setAttribute('class', 'NoteDescription');
        NoteDescription.setAttribute('id', notes[i - 1] + "-NoteDescription");
        NoteCard.appendChild(NoteDescription);

        var NoteDate = document.createElement("p");
        NoteDate.innerHTML = data[i - 1].date;
        NoteDate.setAttribute('class', 'NoteDate');
        NoteDate.setAttribute('id', notes[i - 1] + "-NoteDate");
        NoteCard.appendChild(NoteDate);

        //NoteCard.style.height = (38 + NoteDescription.offsetHeight) + "px";
        //g_r_height = g_r_height + 20 + NoteCard.offsetHeight;

        setTimeout(function() { ResizeNote(); }, 300);  
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
            ANSync(1);
        }
    }
}

function SyncUserSettings(){ FirestoreDirectory.doc('#userInfo').set(userSettings);}

firebase.auth().onAuthStateChanged(function(user) { var shldpss = false; ANSync(0.2);
    if (userSettings.email != undefined) { 
        if (userSettings.email != user.email) firebase.auth().signInWithRedirect(new firebase.auth.GoogleAuthProvider()); 
        else userSettings.email = user.email, shldpss=true, AccountToken = user; }
    else { 
        if (user) userSettings.email = user.email, UpdateSettings(), AccountToken = user, console.log('[i] User:',userSettings.email), shldpss=true; 
        else firebase.auth().signInWithRedirect(new firebase.auth.GoogleAuthProvider()); }
    if (shldpss){
        const getToken = firebase.functions().httpsCallable('getVirgilJwt');
        const initializeFunction = () => getToken().then(result => result.data.token);
        E3kit.EThree.initialize(initializeFunction).then(async eThree => { 
            console.log('[i] Security core: initialized'); e3kit=eThree;
            await e3kit.findUsers(AccountToken.uid).then(async(u)=>{UserPublicKey = u.publicKey; const hlclprtk = await e3kit.hasLocalPrivateKey(); if(!hlclprtk) await e3kit.restorePrivateKey(AccountToken.metadata.a);}).catch(async()=>{e3kit.register(); await e3kit.backupPrivateKey(AccountToken.metadata.a)})
            SyncFData();
        }).catch(error => { console.error('[!] Security core: ', error.code ==='unauthenticated' ? 'user is not authorized' : error) });
    }
});

firebase.auth().getRedirectResult().then(function(result) { if (result.user) { userSettings.email = result.user.email; UpdateSettings(); SyncFData(); }
}).catch(function(error) { console.log('[!] Auth:', 'Error (' + error.code + '): ' + error.message); });
