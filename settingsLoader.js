var SettingsDB; var SettingsStore; var AppOnline = true; var AppOnlineF; var account; var AppTheme; var LoadApp; var LoadUser; var RealtimeNotes; var Themes = ['Light', 'Dark', 'Custom']; var NotesList = []; var g_r_height = 96; var viewDBNotes = true; var NotesFolderOpened = ''; var userSettings; var AccountEmail;  var notes = new Array(); var data = new Array(); var folders = new Array(); var AppLanguage;
if (typeof(window) == 'object') {
    var DBrequest = indexedDB.open("NotesDB",parseInt(FluxAppBuild))
    DBrequest.onsuccess = function(event) {
        SettingsDB = event.target.result;
        LoadDBSettings();
    };
    DBrequest.onupgradeneeded = function(event) { CreateDB(event) }
}

function LoadDBSettings(){
    if (SettingsDB.objectStoreNames.length != 0) {
        SettingsStore = SettingsDB.transaction(["Settings"], 'readwrite').objectStore("Settings");
        SettingsStore.getAll().onsuccess = (r) => {
            if (r.target.result.length != 0) {
                AccountEmail = r.target.result[0].value=='' ? undefined : r.target.result[0].value;
                AppLanguage = r.target.result[1].value;
                AppTheme = r.target.result[2].value;
                RealtimeNotes = r.target.result[3].value;
                if (typeof(window) == 'object') { 
                    Theme(AppTheme,'Code');
                    try{SyncFData()}catch{}
                }
            } else {/*
                var SettingsValues = [
                    { name: 'AppTheme', value: 'Light' },
                    { name: 'LoadApp', value: 'Cache' },
                    { name: 'LoadUser', value: 'Cache' },
                    { name: 'AccountEmail', value: '' },
                    { name: 'RealtimeNotes', value: 'False' }
                ];      
                var ObjectStore = SettingsDB.transaction("Settings", "readwrite").objectStore("Settings");
                SettingsValues.forEach(function(setting) { ObjectStore.add(setting); });    */        
            }
        }
    } else {
        AppTheme = 'Light';  
        RealtimeNotes = 'False';
        AppLanguage = 'En';
        Theme(AppTheme,'Code');
    }
    setTimeout(()=>document.getElementById('body').style.transition='0.3s',300)
}

function CreateDB(event) {
    SettingsDBV = event.target.result; 
    if (!SettingsDBV.objectStoreNames.contains('Settings')) {
        var objectStore = SettingsDBV.createObjectStore('Settings', { keyPath: "name" });
        objectStore.onerror = (e) => console.log(e);
        objectStore.onsuccess = (e) => console.log(e);
        objectStore.transaction.oncomplete = () => {
            var SettingsValues = [
                { name: 'AppTheme', value: 'Light' },
                { name: 'AccountEmail', value: '' },
                { name: 'AppLanguage', value: 'En' },
                { name: 'RealtimeNotes', value: 'True' }
            ];      
            var ObjectStore = SettingsDBV.transaction("Settings", "readwrite").objectStore("Settings");
            SettingsValues.forEach(function(setting) { ObjectStore.add(setting); });                
        }    
    }
    if (!SettingsDBV.objectStoreNames.contains('Notes')) SettingsDBV.createObjectStore('Notes', { keyPath: "id" });
    console.log('[i] Updated Database')
}


function UpdateSettings(setting, value){
    indexedDB.open("NotesDB",FluxAppBuild).onsuccess = function(event) {
        SettingsDBlocal = event.target.result;
        var request = SettingsDBlocal.transaction(["Settings"], "readwrite").objectStore("Settings").get(setting);
        request.onerror = function(event) { console.error('[!] Notes Database Error:', event.target.errorCode) };
        request.onsuccess = function(event) {
            var data = event.target.result
            data.value = value;
            var requestUpdate = SettingsDBlocal.transaction(["Settings"], "readwrite").objectStore("Settings").put(data);
            requestUpdate.onerror = function(event) { console.error('[!] Notes Database Error', event.target.errorCode) };
        }
    };
}

if (typeof(window) != 'undefined') { navigator.serviceWorker.addEventListener('message', event => { if (event.data.type == 'AppOnline') { AppOnline = event.data.value; try {UpdateConnection(AppOnline);}catch{}}}); }

function Theme(UpdateTo,By) {
    var metaThemeColor = document.getElementsByTagName('meta')[0];
    metaThemeColor.remove();

    var temploader = document.createElement('meta'); 
    temploader.setAttribute('name', 'theme-color'); 

    if (UpdateTo != undefined) AppTheme = UpdateTo;
    if (AppTheme == 'Custom') {
        document.documentElement.style.setProperty('--main-color', ColorAccent);
        document.documentElement.style.setProperty('--main-color-light', ColorAccent+'10');
        document.documentElement.style.setProperty('--main-shadow-color', ColorAccent+'40');
        document.documentElement.style.setProperty('--main-contrast-color', '#FFFFFF');
        document.documentElement.style.setProperty('--secondary-color', ColorAccent+'80');
        document.documentElement.style.setProperty('--background-color', '#FFFFFF');
        document.documentElement.style.setProperty('--hover-color', ColorAccent);
        document.documentElement.style.setProperty('--hover-c-color', '#FFFFFF');
        document.documentElement.style.setProperty('--secondary-contrast-color', '#FFFFFFA0');
        temploader.setAttribute('content', '#FFFFFF'); 
    } else if (AppTheme == 'Dark') {
        document.documentElement.style.setProperty('--main-color', '#FFFFFF');
        document.documentElement.style.setProperty('--main-color-light', '#0A0A0A');
        document.documentElement.style.setProperty('--main-shadow-color', '#000000');
        document.documentElement.style.setProperty('--main-contrast-color', '#FFFFFF');
        document.documentElement.style.setProperty('--secondary-color', '#FFFFFF80');
        document.documentElement.style.setProperty('--background-color', '#050505');
        document.documentElement.style.setProperty('--hover-color', '#101010');
        document.documentElement.style.setProperty('--hover-c-color', '#FFFFFF');
        document.documentElement.style.setProperty('--secondary-contrast-color', '#FFFFFF80');
        document.documentElement.style.setProperty('--aqs-background', '#080808');
        document.documentElement.style.setProperty('--aqs-item', '#040404');
        document.documentElement.style.setProperty('--aqs-shadow-color', '#00000040');
        temploader.setAttribute('content', '#000000');     
    } else if (AppTheme == 'LightD') {
        document.documentElement.style.setProperty('--main-color', '#05050A');
        document.documentElement.style.setProperty('--main-color-light', '#F5F5Fa');
        document.documentElement.style.setProperty('--main-shadow-color', '#05050A20');
        document.documentElement.style.setProperty('--main-contrast-color', '#05050A');
        document.documentElement.style.setProperty('--secondary-color', '#05050A80');
        document.documentElement.style.setProperty('--background-color', '#FFFFFF');
        document.documentElement.style.setProperty('--hover-color', '#FFFFFF');
        document.documentElement.style.setProperty('--hover-c-color', '#05050A');
        document.documentElement.style.setProperty('--secondary-contrast-color', '#00000080');
        temploader.setAttribute('content', '#FFFFFF'); 

    } else if (AppTheme == 'Light2Contrasted') {
        document.documentElement.style.setProperty('--main-color', '#0A0F23');
        document.documentElement.style.setProperty('--main-color-light', '#F4F6F8');
        document.documentElement.style.setProperty('--main-shadow-color', '#0A0F2320');
        document.documentElement.style.setProperty('--main-contrast-color', '#0A0F23');
        document.documentElement.style.setProperty('--secondary-color', '#0A0F2380');
        document.documentElement.style.setProperty('--background-color', '#FFFFFF');
        document.documentElement.style.setProperty('--hover-color', '#FFFFFF');
        document.documentElement.style.setProperty('--hover-c-color', '#0A0F23');
        document.documentElement.style.setProperty('--secondary-contrast-color', '#0A0F2380');
        temploader.setAttribute('content', '#FFFFFF'); 
    } else {
        document.documentElement.style.setProperty('--main-color', '#0A0F23');
        document.documentElement.style.setProperty('--main-color-light', '#F7F9FB');
        document.documentElement.style.setProperty('--main-shadow-color', '#0A0F2320');
        document.documentElement.style.setProperty('--main-contrast-color', '#0A0F23');
        document.documentElement.style.setProperty('--secondary-color', '#0A0F2380');
        document.documentElement.style.setProperty('--background-color', '#FFFFFF');
        document.documentElement.style.setProperty('--hover-color', '#FFFFFF');
        document.documentElement.style.setProperty('--hover-c-color', '#0A0F23');
        document.documentElement.style.setProperty('--secondary-contrast-color', '#0A0F2380');
        document.documentElement.style.setProperty('--aqs-background', '#FFFFFF');
        document.documentElement.style.setProperty('--aqs-item', '#F7F9FB');
        document.documentElement.style.setProperty('--aqs-shadow-color', '#0A0F2320');

        temploader.setAttribute('content', '#FFFFFF'); 
        AppTheme = 'Light';
    }
    document.getElementsByTagName("head")[0].appendChild(temploader);

    UpdateSettings('AppTheme', AppTheme);

    if(By!='Code'){
        userSettings.theme = AppTheme;
        SyncUserSettings();    
    }
}

// ----- notesLoader.js -----

indexedDB.open("NotesDB",parseInt(FluxAppBuild)).onsuccess = (e) => {
    var SettingsDB = e.target.result;
    if (SettingsDB.objectStoreNames.contains('Notes')) {
        SettingsDB.transaction(['Notes'], 'readwrite').objectStore('Notes').getAll().onsuccess = r => {
            if (r.target.result!=undefined){
                window.dbnotes = r.target.result;
                LoadDBNotes(r.target.result,'');
                ResizeNote(true); setTimeout(function() { ResizeNote(true); }, 300);  
                console.log('[i] Database notes are loaded');
                //document.getElementById('body').style.overflowY = 'auto';
                //document.getElementById('SplashScreen').style.display = 'none';
            }
        }
    }
}

function SyncDBNotes(type,data){
    if (SettingsDB != undefined){
        if (type=='clear') { SettingsDB.transaction(['Notes'], "readwrite").objectStore("Notes").clear(); }
        else if (type == 'add') { SettingsDB.transaction("Notes", "readwrite").objectStore("Notes").add(data); }
        else if (type == 'remove') { SettingsDB.transaction("Notes", "readwrite").objectStore("Notes").delete(data); }    
    }
}

function ResizeNote(db) {
    var g_height = 76;
    if (db){
        dbnotes.forEach(i=>{
            document.getElementById(i.id + "-NoteCard").style.height = (38 + document.getElementById(i.id + "-NoteDescription").offsetHeight) + "px";
            g_height = g_height + 20 + document.getElementById(i.id + "-NoteCard").offsetHeight;
        })    
    } else {
        if (notes){
            notes.forEach(i=>{
                document.getElementById(i + "-NoteCard").style.height = (38 + document.getElementById(i + "-NoteDescription").offsetHeight) + "px";
                g_height = g_height + 20 + document.getElementById(i + "-NoteCard").offsetHeight;
            })       
        }
    }
    if (document.body.offsetWidth < 657) { /* MOBILE */
        document.getElementById("NoteList").style.height = (g_height)+'px';
    } else {
        document.getElementById("NoteList").style.height = (g_height-76)+'px';
    }
}

function LoadDBNotes(list,folder){
    list.forEach(n => {
        if (NotesFolderOpened == folder){
            var NoteCard = document.createElement("div");
            NoteCard.setAttribute('class', 'NoteCard ripple');
            NoteCard.setAttribute('id', n.id + "-NoteCard");
            NoteCard.setAttribute('onclick', "OpenNote('" + n.id + "')");
            document.getElementById("NoteList").appendChild(NoteCard);
        
            var NoteTitle = document.createElement("p");
            NoteTitle.innerHTML = n.data.title;
            NoteTitle.setAttribute('class', 'NoteTitle');
            NoteTitle.setAttribute('id', n.id + "-NoteTitle");
            document.getElementById(n.id + "-NoteCard").appendChild(NoteTitle);
        
            var NoteDescription = document.createElement("p");
            NoteDescription.innerHTML = n.data.description;
            NoteDescription.setAttribute('class', 'NoteDescription');
            NoteDescription.setAttribute('id', n.id + "-NoteDescription");
            document.getElementById(n.id + "-NoteCard").appendChild(NoteDescription);
        
            var NoteDate = document.createElement("p");
            NoteDate.innerHTML = n.data.date;
            NoteDate.setAttribute('class', 'NoteDate');
            NoteDate.setAttribute('id', n.id + "-NoteDate");
            document.getElementById(n.id + "-NoteCard").appendChild(NoteDate);
        
            var NoteCardC = document.getElementById(n.id + "-NoteCard");
            NoteCardC.style.height = (38 + NoteDescription.offsetHeight) + "px";
            //NoteCardC.style.top = g_r_height + "px";
            g_r_height = g_r_height + 20 + NoteCardC.offsetHeight;
            //document.getElementById(notes[i - 1] + "-NoteCard").style.top = NoteCardC.style.top;
            document.getElementById(n.id + "-NoteCard").style.height = NoteCardC.style.height;    
        }
    })
}
