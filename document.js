registerSW(); Resized(); console.log('[i] Version:',AppPublicVersion);

document.getElementById('SearchBar').addEventListener('input',SearchChange)
document.getElementById('ScreenContrastSlider').addEventListener('input',()=>{userSettings.screenContrast=(parseInt(document.getElementById('ScreenContrastSlider').value)/1000).toString(); Theme(true)})
document.getElementById('ScreenContrastSlider').addEventListener('change',()=>{userSettings.screenContrast=(parseInt(document.getElementById('ScreenContrastSlider').value)/1000).toString(); Theme()})
function registerSW() { if ('serviceWorker' in navigator) { navigator.serviceWorker.register('sw.js'); } }

function Resized() {
    ResizeNote(); setTimeout(function() { ResizeNote(); }, 300);
    if (document.getElementById("AddNoteButton")){
        document.getElementById("AddNoteTitle").style.width = (document.body.offsetWidth - 82) + "px";
        document.getElementById("AddNoteDescription").style.width = (document.body.offsetWidth - 62 - 20) + "px";
    }
}

function SearchChange(e){
    var SearchKey = document.getElementById('SearchBar').value;
    if (SearchKey!=''){
        data.forEach(n=>{
            if (n.title.includes(SearchKey) || n.description.includes(SearchKey) || n.date.includes(SearchKey)) {
                document.getElementById(n.id+'-NoteCard').style.display = 'block';
            } else {document.getElementById(n.id+'-NoteCard').style.display = 'none';}
        })    
    } else {
        data.forEach(n=>{document.getElementById(n.id+'-NoteCard').style.display = 'block'});
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
    FA2Animation('+','OpenNoteWindow');
}

var quickSettingsOpened = false;
function AppMenuButtonClick(refresh) {
    navigator.vibrate(25);
    if ((!quickSettingsOpened && !refresh) || (quickSettingsOpened && refresh)) {
        quickSettingsOpened = true;
        document.getElementById('AppQuickSettings').style.visibility = 'visible';
        document.getElementById('AppQuickSettings').animate([{opacity: 0},{opacity: 1}],{ easing:'cubic-bezier(1, 0, 0, 0.25)', duration: 300 });
        document.getElementById('AppQuickSettings').style.height = userSettings.labels.length==0 ? '96px' : (162+userSettings.labels.length*66)+'px';
        document.getElementById('AppQuickSettings').style.opacity = '1';
        document.getElementById('AppQuickSettings').style.marginTop = '20px';

        var AQSLabels = userSettings.labels.length==0 ? '' : `
        <div id="AQSLabel_All_Notes" class="AQSLabel`+(NotesLabelOpened==''?' Active':'')+`">
            <p id="AQSLabelName_All Notes" data-str="all-notes" class="AQSLabelName">All Notes</p>
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
            <div id="AQSAddLabel" class="FA2InnerButton ripple" onclick="AQSAddLabel()">
                <p data-str="add-label">Add Label</p>
            </div>
            <div id="AQSSettings" class='FA2InnerButton ripple' onclick="FA2Animation('+','SettingsWindow')">
                <svg id="AQSSIcon" width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21.0493 14.0562C21.0926 13.7096 21.1251 13.3575 21.1251 13C21.1251 12.6425 21.0926 12.2904 21.0493 11.9437L23.3405 10.1508C23.5464 9.98833 23.606 9.69583 23.4705 9.4575L21.3039 5.70375C21.1685 5.47083 20.8868 5.37333 20.643 5.47083L17.9455 6.55958C17.3876 6.13166 16.7755 5.76875 16.1147 5.4925L15.7085 2.62166C15.6597 2.36708 15.4376 2.16666 15.1668 2.16666H10.8335C10.5626 2.16666 10.3405 2.36708 10.2972 2.62166L9.89095 5.4925C9.23012 5.76875 8.61803 6.12625 8.06012 6.55958L5.36262 5.47083C5.11887 5.37875 4.8372 5.47083 4.70179 5.70375L2.53512 9.4575C2.3997 9.69041 2.45929 9.98291 2.66512 10.1508L4.95095 11.9437C4.90762 12.2904 4.87512 12.6425 4.87512 13C4.87512 13.3575 4.90762 13.7096 4.95095 14.0562L2.66512 15.8492C2.45929 16.0117 2.3997 16.3042 2.53512 16.5425L4.70179 20.2962C4.8372 20.5292 5.11887 20.6267 5.36262 20.5292L8.06012 19.4404C8.61803 19.8683 9.23012 20.2312 9.89095 20.5075L10.2972 23.3783C10.3405 23.6329 10.5626 23.8333 10.8335 23.8333H15.1668C15.4376 23.8333 15.6597 23.6329 15.703 23.3783L16.1093 20.5075C16.7701 20.2312 17.3822 19.8737 17.9401 19.4404L20.6376 20.5292C20.8814 20.6212 21.163 20.5292 21.2985 20.2962L23.4651 16.5425C23.6005 16.3096 23.541 16.0171 23.3351 15.8492L21.0493 14.0562ZM13.0001 16.7917C10.9039 16.7917 9.20845 15.0962 9.20845 13C9.20845 10.9037 10.9039 9.20833 13.0001 9.20833C15.0964 9.20833 16.7918 10.9037 16.7918 13C16.7918 15.0962 15.0964 16.7917 13.0001 16.7917Z" stroke="var(--ContentColor)" stroke-width="2.5"/>
                </svg>
            </div>
        </div>`      
        document.getElementById('AppQuickSettings').innerHTML = AQSLabels;
        Translate();
    } else {
        quickSettingsOpened = false;
        var t = document.getElementById('AppQuickSettings').offsetHeight;
        document.getElementById('AppQuickSettings').style.height = t/2+'px';
        document.getElementById('AppQuickSettings').style.marginTop = '-'+t/2-0+'px';
        document.getElementById('AppQuickSettings').animate([{opacity: 1},{opacity: 0}],{easing:'cubic-bezier(0, 0, 0, 1)',duration:200});
        document.getElementById('AppQuickSettings').style.opacity = '0';
        setTimeout(()=>{document.getElementById('AppQuickSettings').innerHTML = ''; document.getElementById('AppQuickSettings').style.visibility = 'hidden'; },200)
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
        Function(UpdateSettings,[],'SettingsDBR');
        CancelNewLabel();
        AppMenuButtonClick(true);
    }
}

var PageScaleNumber1=['1','0.9','0.81']
var PageScaleNumber2=['1.111','1.233','1.233']
function FA2Animation(s,id){
    window.navigator.vibrate(25);
    document.getElementById(id).style.transition = 'transform 0s';
    document.getElementById(id).parentNode.style.transition = 'transform 0s';
    var prntcls = document.getElementById(id).parentNode.classList;
    if (s=='-'){
        document.getElementById(id).style.transform = 'scale(0.9)';
        document.getElementById(id).parentNode.style.transform = 'scale(1.111)';

        document.getElementById(id).animate([{opacity: 1},{opacity: 0}],{easing:'cubic-bezier(0.9, 0, 0, 1)',duration:300});
        document.getElementById(id).parentNode.firstElementChild.animate([{opacity: 0},{opacity: 1}],{easing:'cubic-bezier(0.9, 0, 0, 1)',duration:300});
        document.getElementById(id).parentNode.animate([{transform: 'scale(1.111)'},{transform: 'scale(1)'}],{easing:'cubic-bezier(0.9, 0, 0, 1)',duration:300});

        document.getElementById(id).parentNode.style.transform = 'scale(1)';
        document.getElementById(id).parentNode.firstElementChild.style.opacity = 1;
        document.getElementById(id).style.opacity = 0;
        setTimeout(()=>{document.getElementById(id).style.display = 'none';},300)
    } else {
        document.getElementById(id).style.display = 'block';
        document.getElementById(id).style.transform = 'scale(0.9)';

        document.getElementById(id).animate([{opacity: 0},{opacity: 1}],{easing:'cubic-bezier(0.9, 0, 0, 1)',duration:300});
        document.getElementById(id).parentNode.firstElementChild.animate([{opacity: 1},{opacity: 0}],{easing:'cubic-bezier(0.9, 0, 0, 1)',duration:300});
        document.getElementById(id).parentNode.animate([{transform: 'scale(1)'},{transform: 'scale(1.111)'}],{easing:'cubic-bezier(0.9, 0, 0, 1)',duration:300});

        document.getElementById(id).parentNode.style.transform = 'scale(1.111)';
        document.getElementById(id).parentNode.firstElementChild.style.opacity = 0;
        document.getElementById(id).style.opacity = 1;
        setTimeout(()=>{
            document.getElementById(id).style.transform = 'scale(1)';
            document.getElementById(id).parentNode.style.transform = 'scale(1)';
        },350)
    }
}
function OpenThemeSettings(){document.getElementById("ThemeSettings").style.display = 'block';}

function ThemeSettingsTheme(theme){
    userSettings.theme=theme; Theme();
    document.getElementById('STSTchooser').childNodes.forEach(n => { if(n.nodeName == 'DIV') n.setAttribute('class','FA2OptionChooser'+(('STST'+userSettings.theme)==n.getAttribute('id') ? ' Active' : '')); })
}

function OpenSettings(Page){
    if (Page=='ThemeSettings'){
        document.getElementById('STSTchooser').childNodes.forEach(n => {
            if(n.nodeName == 'DIV') n.setAttribute('class','FA2OptionChooser'+(('STST'+userSettings.theme)==n.getAttribute('id') ? ' Active' : ''));
        })
    }
    FA2Animation('+',Page); 
}

// INSTALL

window.addEventListener('appinstalled', () => { console.log('[i] Yay:', 'App was intalled by user!'); });

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
        if (newUpdateVersion>AppPublicVersion) {console.log('[i] New version avaiable:',newUpdateVersion)}
    } else console.log('[i] Updater Error:', 'You are offline');
}