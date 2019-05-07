var theme = 'light';
function Start() {
    LoadNotes(false); registerSW(); Resized(); Theme(1);
    document.getElementById("AddNoteTitle").style.width = ((document.getElementById('body').offsetWidth)-82)+"px"; document.getElementById("AddNoteDescription").style.width = ((document.getElementById('body').offsetWidth)-82)+"px"; document.getElementById("AddNoteWindow").style.visibility = "hidden";
    Resized(); Theme(1);
}

function registerSW() { if ('serviceWorker' in navigator) { navigator.serviceWorker.register('sw.js', { scope: '/Notes/' }).then(() => { console.log('Service Worker registered successfully.'); }).catch(error => { console.log('Service Worker registration failed:', error); }); } }

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

function AppMenuButtonClick(){ Theme(2); console.log("Just a test hihi"); }

function MobileDialogCreateNote(){ document.getElementById("AddNoteWindow").style.visibility = "visible"; }

function CreateNoteMobile(){ document.getElementById("AddNoteWindow").style.visibility = "hidden"; AddNote(document.getElementById("AddNoteTitle").value,document.getElementById("AddNoteDescription").value); }

function CloseDialogCreateNote(){ document.getElementById("AddNoteWindow").style.visibility = "hidden"; }

// INSTALL

let deferredPrompt; window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); console.log("BEFOREINSTALLPROPT"); deferredPrompt = e; }); window.addEventListener('appinstalled', (evt) => { app.logEvent('a2hs', 'installed'); });

// BTN ANIMATIONS

function /* Add Note icon */ AddButtonHover() { 
    if (document.getElementById('body').offsetWidth>=640){ 
        document.getElementById("SvgAddIcon").style.fill = "var(--main-contrast-color)"; 
    } 
} function AddButtonUnHover() { if (document.getElementById('body').offsetWidth>=640){ document.getElementById("SvgAddIcon").style.fill = "var(--main-color)"; } }

function /* App Menu Icon */ AppMenuButtonHover() { 
    document.getElementById("AppMenuButtonIcon").style.fill = "var(--main-contrast-color)"; 
} function AppMenuButtonUnHover() { document.getElementById("AppMenuButtonIcon").style.fill = "var(--main-color)"; }

function /* Add Note Close Icon */ AddNoteCloseButtonHover(){ document.getElementById("SvgCloseAddIcon").style.fill = "white"; } function AddNoteCloseButtonOut(){ document.getElementById("SvgCloseAddIcon").style.fill = "var(--main-color)"; }

// FUNCTIONS

function Theme(mode){
    if (mode==2){ var ThemeOne='Dark'; } else { var ThemeOne='Light' }
    if (localStorage.getItem('AppTheme') == ThemeOne){
        var NewTheme = 'Light';
        document.documentElement.style.setProperty('--main-color', '#0075FF');
        document.documentElement.style.setProperty('--main-color-light', '#0075FF10');
        document.documentElement.style.setProperty('--main-shadow-color', '#0075FF40');
        document.documentElement.style.setProperty('--main-contrast-color', '#FFFFFF');
        document.documentElement.style.setProperty('--secondary-color', '#0075FF80');
        document.documentElement.style.setProperty('--background-color', '#FFFFFF');

    } else {
        var NewTheme = 'Dark';
        document.documentElement.style.setProperty('--main-color', '#FFFFFF');
        document.documentElement.style.setProperty('--main-color-light', '#FFFFFF10');
        document.documentElement.style.setProperty('--main-shadow-color', '#000000ff');
        document.documentElement.style.setProperty('--main-contrast-color', '#05050A');
        document.documentElement.style.setProperty('--secondary-color', '#FFFFFF80');
        document.documentElement.style.setProperty('--background-color', '#05050A');
    }
    
    localStorage.setItem('AppTheme', NewTheme);
}
