var account = localStorage.getItem('AuthToken');
var ReloadToken;
var provider = new firebase.auth.GoogleAuthProvider();
firebase.auth().useDeviceLanguage();

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        account = user;
        console.log("%c[i]",'color: blue', account.email);
    } else {
        firebase.auth().signInWithRedirect(provider);
    }
});

firebase.auth().getRedirectResult().then(function(result) {
    if (result.credential) {
        account = result.credential.accessToken;
    }
}).catch(function(error) {
    console.error("[!] Error (" + error.code + "): " + error.message);
});