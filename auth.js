var provider = new firebase.auth.GoogleAuthProvider();
firebase.auth().onAuthStateChanged(function(user) {
    if (AccountEmail != undefined) { if (AccountEmail != user.email) { firebase.auth().signInWithRedirect(provider); console.log(AccountEmail) } else { AccountEmail = user.email; } }
    else { if (user) { AccountEmail = user.email; UpdateSettings('AccountEmail',user.email); print('iUser',AccountEmail); SyncFData(); } else { firebase.auth().signInWithRedirect(provider); } }
});

firebase.auth().getRedirectResult().then(function(result) {
    if (result.user) { 
        AccountEmail = result.user.email; 
        UpdateSettings('AccountEmail',result.user.email);
        SyncFData();
    }
}).catch(function(error) { print('!Auth', 'Error (' + error.code + '): ' + error.message); });
