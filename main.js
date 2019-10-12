var ColorAccent = '#0075FF';

function Start() {
    registerSW(); Resized(); Theme(AppTheme)
    document.getElementById("AddNoteTitle").style.width = ((document.getElementById('body').offsetWidth) - 82) + "px";
    document.getElementById("AddNoteDescription").style.width = ((document.getElementById('body').offsetWidth) - 82) + "px";
    document.getElementById("AddNoteWindow").style.display = 'none';

    var metaThemeColor = document.getElementsByTagName('meta');
    metaThemeColor[metaThemeColor.length-1].setAttribute('content',AppTheme == 'Dark' ? '#05050A' : '#FFFFFF');

    print('iVersion',FluxAppBuild);

    if (typeof(fromVersion) != 'undefined') CheckUpdates();

    //setInterval(CheckUpdates(), 1000);
}

function registerSW() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js', {
            scope: window.location.pathname
        }).then(()=>{ print('iService Worker',"registered");
        }).catch(error=>{ print('!Service Worker Error', + error); });
    }
}

function Resized() {
    ResizeNote(); setTimeout(function() { ResizeNote(); }, 300);

    if (document.body.offsetWidth < 657) { /* MOBILE */
        document.getElementById("Settings_ToHomeButton").setAttribute('class', 'FluxAppFloatingButton');
    } else { /* DESKTOP */
        document.getElementById("Settings_ToHomeButton").setAttribute('class', 'FluxAppButton');
    }

    document.getElementById("AddNoteTitle").style.width = (document.body.offsetWidth - 82) + "px";
    document.getElementById("AddNoteDescription").style.width = (document.body.offsetWidth - 62 - 20) + "px";

    setTimeout(function() { Scrolled(); }, 300);
}

function Scrolled() {
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

window.addEventListener('appinstalled', () => { print('iYay!', 'App was intalled by user!'); });

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

function Theme(UpdateTo) {
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
        AppTheme = 'Light';
    }
    UpdateSettings('AppTheme', AppTheme);
}

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
            print('iYou were updated from '+fV+' to '+FluxAppBuild);
            print('iChangelog: '+updateChangelog)
        }
        if (newUpdateVersion>FluxAppBuild) {print('iNew version avaiable',newUpdateVersion)}
    } else print('iUpdater Error', 'You are offline');
}
