var ColorAccent = '#0075ff';
function Start() {
    registerSW(); Resized(); Theme(1);
    document.getElementById("AddNoteTitle").style.width = ((document.getElementById('body').offsetWidth) - 82) + "px";
    document.getElementById("AddNoteDescription").style.width = ((document.getElementById('body').offsetWidth) - 82) + "px";
    document.getElementById("AddNoteWindow").style.display = 'none';
    Manifest();
}

function registerSW() {
    if ('serviceWorker'in navigator) {
        navigator.serviceWorker.register('sw.js', {
            scope: window.location.pathname
        }).then(()=>{
            console.log('%c[i]', 'color: blue', "SW registered");
        }).catch(error=>{
            console.error('[!] SW error:', error);
        });
    }
}

function Resized() {
    ResizeNote();
    setTimeout(function() {
        ResizeNote();
    }, 300);

    if (document.getElementById('body').offsetWidth < 657) { /* MOBILE */
        document.getElementById("SvgAddIcon").style.fill = "var(--main-contrast-color)";
        document.getElementById("AddNoteButton").setAttribute('class', 'FluxAppFloatingButton');
    } else { /* DESKTOP */
        document.getElementById("SvgAddIcon").style.fill = "var(--main-color)";
        document.getElementById("AddNoteButton").setAttribute('class', 'FluxAppButton');
    }

    document.getElementById("AddNoteTitle").style.width = ((document.getElementById('body').offsetWidth) - 82) + "px";
    document.getElementById("AddNoteDescription").style.width = ((document.getElementById('body').offsetWidth) - 62 - 20) + "px";
}

// BTN CLICKS

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

function OpenNote_ToHomeButton() {
    document.getElementById("OpenNoteWindow").style.display = "none";
}

function OpenNote_Delete() {
    DeleteNote(); OpenNote_ToHomeButton();
}

function DialogCreateNote() {
    document.getElementById("add-note-window").style.display = 'block';
}

function CloseAddNoteWindow() {
    document.getElementById("add-note-window").style.display = 'none';
}

function AppMenuButtonClick() {
    Theme(2);
}

function MobileDialogCreateNote() {
    document.getElementById("AddNoteWindow").style.display = 'block';
}

function CreateNoteMobile() {
    document.getElementById("AddNoteWindow").style.display = 'none';
    AddNote(document.getElementById("AddNoteTitle").value, document.getElementById("AddNoteDescription").value);
}

function CloseDialogCreateNote() {
    document.getElementById("AddNoteWindow").style.display = 'none';
}

// INSTALL

let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e)=>{
    e.preventDefault();
    deferredPrompt = e;
}
);
window.addEventListener('appinstalled', (evt)=>{
    app.logEvent('a2hs', 'installed');
}
);

// BTN ANIMATIONS

function /* Global Button Animation */
AppButtonHover(id) {
    document.getElementById(id).style.fill = "var(--main-contrast-color)";
}
function AppButtonOut(id) {
    document.getElementById(id).style.fill = "var(--main-color)";
}

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

function /* Notes */
NoteHover(id) {
    document.getElementById(id + '-NoteTitle').style.color = 'var(--main-contrast-color)';
    document.getElementById(id + '-NoteDescription').style.color = 'var(--secondary-contrast-color)';
    document.getElementById(id + '-NoteDate').style.color = 'var(--secondary-contrast-color)';
}
function NoteMouseOut(id) {
    document.getElementById(id + '-NoteTitle').style.color = 'var(--main-color)';
    document.getElementById(id + '-NoteDescription').style.color = 'var(--secondary-color)';
    document.getElementById(id + '-NoteDate').style.color = 'var(--secondary-color)';
}

// FUNCTIONS

function ResizeNote() {
    var g_height = 96;
    for (var i = 0; notes.length > i; i++) {
        document.getElementById(notes[i] + "-NoteCard").style.height = (76 + document.getElementById(notes[i] + "-NoteDescription").offsetHeight) + "px";
        document.getElementById(notes[i] + "-NoteCard").style.top = g_height + "px";
        g_height = g_height + 20 + document.getElementById(notes[i] + "-NoteCard").offsetHeight;
    }
}

function Theme(mode) {
    if (localStorage.getItem('AppTheme') != 'BlueLight' && localStorage.getItem('AppTheme') != 'BlackLight' && localStorage.getItem('AppTheme') != 'Dark') {
        localStorage.setItem('AppTheme', 'BlueLight');
    }
    if (mode == 2) {
        var ThemeOne = ['Dark', 'BlueLight', 'BlackLight'];
    } else {
        var ThemeOne = ['BlueLight', 'BlackLight', 'Dark'];
    }
    if (localStorage.getItem('AppTheme') == ThemeOne[0]) {
        var Theme = 'Colored';
        document.documentElement.style.setProperty('--main-color', ColorAccent);
        document.documentElement.style.setProperty('--main-color-light', ColorAccent+'10');
        document.documentElement.style.setProperty('--main-shadow-color', ColorAccent+'40');
        document.documentElement.style.setProperty('--main-contrast-color', '#FFFFFF');
        document.documentElement.style.setProperty('--secondary-color', ColorAccent+'80');
        document.documentElement.style.setProperty('--background-color', '#FFFFFF');
        document.documentElement.style.setProperty('--hover-color', ColorAccent);
        document.documentElement.style.setProperty('--hover-c-color', '#FFFFFF');
        document.documentElement.style.setProperty('--secondary-contrast-color', '#FFFFFFA0');
    } else if (localStorage.getItem('AppTheme') == ThemeOne[1]) {
        var Theme = 'Light';
        document.documentElement.style.setProperty('--main-color', '#05050A');
        document.documentElement.style.setProperty('--main-color-light', '#05050A07');
        document.documentElement.style.setProperty('--main-shadow-color', '#05050A20');
        document.documentElement.style.setProperty('--main-contrast-color', '#05050A');
        document.documentElement.style.setProperty('--secondary-color', '#05050A80');
        document.documentElement.style.setProperty('--background-color', '#FFFFFF');
        document.documentElement.style.setProperty('--hover-color', '#FFFFFF');
        document.documentElement.style.setProperty('--hover-c-color', '#05050A');
        document.documentElement.style.setProperty('--secondary-contrast-color', '#00000080');
    } else {
        var Theme = 'Dark';
        document.documentElement.style.setProperty('--main-color', '#FFFFFF');
        document.documentElement.style.setProperty('--main-color-light', '#FFFFFF10');
        document.documentElement.style.setProperty('--main-shadow-color', '#00000030');
        document.documentElement.style.setProperty('--main-contrast-color', '#05050A');
        document.documentElement.style.setProperty('--secondary-color', '#FFFFFF80');
        document.documentElement.style.setProperty('--background-color', '#05050A');
        document.documentElement.style.setProperty('--hover-color', '#FFFFFF');
        document.documentElement.style.setProperty('--hover-c-color', '#05050A');
        document.documentElement.style.setProperty('--secondary-contrast-color', '#00000080');
    }
    localStorage.setItem('AppTheme', Theme);
}

// INITIALIZATION

function Manifest(DynamicManifest) {
    if (!DynamicManifest) {
        var DynamicManifest = {
            "name": "Flux Notes",
            "short_name": "Notes",
            "lang": "en-US",
            "start_url": window.location.href,
            "display": "standalone",
            "theme_color": "#FFFFFF00",
            "icons": [{
                "src": window.location.href + "Assets/AppIcon.png",
                "sizes": "192x192",
                "type": "image/png"
            }, {
                "src": window.location.href + "Assets/AppIcon512.png",
                "sizes": "512x512",
                "type": "image/png"
            }],
        }
    }
    const stringManifest = JSON.stringify(DynamicManifest);
    const blob = new Blob([stringManifest],{
        type: 'application/json'
    });
    const manifestURL = URL.createObjectURL(blob);
    document.getElementById('manifest-object').setAttribute('href', manifestURL);
}
