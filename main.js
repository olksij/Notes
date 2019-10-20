var ColorAccent = '#0075FF';
registerSW(); Resized(); Theme(AppTheme)
document.getElementById("AddNoteTitle").style.width = ((document.getElementById('body').offsetWidth) - 82) + "px";
document.getElementById("AddNoteDescription").style.width = ((document.getElementById('body').offsetWidth) - 82) + "px";
document.getElementById("AddNoteWindow").style.display = 'none';
console.log('[i] Version:',FluxAppBuild);
if (typeof(fromVersion) != 'undefined') CheckUpdates();

window.addEventListener('scroll',Scrolled());
window.addEventListener('resize',Resized());

function registerSW() { if ('serviceWorker' in navigator) { navigator.serviceWorker.register('sw.js'); } }

function Resized() {
    ResizeNote(); setTimeout(function() { ResizeNote(); }, 300);

    if (document.getElementById("AddNoteButton")){
        if (document.body.offsetWidth < 657) { /* MOBILE */
            document.getElementById("Settings_ToHomeButton").setAttribute('class', 'FluxAppFloatingButton');
        } else { /* DESKTOP */
            document.getElementById("Settings_ToHomeButton").setAttribute('class', 'FluxAppButton');
        }

        document.getElementById("AddNoteTitle").style.width = (document.body.offsetWidth - 82) + "px";
        document.getElementById("AddNoteDescription").style.width = (document.body.offsetWidth - 62 - 20) + "px";

        setTimeout(function() { Scrolled(); }, 300);
    }
}

function Scrolled() {
    if (document.getElementById("AddNoteButton")){
        if (document.body.offsetWidth < 657) {
            if (document.scrollingElement.scrollTop == (document.scrollingElement.scrollHeight - document.getElementById('body').offsetHeight)) { document.getElementById("AddNoteButton").setAttribute('class', 'FluxAppButton ripple');
            } else { document.getElementById("AddNoteButton").setAttribute('class', 'FluxAppFloatingButton ripple'); }
        } else {
            if (document.scrollingElement.scrollTop == 0) { document.getElementById("AddNoteButton").setAttribute('class', 'FluxAppButton ripple');
            } else { document.getElementById("AddNoteButton").setAttribute('class', 'FluxAppFloatingButton ripple'); }
        }
    
        if (document.scrollingElement.scrollTop == 0) {
            document.getElementById("SearchBar").setAttribute('class', 'FluxAppSearchBar ripple');
            document.getElementById("AppMenuButton").setAttribute('class', 'FluxAppButton ripple');
        } else {
            document.getElementById("SearchBar").setAttribute('class', 'FluxAppSearchBar FluxAppFloating ripple');
            document.getElementById("AppMenuButton").setAttribute('class', 'FluxAppFloatingButton ripple');
        }    
    }
}

// --- BTN CLICKS ---

var OpenedNote;
function OpenNote(id) {
    var idl = notes.indexOf(id);
    OpenedNote = id;
    document.getElementById("OpenNoteWindow").style.display = "block";
    document.getElementById("OpenNoteTitle").innerHTML = data[idl].title;
    document.getElementById("OpenNoteDescription").innerHTML = data[idl].description;
    document.getElementById("OpenNoteDate").innerHTML = data[idl].date;
    document.getElementById("OpenNoteCard").style.height = (76 + document.getElementById("OpenNoteDescription").offsetHeight) + "px";
}

function OpenNote_ToHomeButton() { document.getElementById("OpenNoteWindow").style.display = "none"; }

function Settings_ToHomeButton() { document.getElementById("SettingsWindow").style.display = "none"; }

function OpenNote_Delete() { DeleteNote(); OpenNote_ToHomeButton(); }

function Settings_ReloadApp() { location.reload(true); }

//var quickSettingsOpened = false;
function AppMenuButtonClick() {
    /*
    if (!quickSettingsOpened) {
        quickSettingsOpened = true;
        document.getElementById('AppQuickSettings').style.height = '300px';
        document.getElementById('AppQuickSettings').style.opacity = '1';
        document.getElementById('AppQuickSettings').style.marginTop = '20px';

        var AQSFolders = '';
        folders.forEach((f)=>{
            AQSFolders+=`
            <div id="AQSFolder_`+f.id+`">
                <p id="AQSFolderName_`+f.id+`">`+f.name+`</p>
                <p id="AQSFolderCount_`+f.id+`">`+f.notes.length+`</p>
            </div>`
        });
        AQSFolders+=`<div id="AddAQSFolder" onclick="AQSAddFolder()"><p>Add Folder</p></div>`      
        document.getElementById('AppQuickSettings').innerHTML = AQSFolders;
    } else {
        quickSettingsOpened = false;
        document.getElementById('AppQuickSettings').style.height = '0px';
        document.getElementById('AppQuickSettings').style.opacity = '0';
        document.getElementById('AppQuickSettings').style.marginTop = '0px';

        setTimeout(()=>{document.getElementById('AppQuickSettings').innerHTML = '';},300);
    }

    Resized();*/
}

function AQSAddFolder(){

}

function MobileDialogCreateNote() { document.getElementById("AddNoteWindow").style.display = 'block'; }

function CreateNoteMobile() { document.getElementById("AddNoteWindow").style.display = 'none'; AddNote(document.getElementById("AddNoteTitle").value, document.getElementById("AddNoteDescription").value); }

function CloseDialogCreateNote() { document.getElementById("AddNoteWindow").style.display = 'none'; }

// INSTALL

window.addEventListener('appinstalled', () => { console.log('[i] Yay:', 'App was intalled by user!'); });

// BTN ANIMATIONS

function /* Global Button Animation */ AppButtonHover(id) { document.getElementById(id).style.fill = "var(--main-contrast-color)"; } function AppButtonOut(id) { document.getElementById(id).style.fill = "var(--main-color)"; }

function /* Add Note icon */ 
AddButtonHover() {
    if (document.getElementById('body').offsetWidth >= 640) {
        document.getElementById("SvgAddIcon").style.fill = "var(--main-contrast-color)";
    }
}
function AddButtonUnHover() {
    if (document.getElementById('body').offsetWidth >= 640) {
        document.getElementById("SvgAddIcon").style.fill = "var(--main-color)";
    }
}

function /* Add Note Close Icon */
AddNoteCloseButtonHover() {
    document.getElementById("OpenNote_ToHomeButtonIcon").style.fill = "var(--main-contrast-color)";
}
function AddNoteCloseButtonOut() {
    document.getElementById("OpenNote_ToHomeButtonIcon").style.fill = "var(--main-color)";
}

// FUNCTIONS

var updateType = 0; var Updated = false; var newUpdateType = 0; var newUpdateChangelog = ''; var updateChangelog = ''; var updateVersion; newUpdateVersion = 0;
function CheckUpdates(fV) { updateVersion = fV;
    if (versions != 'Offline') {
        versions.forEach( u => { 
            if (u.v > fV && u.v <= parseInt(FluxAppBuild)) { 
                Updated = true;
                if (u.v > updateVersion) updateVersion = u.v; 
                if (updateType < u.t) {  if (updateType < 2 && u.t > 1 ) updateChangelog = ''; updateType = u.t;  }
                if ((updateType > 1 && u.t > 1) || (updateType == 1 && u.t == 1)) updateChangelog = updateChangelog + u.c + '\n';
            } else if (u.v > parseInt(FluxAppBuild)) {
                if (u.v > newUpdateVersion) newUpdateVersion = u.v; 
                if (newUpdateType < u.t) {  if (newUpdateType < 2 && u.t > 1 ) newUpdateChangelog = ''; newUpdateType = u.t;  }
                if ((newUpdateType > 1 && u.t > 1) || (newUpdateType == 1 && u.t == 1)) newUpdateChangelog = newUpdateChangelog + u.c + '\n';
            }
        })
        if (Updated) {
            console.log('[i] You were updated from '+fV+' to '+FluxAppBuild);
            console.log('[i] Changelog: '+updateChangelog)
        }
        if (newUpdateVersion>FluxAppBuild) {console.log('iNew version avaiable',newUpdateVersion)}
    } else console.log('[i] Updater Error:', 'You are offline');
}

window.addEventListener('load', function(){
    console.log('[i] Document Loaded');
    loadBody();
    Start();    
})