
function LoadGNotes(){
    var db = firebase.firestore(); db.settings({timestampsInSnapshots: true});

    db.collection("gnotes").doc('notes1-0').collection('notes').get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            console.log(doc.id,doc.data());
        });
    });


}

function CreateNote(){
    AddNote("Hello")
}

function AddNote(notetext){
    var db = firebase.firestore(); db.settings({timestampsInSnapshots: true});

    db.collection("gnotes").doc('notes1-0').collection('notes').add({
        title: notetext
    });
}
