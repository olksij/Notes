var account;
var provider = new firebase.auth.GoogleAuthProvider(); firebase.auth().useDeviceLanguage();

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        account = user;
        console.log("%c[i]",'color: blue', account.email);
        SyncNotes();
    } else {
        firebase.auth().signInWithRedirect(provider);
    }
});

firebase.auth().getRedirectResult().then(function(result) {
    if (result.credential) {
        account = result.credential.accessToken;
        console.log("%c[i]",'color: blue', account.email);
        SyncNotes();
    }
}).catch(function(error) {
    console.error("[!] Error (" + error.code + "): " + error.message);
});