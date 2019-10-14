var SettingsDB; var SettingsStore; var AppOnline = true; var AppOnlineF; var account; var AppTheme; var LoadApp; var LoadUser; var RealtimeNotes; var Themes = ['Light', 'Dark', 'Custom']; var NotesList = []; var g_r_height = 96; var viewDBNotes = true; var NotesFolderOpened = ''; var userInfo; var AccountEmail;  var notes = new Array(); var data = new Array();
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
                AppTheme = r.target.result[1].value;
                LoadApp = r.target.result[2].value; 
                LoadUser = r.target.result[3].value;
                RealtimeNotes = r.target.result[4].value;
                if (typeof(window) == 'object') { Theme(); try{SyncFData()}catch{}            }
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
        LoadApp = 'Cache'; 
        LoadUser = 'Cache';
        RealtimeNotes = 'False';
        Theme();
    }
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
                { name: 'LoadApp', value: 'Cache' },
                { name: 'LoadUser', value: 'Cache' },
                { name: 'AccountEmail', value: '' },
                { name: 'RealtimeNotes', value: 'False' }
            ];      
            var ObjectStore = SettingsDBV.transaction("Settings", "readwrite").objectStore("Settings");
            SettingsValues.forEach(function(setting) { ObjectStore.add(setting); });                
        }    
    }
    if (!SettingsDBV.objectStoreNames.contains('Notes')) SettingsDBV.createObjectStore('Notes', { keyPath: "id" });
    print('iUpdated Database')
}


function UpdateSettings(setting, value){
    indexedDB.open("NotesDB",FluxAppBuild).onsuccess = function(event) {
        SettingsDBlocal = event.target.result;
        var request = SettingsDBlocal.transaction(["Settings"], "readwrite").objectStore("Settings").get(setting);
        request.onerror = function(event) { print('!Notes Database Error', event.target.errorCode) };
        request.onsuccess = function(event) {
            var data = event.target.result
            data.value = value;
            var requestUpdate = SettingsDBlocal.transaction(["Settings"], "readwrite").objectStore("Settings").put(data);
            requestUpdate.onerror = function(event) { print('!Notes Database Error', event.target.errorCode) };
        }
    };
}

if (typeof(window) != 'undefined') { navigator.serviceWorker.addEventListener('message', event => { if (event.data.type == 'AppOnline') { AppOnline = event.data.value; try {UpdateConnection(AppOnline);}catch{}}}); }

function Theme(UpdateTo) {
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
        temploader.setAttribute('content', '#000000'); 
    } else {
        document.documentElement.style.setProperty('--main-color', '#05050A');
        document.documentElement.style.setProperty('--main-color-light', '#05050A07');
        document.documentElement.style.setProperty('--main-shadow-color', '#05050A20');
        document.documentElement.style.setProperty('--main-contrast-color', '#05050A');
        document.documentElement.style.setProperty('--secondary-color', '#05050A80');
        document.documentElement.style.setProperty('--background-color', '#FFFFFF');
        document.documentElement.style.setProperty('--hover-color', '#FFFFFF');
        document.documentElement.style.setProperty('--hover-c-color', '#05050A');
        document.documentElement.style.setProperty('--secondary-contrast-color', '#00000080');
        temploader.setAttribute('content', '#FFFFFF'); 
        AppTheme = 'Light';
    }
    document.getElementsByTagName("head")[0].appendChild(temploader);

    UpdateSettings('AppTheme', AppTheme);
}
