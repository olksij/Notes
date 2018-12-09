function Hello(){
    // Initialize Cloud Firestore through Firebase
    var db = firebase.firestore();

    // Disable deprecated features
    db.settings({
    timestampsInSnapshots: true
    });

    var UsersRef = db.collection('users').doc('alan.mathison@email.com');
    UsersRef.set({
        first: "Alan",
        last: "Turing",
        born: 1912
    })
    .then(function() {
        console.log("Document written with ID");
    })
    .catch(function() {
        console.error("Error adding document");
    });  
}