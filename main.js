function Start() {
    LoadNotes(false);
    registerSW();

    document.getElementById("AddNoteTitle").style.width = ((document.getElementById('body').offsetWidth)-82)+"px"; document.getElementById("AddNoteDescription").style.width = ((document.getElementById('body').offsetWidth)-82)+"px";

    document.getElementById("AddNoteWindow").style.visibility = "hidden";
    Resized(); 
}

function registerSW() { if ('serviceWorker' in navigator) { navigator.serviceWorker.register('sw.js', { scope: '/' }).then(() => { console.log('Service Worker registered successfully.'); }).catch(error => { console.log('Service Worker registration failed:', error); }); } }

function Resized() {
    if (document.getElementById('body').offsetWidth<640){ // MOBILE
        document.getElementById("SvgAddIcon").style.fill = "white";
        document.getElementById("AddNoteButton").setAttribute('class', 'FluxAppFloatingButton');
    }
    else{ // DESKTOP
        document.getElementById("SvgAddIcon").style.fill = "var(--main-color)";    
        document.getElementById("AddNoteButton").setAttribute('class', 'FluxAppButton');
    }

    document.getElementById("AddNoteTitle").style.width = ((document.getElementById('body').offsetWidth)-62-20)+"px";
    document.getElementById("AddNoteDescription").style.width = ((document.getElementById('body').offsetWidth)-62-20)+"px";
}

// BTN CLICKS

function DialogCreateNote(){ document.getElementById("add-note-window").style.visibility = "visible"; }

function CloseAddNoteWindow(){ document.getElementById("add-note-window").style.visibility = "hidden"; }

function DialogAccount(){}

function MobileDialogCreateNote(){ document.getElementById("AddNoteWindow").style.visibility = "visible"; }

function CreateNoteMobile(){ document.getElementById("AddNoteWindow").style.visibility = "hidden"; AddNote(document.getElementById("AddNoteTitle").value,document.getElementById("AddNoteDescription").value); }

function CloseDialogCreateNote(){ document.getElementById("AddNoteWindow").style.visibility = "hidden"; }

// INSTALL

let deferredPrompt; window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); console.log("BEFOREINSTALLPROPT"); deferredPrompt = e; }); window.addEventListener('appinstalled', (evt) => { app.logEvent('a2hs', 'installed'); });

// BTN ANIMATIONS

function /* Add Note icon */ AddButtonHover() { if (document.getElementById('body').offsetWidth>=640){ document.getElementById("SvgAddIcon").style.fill = "white"; } } function AddButtonUnHover() { if (document.getElementById('body').offsetWidth>=640){ document.getElementById("SvgAddIcon").style.fill = "var(--main-color)"; } }

function /* Mobile App Menu Icon */ AppMenuButtonHover() { document.getElementById("AppMenuButtonIcon").style.fill = "white"; } function AppMenuButtonUnHover() { document.getElementById("AppMenuButtonIcon").style.fill = "var(--main-color)"; }

function /* Add Note Close Icon */ AddNoteCloseButtonHover(){ document.getElementById("SvgCloseAddIcon").style.fill = "white"; } function AddNoteCloseButtonOut(){ document.getElementById("SvgCloseAddIcon").style.fill = "var(--main-color)"; }
