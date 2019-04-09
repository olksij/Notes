// Add Note Icon ---------------------------------------

function AddButtonHover() {
    if (document.getElementById('body').offsetWidth>=640){
        document.getElementById("SvgAddIcon").style.fill = "white";
    }
}

function AddButtonUnHover() {
    if (document.getElementById('body').offsetWidth>=640){
        document.getElementById("SvgAddIcon").style.fill = "var(--main-color)";    
    }
}

// Create Note Text ---------------------------------------

function AddNoteHover() {
    var x = document.getElementById("add-note-accept-p");
    x.style.color = "white";
}

function AddNoteUnHover() {
    var x = document.getElementById("add-note-accept-p");
    x.style.color = "var(--main-color)";
}

// User Account Icon ---------------------------------------

function UserButtonHover() {
    var x = document.getElementById("SvgAccountIcon");
    x.style.fill = "white";
}

function UserButtonUnHover() {
    var x = document.getElementById("SvgAccountIcon");
    x.style.fill = "var(--main-color)";
}

// Mobile App Menu Icon ---------------------------------------

function AppMenuButtonHover() {
    document.getElementById("AppMenuButtonIcon").style.fill = "white";
}

function AppMenuButtonUnHover() {
    document.getElementById("AppMenuButtonIcon").style.fill = "var(--main-color)";    
}

// Add Note Close Icon ---------------------------------------

function AddNoteCloseButtonHover(){
    document.getElementById("SvgCloseAddIcon").style.fill = "white";
}

function AddNoteCloseButtonOut(){
    document.getElementById("SvgCloseAddIcon").style.fill = "var(--main-color)";
}