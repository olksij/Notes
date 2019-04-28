function Start() {
    LoadNotes(false);
    registerSW();

    document.getElementById("AddNoteTitle").style.width = ((document.getElementById('body').offsetWidth)-82)+"px"; document.getElementById("AddNoteDescription").style.width = ((document.getElementById('body').offsetWidth)-82)+"px";

    document.getElementById("AddNoteWindow").style.visibility = "hidden";
    Resized(); 
}

function registerSW() { if ('serviceWorker' in navigator) { navigator.serviceWorker.register('sw.js', { scope: 'https://alexbesida.github.io/Notes/' }); } }

function Resized() {
    if (document.getElementById('body').offsetWidth<640){ /* MOBILE */ document.getElementById("SvgAddIcon").style.fill = "white"; document.getElementById("AddNoteButton").setAttribute('class', 'FluxAppFloatingButton'); }
    else{ /* DESKTOP */ document.getElementById("SvgAddIcon").style.fill = "var(--main-color)";     document.getElementById("AddNoteButton").setAttribute('class', 'FluxAppButton'); }
    document.getElementById("AddNoteTitle").style.width = ((document.getElementById('body').offsetWidth)-62-20)+"px"; document.getElementById("AddNoteDescription").style.width = ((document.getElementById('body').offsetWidth)-62-20)+"px";
}

/* 
-------------------------------------------
         BUTTON CLICKS
---------------------------------------------
*/

function DialogCreateNote(){ document.getElementById("add-note-window").style.visibility = "visible"; }

function CloseAddNoteWindow(){ document.getElementById("add-note-window").style.visibility = "hidden"; }

function DialogAccount(){}

function MobileDialogCreateNote(){ document.getElementById("AddNoteWindow").style.visibility = "visible"; }

function CreateNoteMobile(){ document.getElementById("AddNoteWindow").style.visibility = "hidden"; AddNote(document.getElementById("AddNoteTitle").value,document.getElementById("AddNoteDescription").value); }

function CloseDialogCreateNote(){ document.getElementById("AddNoteWindow").style.visibility = "hidden"; }

/* 
-------------------------------------------
         INSTALL
---------------------------------------------
*/

let deferredPrompt; window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferredPrompt = e; }); window.addEventListener('appinstalled', (evt) => { app.logEvent('a2hs', 'installed'); });

/* 
-------------------------------------------
         BUTTONS
---------------------------------------------
*/

// Add Note Icon ---------------------------------------

function AddButtonHover() { if (document.getElementById('body').offsetWidth>=640){ document.getElementById("SvgAddIcon").style.fill = "white"; } } function AddButtonUnHover() { if (document.getElementById('body').offsetWidth>=640){ document.getElementById("SvgAddIcon").style.fill = "var(--main-color)";}}

// Mobile App Menu Icon ---------------------------------------

function AppMenuButtonHover() { document.getElementById("AppMenuButtonIcon").style.fill = "white"; } function AppMenuButtonUnHover() { document.getElementById("AppMenuButtonIcon").style.fill = "var(--main-color)";     }

// Add Note Close Icon ---------------------------------------

function AddNoteCloseButtonHover(){ document.getElementById("SvgCloseAddIcon").style.fill = "white"; } function AddNoteCloseButtonOut(){ document.getElementById("SvgCloseAddIcon").style.fill = "var(--main-color)"; }

