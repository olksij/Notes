window.addEventListener('load', function(){
    print('iDocument Loaded');
    loadBody();
    Start();    
})

function AppLoaded(){
    document.getElementById('body').style.overflowY = 'auto';
    //document.getElementById('SplashScreen').style.display = 'none';
}

function DBNotesLoaded(){
    document.getElementById('body').style.overflowY = 'auto';
    //document.getElementById('SplashScreen').style.display = 'none';
}

function Theme(UpdateTo) {
    if (UpdateTo != undefined) AppTheme = UpdateTo;
    if (AppTheme == 'Custom') {
        document.documentElement.style.setProperty('--main-color', ColorAccent);
        document.documentElement.style.setProperty('--main-color-light', ColorAccent+'10');
        document.documentElement.style.setProperty('--main-shadow-color', ColorAccent+'40');
        document.documentElement.style.setProperty('--main-contrast-color', '#FFFFFF');
        document.documentElement.style.setProperty('--secondary-color', ColorAccent+'80');
        document.documentElement.style.setProperty('--background-color', '#FFFFFF');
        document.documentElement.style.setProperty('--hover-color', ColorAccent);
        document.documentElement.style.setProperty('--hover-c-color', '#FFFFFF');
        document.documentElement.style.setProperty('--secondary-contrast-color', '#FFFFFFA0');
    } else if (AppTheme == 'Dark') {
        document.documentElement.style.setProperty('--main-color', '#FFFFFF');
        document.documentElement.style.setProperty('--main-color-light', '#0A0A0A');
        document.documentElement.style.setProperty('--main-shadow-color', '#000000');
        document.documentElement.style.setProperty('--main-contrast-color', '#FFFFFF');
        document.documentElement.style.setProperty('--secondary-color', '#FFFFFF80');
        document.documentElement.style.setProperty('--background-color', '#050505');
        document.documentElement.style.setProperty('--hover-color', '#101010');
        document.documentElement.style.setProperty('--hover-c-color', '#FFFFFF');
        document.documentElement.style.setProperty('--secondary-contrast-color', '#FFFFFF80');
    } else {
        document.documentElement.style.setProperty('--main-color', '#05050A');
        document.documentElement.style.setProperty('--main-color-light', '#05050A07');
        document.documentElement.style.setProperty('--main-shadow-color', '#05050A20');
        document.documentElement.style.setProperty('--main-contrast-color', '#05050A');
        document.documentElement.style.setProperty('--secondary-color', '#05050A80');
        document.documentElement.style.setProperty('--background-color', '#FFFFFF');
        document.documentElement.style.setProperty('--hover-color', '#FFFFFF');
        document.documentElement.style.setProperty('--hover-c-color', '#05050A');
        document.documentElement.style.setProperty('--secondary-contrast-color', '#00000080');
        AppTheme = 'Light';
    }
    UpdateSettings('AppTheme', AppTheme);
}

