indexedDB.open("NotesDB",parseInt(FluxAppBuild)).onsuccess = (e) => {
    var SettingsDB = e.target.result;
    if (SettingsDB.objectStoreNames.contains('Notes')) {
        SettingsDB.transaction(['Notes'], 'readwrite').objectStore('Notes').getAll().onsuccess = r => {
            if (r.target.result!=undefined){
                window.dbnotes = r.target.result;
                LoadDBNotes(r.target.result,'');
                ResizeNote(true); setTimeout(function() { ResizeNote(true); }, 300);  
                print('iDatabase notes are loaded');
                //document.getElementById('body').style.overflowY = 'auto';
                //document.getElementById('SplashScreen').style.display = 'none';
            }
        }
    }
}

function SyncDBNotes(type,data){
    if (SettingsDB != undefined){
        if (type=='clear') { SettingsDB.transaction(['Notes'], "readwrite").objectStore("Notes").clear(); }
        else if (type == 'add') { SettingsDB.transaction("Notes", "readwrite").objectStore("Notes").add(data); }
        else if (type == 'remove') { SettingsDB.transaction("Notes", "readwrite").objectStore("Notes").delete(data); }    
    }
}

function ResizeNote(db) {
    var g_height = 96;
    if (db){
        dbnotes.forEach(i=>{
            document.getElementById(i.id + "-NoteCard").style.height = (38 + document.getElementById(i.id + "-NoteDescription").offsetHeight) + "px";
            g_height = g_height + 20 + document.getElementById(i.id + "-NoteCard").offsetHeight;
        })    
    } else {
        if (notes){
            notes.forEach(i=>{
                document.getElementById(i + "-NoteCard").style.height = (38 + document.getElementById(i + "-NoteDescription").offsetHeight) + "px";
                g_height = g_height + 20 + document.getElementById(i + "-NoteCard").offsetHeight;
            })       
        }
    }
    if (document.offsetWidth < 657) { /* MOBILE */
        document.getElementById("NoteList").style.height = (g_height)+'px';
    } else {
        document.getElementById("NoteList").style.height = (g_height-76)+'px';
    }
}

function LoadDBNotes(list,folder){
    list.forEach(n => {
        if (NotesFolderOpened == folder){
            var NoteCard = document.createElement("div");
            NoteCard.setAttribute('class', 'NoteCard ripple');
            NoteCard.setAttribute('id', n.id + "-NoteCard");
            NoteCard.setAttribute('onclick', "OpenNote('" + n.id + "')");
            document.getElementById("NoteList").appendChild(NoteCard);
        
            var NoteTitle = document.createElement("p");
            NoteTitle.innerHTML = n.data.title;
            NoteTitle.setAttribute('class', 'NoteTitle');
            NoteTitle.setAttribute('id', n.id + "-NoteTitle");
            document.getElementById(n.id + "-NoteCard").appendChild(NoteTitle);
        
            var NoteDescription = document.createElement("p");
            NoteDescription.innerHTML = n.data.description;
            NoteDescription.setAttribute('class', 'NoteDescription');
            NoteDescription.setAttribute('id', n.id + "-NoteDescription");
            document.getElementById(n.id + "-NoteCard").appendChild(NoteDescription);
        
            var NoteDate = document.createElement("p");
            NoteDate.innerHTML = n.data.date;
            NoteDate.setAttribute('class', 'NoteDate');
            NoteDate.setAttribute('id', n.id + "-NoteDate");
            document.getElementById(n.id + "-NoteCard").appendChild(NoteDate);
        
            var NoteCardC = document.getElementById(n.id + "-NoteCard");
            NoteCardC.style.height = (38 + NoteDescription.offsetHeight) + "px";
            //NoteCardC.style.top = g_r_height + "px";
            g_r_height = g_r_height + 20 + NoteCardC.offsetHeight;
            //document.getElementById(notes[i - 1] + "-NoteCard").style.top = NoteCardC.style.top;
            document.getElementById(n.id + "-NoteCard").style.height = NoteCardC.style.height;    
        }
    })
}
