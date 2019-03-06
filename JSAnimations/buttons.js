// Add Note Icon ---------------------------------------

function AddButtonHover() {
    var x = document.getElementById("SvgAddIcon");
    x.style.fill = "white";
}

function AddButtonUnHover() {
    var x = document.getElementById("SvgAddIcon");
    x.style.fill = "var(--main-color)";
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

// Mobile User Account Icon ---------------------------------------

function MobileUserButtonHover() {
    var x = document.getElementById("MobileSvgAccountIcon");
    x.style.fill = "white";
}

function MobileUserButtonUnHover() {
    var x = document.getElementById("MobileSvgAccountIcon");
    x.style.fill = "var(--main-color)";
}