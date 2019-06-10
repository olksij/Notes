var account;
var provider = new firebase.auth.GoogleAuthProvider(); firebase.auth().useDeviceLanguage();

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        account = user;
        pt('iUser',account.email);
        SyncNotes();
    } else {
        firebase.auth().signInWithRedirect(provider);
    }
});

firebase.auth().getRedirectResult().then(function(result) {
    if (result.credential) {
        account = result.credential.accessToken;
    }
}).catch(function(error) {
    pt('!Auth', 'Error (' + error.code + '): ' + error.message);
});