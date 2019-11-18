var ColorAccent = '#0075FF';
registerSW(); Resized();
document.getElementById("AddNoteTitle").style.width = ((document.getElementById('body').offsetWidth) - 82) + "px";
document.getElementById("AddNoteDescription").style.width = ((document.getElementById('body').offsetWidth) - 82) + "px";
document.getElementById("AddNoteWindow").style.display = 'none';
console.log('[i] Version:',AppPublicVersion);
if (typeof(fromVersion) != 'undefined') CheckUpdates();

window.addEventListener('scroll',Scrolled());
window.addEventListener('resize',Resized());

function registerSW() { if ('serviceWorker' in navigator) { navigator.serviceWorker.register('sw.js'); } }

function Resized() {
    ResizeNote(); setTimeout(function() { ResizeNote(); }, 300);

    if (document.getElementById("AddNoteButton")){
        document.getElementById("AddNoteTitle").style.width = (document.body.offsetWidth - 82) + "px";
        document.getElementById("AddNoteDescription").style.width = (document.body.offsetWidth - 62 - 20) + "px";

        setTimeout(function() { Scrolled(); }, 300);
    }
}

function Scrolled() {
    if (document.getElementById("AddNoteButton")){
        if (document.body.offsetWidth < 657) {
            if (Math.round(document.scrollingElement.scrollTop) == (document.scrollingElement.scrollHeight - document.getElementById('body').offsetHeight)) 
            { document.getElementById("AddNoteButton").setAttribute('class', 'ripple FA2Button');
            } else { document.getElementById("AddNoteButton").setAttribute('class', 'ripple FA2Button Floating'); }
        } else {
            if (document.scrollingElement.scrollTop == 0) 
            { document.getElementById("AddNoteButton").setAttribute('class', 'ripple FA2Button');
            } else { document.getElementById("AddNoteButton").setAttribute('class', 'ripple FA2Button Floating'); }
        }
    
        if (document.scrollingElement.scrollTop == 0) {
            document.getElementById("SearchBar").setAttribute('class', 'FluxAppSearchBar ripple FA2Button');
            document.getElementById("AppMenuButton").setAttribute('class', 'FluxAppButton ripple FA2Button');
        } else {
            document.getElementById("SearchBar").setAttribute('class', 'FluxAppSearchBar ripple FA2Button Floating');
            document.getElementById("AppMenuButton").setAttribute('class', 'ripple FA2Button Floating');
        }    
    }
}

// --- BTN CLICKS ---

var OpenedNote;
function OpenNote(id) {
    var idl = notes.indexOf(id);
    OpenedNote = id;
    document.getElementById("OpenNoteWindow").style.display = "block";
    document.getElementById("OpenNoteTitle").innerHTML = data[idl].title;
    document.getElementById("OpenNoteDescription").innerHTML = data[idl].description;
    document.getElementById("OpenNoteDate").innerHTML = data[idl].date;
    document.getElementById("OpenNoteCard").style.height = (76 + document.getElementById("OpenNoteDescription").offsetHeight) + "px";
    FA2Animation('+','OpenNoteWindow');
}

function OpenSettings(){document.getElementById('SettingsWindow').style.display = 'block';  AppMenuButtonClick(false);}

function CloseSettings(){document.getElementById('SettingsWindow').style.display = 'none';}

function OpenNote_Delete() { DeleteNote(); FA2Animation('-','OpenNoteWindow'); }

function Settings_ReloadApp() { location.reload(true); }

var quickSettingsOpened = false;
function AppMenuButtonClick(refresh) {
    if ((!quickSettingsOpened && !refresh) || (quickSettingsOpened && refresh)) {
        document.getElementById('AppQuickSettings').innerHTML = '';
        quickSettingsOpened = true;
        document.getElementById('AppQuickSettings').style.height = userSettings.labels.length==0 ? '96px' : (162+userSettings.labels.length*66)+'px';
        document.getElementById('AppQuickSettings').style.opacity = '1';
        document.getElementById('AppQuickSettings').style.marginTop = '20px';

        var AQSLabels = userSettings.labels.length==0 ? '' : `
        <div id="AQSLabel_All_Notes" class="AQSLabel`+(NotesLabelOpened==''?' Active':'')+`">
            <p id="AQSLabelName_All Notes" class="AQSLabelName">All Notes</p>
            <p id="AQSLabelCount_All Notes" class="AQSLabelCount">`+notes.length+`</p>
        </div>`;
        userSettings.labels.forEach((f)=>{
            AQSLabels+=`
            <div id="AQSLabel_`+f.id+`" class="AQSLabel`+(NotesLabelOpened==f.name?' Active':'')+`">
                <p id="AQSLabelName_`+f.id+`" class="AQSLabelName">`+f.name+`</p>
                <p id="AQSLabelCount_`+f.id+`" class="AQSLabelCount">`+f.count+`</p>
            </div>`
        });   

        AQSLabels+=`
        <div id="AQSFooter">
            <div id="AQSAddLabel" class="FA2Button ripple" onclick="AQSAddLabel()">
                <p>Add Label</p>
            </div>
            <div id="AQSSettings" class='FluxAppButton FA2Button ripple' onclick="FA2Animation('+','SettingsWindow')">
                <svg id="AQSSIcon" width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21.0493 14.0562C21.0926 13.7096 21.1251 13.3575 21.1251 13C21.1251 12.6425 21.0926 12.2904 21.0493 11.9437L23.3405 10.1508C23.5464 9.98833 23.606 9.69583 23.4705 9.4575L21.3039 5.70375C21.1685 5.47083 20.8868 5.37333 20.643 5.47083L17.9455 6.55958C17.3876 6.13166 16.7755 5.76875 16.1147 5.4925L15.7085 2.62166C15.6597 2.36708 15.4376 2.16666 15.1668 2.16666H10.8335C10.5626 2.16666 10.3405 2.36708 10.2972 2.62166L9.89095 5.4925C9.23012 5.76875 8.61803 6.12625 8.06012 6.55958L5.36262 5.47083C5.11887 5.37875 4.8372 5.47083 4.70179 5.70375L2.53512 9.4575C2.3997 9.69041 2.45929 9.98291 2.66512 10.1508L4.95095 11.9437C4.90762 12.2904 4.87512 12.6425 4.87512 13C4.87512 13.3575 4.90762 13.7096 4.95095 14.0562L2.66512 15.8492C2.45929 16.0117 2.3997 16.3042 2.53512 16.5425L4.70179 20.2962C4.8372 20.5292 5.11887 20.6267 5.36262 20.5292L8.06012 19.4404C8.61803 19.8683 9.23012 20.2312 9.89095 20.5075L10.2972 23.3783C10.3405 23.6329 10.5626 23.8333 10.8335 23.8333H15.1668C15.4376 23.8333 15.6597 23.6329 15.703 23.3783L16.1093 20.5075C16.7701 20.2312 17.3822 19.8737 17.9401 19.4404L20.6376 20.5292C20.8814 20.6212 21.163 20.5292 21.2985 20.2962L23.4651 16.5425C23.6005 16.3096 23.541 16.0171 23.3351 15.8492L21.0493 14.0562ZM13.0001 16.7917C10.9039 16.7917 9.20845 15.0962 9.20845 13C9.20845 10.9037 10.9039 9.20833 13.0001 9.20833C15.0964 9.20833 16.7918 10.9037 16.7918 13C16.7918 15.0962 15.0964 16.7917 13.0001 16.7917Z" stroke="var(--main-color)" stroke-width="2.5"/>
                </svg>
            </div>
        </div>`      
        document.getElementById('AppQuickSettings').innerHTML = AQSLabels;
    } else {
        quickSettingsOpened = false;
        var t = document.getElementById('AppQuickSettings').offsetHeight;
        document.getElementById('AppQuickSettings').style.height = t/2+'px';
        document.getElementById('AppQuickSettings').style.marginTop = '-'+t/2-20+'px';
        document.getElementById('AppQuickSettings').style.opacity = '0';
    }

    Resized();
}

function AQSAddLabel(){
    document.getElementById('NewLabelShadow').style.display = 'block';
    document.getElementById('NewLabelShadow').style.opacity = '1';
}

function CancelNewLabel(){
    document.getElementById('NewLabelShadow').style.display = 'none';
    document.getElementById('NewLabelShadow').style.opacity = '0';
}

function CreateNewLabel(){
    var label = document.getElementById('NLNI').value;
    if (userSettings.labels.indexOf(label) != -1 || label.indexOf('_') != -1){
        console.error('ERROR');
    } else {
        var labelid = label.replace(' ','_');
        console.log(labelid);
        userSettings.labels.push({name: label, count: 0, id:labelid});
        UpdateSettings();
        CancelNewLabel();
        AppMenuButtonClick(true);
    }
}

var PageScaleNumber1=['1','0.9','0.81']
var PageScaleNumber2=['1.111','1.233','1.233']
function FA2Animation(s,id){
    qwer='all 0.3s cubic-bezier(0.9, 0, 0, 1)';
    document.getElementById(id).parentNode.style.transition = qwer;
    document.getElementById(id).style.transition = qwer;
    var prntcls = document.getElementById(id).parentNode.classList;
    if (s=='-'){
        document.getElementById(id).animate([{opacity: 1},{opacity: 0}],{easing:'cubic-bezier(0.9, 0, 0, 1)',duration:300});
        document.getElementById(id).parentNode.style.transform = 'scale('+PageScaleNumber1[parseInt(prntcls[prntcls.length-1].slice(4,5))-1]+')';
        setTimeout(()=>{document.getElementById(id).style.display = 'none';},300)
    } else {
        document.getElementById(id).style.display = 'block';
        document.getElementById(id).animate([{opacity: 0},{opacity: 1}],{easing:'cubic-bezier(0.9, 0, 0, 1)',duration:300});
        document.getElementById(id).style.opacity = 1;
        document.getElementById(id).parentNode.style.transform = 'scale(1.111)';
    }
}
function OpenThemeSettings(){document.getElementById("ThemeSettings").style.display = 'block';}

function ThemeSettingsTheme(){}

function MobileDialogCreateNote() { document.getElementById("AddNoteWindow").style.display = 'block'; }

function CreateNoteMobile() { /*document.getElementById("AddNoteWindow").style.display = 'none'; AddNote(document.getElementById("AddNoteTitle").value, document.getElementById("AddNoteDescription").value); */}

function CloseDialogCreateNote() { document.getElementById("AddNoteWindow").style.display = 'none'; }

// INSTALL

window.addEventListener('appinstalled', () => { console.log('[i] Yay:', 'App was intalled by user!'); });

function /* Add Note icon */ 
AddButtonHover() {
    if (document.getElementById('body').offsetWidth >= 640) {
        document.getElementById("SvgAddIcon").style.fill = "var(--main-contrast-color)";
    }
}
function AddButtonUnHover() {
    if (document.getElementById('body').offsetWidth >= 640) {
        document.getElementById("SvgAddIcon").style.fill = "var(--main-color)";
    }
}

function /* Add Note Close Icon */
AddNoteCloseButtonHover() {
    document.getElementById("OpenNote_ToHomeButtonIcon").style.fill = "var(--main-contrast-color)";
}
function AddNoteCloseButtonOut() {
    document.getElementById("OpenNote_ToHomeButtonIcon").style.fill = "var(--main-color)";
}

// FUNCTIONS

var updateType = 0; var Updated = false; var newUpdateType = 0; var newUpdateChangelog = ''; var updateChangelog = ''; var updateVersion; newUpdateVersion = 0;
function CheckUpdates(fV) { updateVersion = fV;
    if (versions != 'Offline') {
        versions.forEach( u => { 
            if (u.v > fV && u.v <= parseInt(AppPublicVersion)) { 
                Updated = true;
                if (u.v > updateVersion) updateVersion = u.v; 
                if (updateType < u.t) {  if (updateType < 2 && u.t > 1 ) updateChangelog = ''; updateType = u.t;  }
                if ((updateType > 1 && u.t > 1) || (updateType == 1 && u.t == 1)) updateChangelog = updateChangelog + u.c + '\n';
            } else if (u.v > parseInt(AppPublicVersion)) {
                if (u.v > newUpdateVersion) newUpdateVersion = u.v; 
                if (newUpdateType < u.t) {  if (newUpdateType < 2 && u.t > 1 ) newUpdateChangelog = ''; newUpdateType = u.t;  }
                if ((newUpdateType > 1 && u.t > 1) || (newUpdateType == 1 && u.t == 1)) newUpdateChangelog = newUpdateChangelog + u.c + '\n';
            }
        })
        if (Updated) {
            console.log('[i] You were updated from '+fV+' to '+AppPublicVersion);
            console.log('[i] Changelog: '+updateChangelog)
        }
        if (newUpdateVersion>AppPublicVersion) {console.log('iNew version avaiable',newUpdateVersion)}
    } else console.log('[i] Updater Error:', 'You are offline');
}