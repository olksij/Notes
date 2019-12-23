var loadJSLinksFl = ['firebase.js','changelog.js','document.js','ripple.js']
function loadBody(){
    Translate()
    loadJSLinksFl.forEach( e => { 
        var temploader = document.createElement('script'); 
        temploader.setAttribute('src', e); 
        document.getElementsByTagName("head")[0].appendChild(temploader); 
    });
    var temploader = document.createElement('script'); 
    document.getElementsByTagName("head")[0].appendChild(temploader); 
}