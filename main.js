function Start() {
    LoadNotes(false);
    registerSW();

    document.getElementById("AddNoteTitle").style.width = ((document.getElementById('body').offsetWidth)-82)+"px";
    document.getElementById("AddNoteDescription").style.width = ((document.getElementById('body').offsetWidth)-82)+"px";

    document.getElementById("AddNoteWindow").style.visibility = "hidden";
    Resized();

    var installPromptEvent;
    var btnInstall = document.querySelector('#install');
    
    window.addEventListener('beforeinstallprompt', function (event) {
        event.preventDefault();
        installPromptEvent = event;
        btnInstall.removeAttribute('disabled');
    });
    
    btnInstall.addEventListener('click', function () {
        btnInstall.setAttribute('disabled', '');
        installPromptEvent.prompt();
        installPromptEvent.userChoice.then((choice) => {
            if (choice.outcome === 'accepted') {
                console.log('User accepted the A2HS prompt');
            } else {
                console.log('User dismissed the A2HS prompt');
            }
            installPromptEvent = null;
        });
    });
    
}

function registerSW() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js', { scope: '/' }).then(() => {
          console.log('Service Worker registered successfully.');
        }).catch(error => {
          console.log('Service Worker registration failed:', error);
        });
      }
    }

function Resized() {
    if (document.getElementById('body').offsetWidth<640){
        // MOBILE
        document.getElementById("SvgAddIcon").style.fill = "white";
        document.getElementById("AddNoteButton").setAttribute('class', 'FluxAppFloatingButton');
    }
    else{
        // DESKTOP
        document.getElementById("SvgAddIcon").style.fill = "var(--main-color)";    
        document.getElementById("AddNoteButton").setAttribute('class', 'FluxAppButton');
        //document.getElementById("SearchBar").style.width = "205px";
    }
    document.getElementById("AddNoteTitle").style.width = ((document.getElementById('body').offsetWidth)-62-20)+"px";
    document.getElementById("AddNoteDescription").style.width = ((document.getElementById('body').offsetWidth)-62-20)+"px";
}

function DialogCreateNote(){
    document.getElementById("add-note-window").style.visibility = "visible";
}
function CloseAddNoteWindow(){
    document.getElementById("add-note-window").style.visibility = "hidden";
}

function DialogAccount(){
}

function MobileDialogCreateNote(){
    document.getElementById("AddNoteWindow").style.visibility = "visible";
}

function CreateNoteMobile(){
    document.getElementById("AddNoteWindow").style.visibility = "hidden";
    var title = document.getElementById("AddNoteTitle").value;
    var description = document.getElementById("AddNoteDescription").value;
    AddNote(title,description);
}

function CloseDialogCreateNote(){
    document.getElementById("AddNoteWindow").style.visibility = "hidden";
}

function SwitchDesktopView(){
    document.getElementById("MobileView").style.visibility = "hidden";
    document.getElementById("DesktopView").style.visibility = "visible";
}

function SwitchMobileView(){
    document.getElementById("DesktopView").style.visibility = "hidden";
    document.getElementById("MobileView").style.visibility = "visible";
}
