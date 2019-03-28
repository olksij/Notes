function Start() {
    LoadNotes(false);

    document.getElementById("SearchBar").style.width = ((document.getElementById('body').offsetWidth)-116-76)+"px";
    document.getElementById("AddNoteTitle").style.width = ((document.getElementById('body').offsetWidth)-82)+"px";
    document.getElementById("AddNoteDescription").style.width = ((document.getElementById('body').offsetWidth)-82)+"px";

    document.getElementById("AddNoteWindow").style.visibility = "hidden";
}

function Resized() {
    if (document.getElementById('body').offsetWidth>=500){
        SwitchDesktopView();
    }
    else{
        SwitchMobileView();
    }

    document.getElementById("AddNoteTitle").style.width = ((document.getElementById('body').offsetWidth)-62-20)+"px";
    document.getElementById("AddNoteDescription").style.width = ((document.getElementById('body').offsetWidth)-62-20)+"px";
    document.getElementById("SearchBar").style.width = ((document.getElementById('body').offsetWidth)-116-76)+"px";

    for (var i=1; i<=notes.length; i++) {
        //document.getElementById(notes[i-1]+"Mobile").style.width = ((document.getElementById('body').offsetWidth)-40)+"px";
    }
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
