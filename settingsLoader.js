var SettingsDB; var AppLoaded=false; var FirebaseLoaded=false; var SettingsDBR = false; var SettingsStore; var AppOnline = true; var AppOnlineF; var NotesList = []; var g_r_height = 96; var viewDBNotes = true; var NotesLabelOpened = ''; var notes = new Array(); var data = new Array();     NoteList = document.createElement("div"); NoteList.setAttribute("id","NoteList");
userSettings = {
    email: undefined,
    version: AppPublicVersion,
    labels: [],
    theme: 'System',
    language: 'En',
    screenContrast: '0',
}

if (typeof(window) == 'object') {
    var DBrequest = indexedDB.open("NotesDB",parseInt(AppDevVersion))
    DBrequest.onsuccess = function(event) {
        SettingsDB = event.target.result;
        LoadDBSettings();
    };
    DBrequest.onupgradeneeded = function(event) { CreateDB(event) }
}

function LoadDBSettings(){
    if (SettingsDB.objectStoreNames.length != 0) {
        SettingsDBR = true;
        SettingsStore = SettingsDB.transaction(["Settings"], 'readwrite').objectStore("Settings");
        SettingsStore.getAll().onsuccess = (r) => {
            if (r.target.result.length != 0) {
                userSettings = r.target.result[0].value;
                if (typeof(window) == 'object') { Theme(userSettings.theme,'Code'); }
                console.log('[i] User:',userSettings.email);
                if(userSettings.version!=AppPublicVersion){
                    document.getElementById('AppUpdate').style.visibility = 'hidden';
                    document.getElementById('AppUpdate').style.opacity = '0';
                    document.getElementById('AppView').style.zIndex = '0';    
                    document.getElementById('AppUpdate').style.transition = '0s';    
                }
            }
        }
    } else {
        userSettings = {
            email: undefined || userSettings.email,
            version: AppPublicVersion,
            labels: [],
            theme: 'System',
            language: 'En',
            screenContrast: '0',
        }
        Theme(userSettings.theme,'Code');
    }
    setTimeout(()=>document.getElementById('body').style.transition='0.3s',300)
}

function CreateDB(event) {
    SettingsDBV = event.target.result; 
    if (!SettingsDBV.objectStoreNames.contains('Settings')) {
        var objectStore = SettingsDBV.createObjectStore('Settings', { keyPath: "name" });
        objectStore.onerror = (e) => console.log(e);
        objectStore.transaction.oncomplete = () => {
            indexedDB.open("NotesDB",AppDevVersion).onsuccess = function(event) {
                userSettings = {
                    email: undefined || userSettings.email,
                    version: AppPublicVersion,
                    labels: [],
                    theme: 'System',
                    language: 'En',
                    screenContrast: '0',
                }  
                event.target.result.transaction("Settings", "readwrite").objectStore("Settings").add({name:'userSettings',value:userSettings});    
            }          
        }    
    }
    if (!SettingsDBV.objectStoreNames.contains('Notes')) SettingsDBV.createObjectStore('Notes', { keyPath: "id" });
    console.log('[i] Updated Database');
    AppUpdate();
    SettingsDBR = true;
}

function UpdateSettings(){
    if (SettingsDBR) {
        indexedDB.open("NotesDB",AppDevVersion).onsuccess = function(event) {
            SettingsDBlocal = event.target.result;
            var request = SettingsDBlocal.transaction(["Settings"], "readwrite").objectStore("Settings").get('userSettings');
            request.onerror = function(event) { console.error('[!] Notes Database Error:', event.target.errorCode) };
            request.onsuccess = function(event) {
                var data = event.target.result;
                data.value = userSettings;
                var requestUpdate = SettingsDBlocal.transaction(["Settings"], "readwrite").objectStore("Settings").put(data);
                requestUpdate.onerror = function(event) { console.error('[!] Notes Database Error', event.target.errorCode) };
            };
        }
    } else {
        setTimeout(UpdateSettings, 50);
    }
}

if (typeof(window) != 'undefined') { navigator.serviceWorker.addEventListener('message', event => { if (event.data.type == 'AppOnline') { AppOnline = event.data.value; try {UpdateConnection(AppOnline);}catch{}}}); }

function Theme(UpdateTo,By) {
    if (UpdateTo != undefined) userSettings.theme = UpdateTo;
    if ((userSettings.theme=='System' || userSettings.theme==undefined) && window.matchMedia('(prefers-color-scheme)').media !== 'not all'){
        var cfTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'Dark' : 'Light';
    } else { if (userSettings.theme=='Dark' || userSettings.theme=='Light') var cfTheme = userSettings.theme; else var cfTheme='Light'; }

    if (cfTheme == 'Dark') {
        document.documentElement.style.setProperty('--main-color', '#FFFFFF');
        document.documentElement.style.setProperty('--main-color-light', '#0A0A0A');
        document.documentElement.style.setProperty('--main-shadow-color', '#000000');
        document.documentElement.style.setProperty('--active-shadow-color', '#000000');
        document.documentElement.style.setProperty('--main-contrast-color', '#FFFFFF');
        document.documentElement.style.setProperty('--secondary-color', '#FFFFFF80');
        document.documentElement.style.setProperty('--background-color', '#050505');
        document.documentElement.style.setProperty('--hover-color', '#101010');
        document.documentElement.style.setProperty('--hover-c-color', '#FFFFFF');
        document.documentElement.style.setProperty('--secondary-contrast-color', '#FFFFFF80');
        document.documentElement.style.setProperty('--aqs-background', '#080808');
        document.documentElement.style.setProperty('--aqs-item', '#040404');
        document.documentElement.style.setProperty('--aqs-shadow-color', '#00000040');
    } else {
        var ContrastF = parseInt(247-(247/10*parseFloat(userSettings.screenContrast)));
        document.documentElement.style.setProperty('--main-color', '#0A0F23');
        document.documentElement.style.setProperty('--main-color-light', '#'+ContrastF.toString(16)+(ContrastF+2).toString(16)+(ContrastF+4).toString(16));
        document.documentElement.style.setProperty('--main-shadow-color', '#0A0F2320');
        document.documentElement.style.setProperty('--active-shadow-color', '#0A0F2330');
        document.documentElement.style.setProperty('--main-contrast-color', '#0A0F23');
        document.documentElement.style.setProperty('--secondary-color', '#0A0F2380');
        document.documentElement.style.setProperty('--background-color', '#FFFFFF');
        document.documentElement.style.setProperty('--hover-color', '#FFFFFF');
        document.documentElement.style.setProperty('--hover-c-color', '#0A0F23');
        document.documentElement.style.setProperty('--secondary-contrast-color', '#0A0F2380');
        document.documentElement.style.setProperty('--aqs-background', '#FFFFFF');
        document.documentElement.style.setProperty('--aqs-item', '#'+ContrastF.toString(16)+(ContrastF+2).toString(16)+(ContrastF+4).toString(16));
        document.documentElement.style.setProperty('--aqs-shadow-color', '#0A0F2320');
    }
    document.querySelector("meta[name=theme-color]").setAttribute('content', cfTheme=='Dark'?'#050505':'#FFFFFF');

    UpdateSettings();

    if(By!='Code' && FirebaseLoaded){ SyncUserSettings(); }
}

// ----- notesLoader.js -----

DBNotesCore();
function DBNotesCore(){
    if (SettingsDBR) {
        indexedDB.open("NotesDB",parseInt(AppDevVersion)).onsuccess = (e) => {
            var SettingsDB = e.target.result;
            SettingsDB.transaction(['Notes'], 'readwrite').objectStore('Notes').getAll().onsuccess = r => {
                if (r.target.result!=undefined){
                    window.dbnotes = r.target.result;
                    LoadDBNotes(r.target.result,'');
                    ResizeNote(true); setTimeout(function() { ResizeNote(true); }, 300);  
                    console.log('[i] Database notes are loaded');
                }
            }
        }
    } else {
        setTimeout(()=>{DBNotesCore()}, 100);
    }    
}

function SyncDBNotes(type,data){
    if (SettingsDBR) {
        if (type=='clear') { SettingsDB.transaction(['Notes'], "readwrite").objectStore("Notes").clear(); notes=[] }
        else if (type == 'add') { SettingsDB.transaction("Notes", "readwrite").objectStore("Notes").add(data); }
        else if (type == 'remove') { SettingsDB.transaction("Notes", "readwrite").objectStore("Notes").delete(data); }        
    } else {
        setTimeout(SyncDBNotes(), 200);
    }
}

function ResizeNote(db) {
    if (AppLoaded){
        var g_height = 76;
        if (db){
            dbnotes.forEach(i=>{
                document.getElementById(i.id + "-NoteCard").style.height = (38 + document.getElementById(i.id + "-NoteDescription").offsetHeight) + "px";
                g_height = g_height + 20 + document.getElementById(i.id + "-NoteCard").offsetHeight;
            })    
        } else {
            if (notes){
                notes.forEach(i=>{
                    if(document.getElementById(i + "-NoteCard")){
                        document.getElementById(i + "-NoteCard").style.height = (38 + document.getElementById(i + "-NoteDescription").offsetHeight) + "px";
                        g_height = g_height + 20 + document.getElementById(i + "-NoteCard").offsetHeight;    
                    }
                })       
            }
        }
        if (document.body.offsetWidth < 657) { /* MOBILE */
            NoteList.style.height = (g_height)+'px';
        } else {
            NoteList.style.height = (g_height-76)+'px';
        }    
    }
}

function LoadDBNotes(list,label){
    list.forEach(n => {
        if (NotesLabelOpened == label){
            var NoteCard = document.createElement("div");
            NoteCard.setAttribute('class', 'NoteCard ripple');
            NoteCard.setAttribute('id', n.id + "-NoteCard");
            NoteCard.setAttribute('onclick', "OpenNote('" + n.id + "')");
            NoteList.appendChild(NoteCard);
        
            var NoteTitle = document.createElement("p");
            NoteTitle.innerHTML = n.data.title;
            NoteTitle.setAttribute('class', 'NoteTitle');
            NoteTitle.setAttribute('id', n.id + "-NoteTitle");
            NoteCard.appendChild(NoteTitle);
        
            var NoteDescription = document.createElement("p");
            NoteDescription.innerHTML = n.data.description;
            NoteDescription.setAttribute('class', 'NoteDescription');
            NoteDescription.setAttribute('id', n.id + "-NoteDescription");
            NoteCard.appendChild(NoteDescription);
        
            var NoteDate = document.createElement("p");
            NoteDate.innerHTML = n.data.date;
            NoteDate.setAttribute('class', 'NoteDate');
            NoteDate.setAttribute('id', n.id + "-NoteDate");
            NoteCard.appendChild(NoteDate);
        
            NoteCard.style.height = (38 + NoteDescription.offsetHeight) + "px";
            g_r_height = g_r_height + 20 + NoteCard.offsetHeight;
        }
    })
}

window.matchMedia('(prefers-color-scheme: dark)').addListener(() => {Theme()});

// appUpdate.js

function AppUpdate(){
    document.getElementById('AppUpdate').innerHTML=`
    <div id="AppUpdateTextDiv">
        <svg id="AppUpdateText" width="247" height="125" viewBox="0 0 247 125" fill="none" xmlns="http://www.w3.org/2000/svg">
            <text fill="#05050A" xml:space="preserve" style="white-space: pre" font-family="Roboto" font-size="24" font-weight="500" letter-spacing="0em"><tspan x="0.113281" y="88.2031">We are upgrading your &#10;</tspan><tspan x="57.9688" y="118.203">experience..</tspan></text>
            <g opacity="0.1">
                <path d="M138.909 12.4675C139.261 12.1151 139.83 12.1151 140.182 12.4675L141.136 13.4248C142.014 14.306 142.014 15.7347 141.136 16.6158L132.866 24.9124C131.987 25.7936 130.563 25.7936 129.685 24.9124C128.806 24.0313 128.806 22.6026 129.685 21.7214L138.909 12.4675Z" fill="#05050A"/>
                <path d="M134.774 0.660877C133.896 -0.220292 132.472 -0.220292 131.593 0.660876L126.822 5.44737C125.943 6.32854 125.943 7.75719 126.822 8.63836L131.275 13.1058C132.154 13.9869 133.578 13.9869 134.456 13.1058L139.228 8.31926C140.106 7.43809 140.106 6.00944 139.228 5.12827L134.774 0.660877Z" fill="#05050A"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M121.732 10.553C122.611 9.67179 124.035 9.67179 124.913 10.553L129.367 15.0203C130.245 15.9015 130.245 17.3302 129.367 18.2113L113.293 34.3391C112.871 34.7623 112.299 35 111.703 35H107.249C106.007 35 105 33.9898 105 32.7436L105 28.2762C105 27.6778 105.237 27.1039 105.659 26.6807L121.732 10.553Z" fill="#05050A"/>
            </g>
            <path d="M138.909 12.4675C139.261 12.1151 139.83 12.1151 140.182 12.4675L141.136 13.4248C142.014 14.306 142.014 15.7347 141.136 16.6158L132.866 24.9124C131.987 25.7936 130.563 25.7936 129.685 24.9124C128.806 24.0313 128.806 22.6026 129.685 21.7214L138.909 12.4675Z" fill="#05050A"/>
            <path d="M134.774 0.660877C133.896 -0.220292 132.472 -0.220292 131.593 0.660876L126.822 5.44737C125.943 6.32854 125.943 7.75719 126.822 8.63836L131.275 13.1058C132.154 13.9869 133.578 13.9869 134.456 13.1058L139.228 8.31926C140.106 7.43809 140.106 6.00944 139.228 5.12827L134.774 0.660877Z" fill="#05050A"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M121.732 10.553C122.611 9.67179 124.035 9.67179 124.913 10.553L129.367 15.0203C130.245 15.9015 130.245 17.3302 129.367 18.2113L113.293 34.3391C112.871 34.7623 112.299 35 111.703 35H107.249C106.007 35 105 33.9898 105 32.7436L105 28.2762C105 27.6778 105.237 27.1039 105.659 26.6807L121.732 10.553ZM122.687 14.7012C123.038 14.3488 123.608 14.3488 123.959 14.7012L125.231 15.9776C125.583 16.3301 125.583 16.9016 125.231 17.254L111.625 30.9065C111.457 31.0757 111.228 31.1708 110.989 31.1708L109.717 31.1708C109.22 31.1708 108.817 30.7667 108.817 30.2683V28.9919C108.817 28.7525 108.912 28.5229 109.081 28.3537L122.687 14.7012Z" fill="#05050A"/>
        </svg>
    </div>
    <div id="AppUpdateLogoDiv">
        <svg id="AppUpdateLogo" width="192" height="27" viewBox="0 0 192 27" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M71.6699 26.9768L68.1519 21.0927H67.9359L64.4897 26.9768H58.9256L65.2794 17.1428L58.9635 7.59589H64.5274L68.0093 13.3721H68.2253L71.4918 7.59589H77.2356L70.8116 17.1428L77.2356 26.9768H71.6699ZM43.7792 25.7207C42.3394 24.9034 41.153 23.7047 40.3507 22.2566C39.5126 20.7352 39.0857 19.0215 39.1123 17.2847C39.1002 15.5862 39.5202 13.9124 40.3329 12.4209C41.1211 10.952 42.2857 9.71923 43.7074 8.84883C45.153 7.9607 46.8206 7.50026 48.5172 7.52085C50.2255 7.47424 51.914 7.89636 53.3994 8.7414C54.7378 9.52753 55.8173 10.6879 56.5046 12.0797C57.2223 13.5422 57.5851 15.1532 57.5637 16.7822C57.5651 17.3106 57.529 17.8384 57.4557 18.3617H43.7068C43.8524 19.647 44.4733 20.8314 45.4477 21.6822C46.3849 22.4419 47.5622 22.8429 48.7683 22.8131C49.7425 22.8391 50.7052 22.5963 51.5506 22.1114C52.3196 21.6538 52.9565 21.0044 53.3994 20.2268L57.2047 22.0935C55.3379 25.348 52.502 26.9754 48.697 26.9758C46.9755 27.0009 45.2784 26.5675 43.7797 25.7201L43.7792 25.7207ZM45.6637 12.3491C44.8336 13.0504 44.2281 13.9805 43.9227 15.0234H53.0404C52.9787 14.4109 52.7626 13.8241 52.4121 13.3181C52.0175 12.7342 51.4878 12.254 50.8681 11.9183C50.158 11.5344 49.3598 11.3426 48.5528 11.3617C47.5029 11.3361 46.4785 11.686 45.6637 12.3485V12.3491ZM30.8907 26.9785V1.2761H35.5932V26.9785H30.8907ZM12.8312 26.9396C11.9755 26.9367 11.1222 26.8492 10.2838 26.6783C9.45504 26.5086 8.64513 26.2572 7.86588 25.928C7.10022 25.6034 6.36769 25.2057 5.67849 24.7403C4.99478 24.2779 4.35669 23.7513 3.77288 23.1678C3.18909 22.5839 2.66231 21.9456 2.19978 21.2617C1.7343 20.5723 1.3366 19.8396 1.01218 19.0737C0.683141 18.2945 0.432023 17.4846 0.262403 16.6558C0.087776 15.8017 -0.00016799 14.9321 2.51584e-07 14.0603C-0.000171673 13.1885 0.0877723 12.319 0.262403 11.4648C0.431996 10.6361 0.683115 9.82621 1.01218 9.04694C1.33656 8.28103 1.73426 7.54831 2.19978 6.85902C2.66215 6.17493 3.18894 5.53664 3.77288 4.95287C4.35664 4.36931 4.99474 3.84275 5.67849 3.38035C6.3677 2.915 7.10023 2.51728 7.86588 2.19273C8.64513 1.86349 9.45504 1.61215 10.2838 1.44237C11.138 1.26811 12.0074 1.18039 12.8792 1.18055C13.751 1.18037 14.6206 1.26809 15.4748 1.44237C16.3034 1.61202 17.1131 1.86337 17.8921 2.19273C18.6581 2.51703 19.3908 2.91476 20.0801 3.38035C20.764 3.84267 21.4023 4.36923 21.9862 4.95287C22.57 5.53676 23.0968 6.17504 23.5593 6.85902C24.025 7.54818 24.4227 8.28092 24.7469 9.04694C25.0762 9.82615 25.3275 10.6361 25.4972 11.4648C25.6684 12.3034 25.7561 13.1569 25.7591 14.0128V26.9396H12.8312ZM4.84766 14.0128C4.85491 16.137 5.69553 18.1734 7.18872 19.6842C8.68191 21.1949 10.7084 22.0593 12.8323 22.0914H21.0064V14.0123C21.0087 12.9511 20.8005 11.9001 20.3939 10.9199C19.9873 9.93976 19.3903 9.04995 18.6376 8.30198C17.8895 7.5492 16.9997 6.95224 16.0195 6.54564C15.0392 6.13904 13.988 5.93089 12.9268 5.93321C10.785 5.93549 8.73159 6.78718 7.21693 8.30144C5.70226 9.8157 4.84999 11.8689 4.84713 14.0107L4.84766 14.0128ZM12.8312 17.3393C12.3944 17.3393 11.9617 17.2532 11.5581 17.086C11.1545 16.9188 10.7877 16.6737 10.4788 16.3648C10.1699 16.0558 9.92493 15.6891 9.75779 15.2854C9.59065 14.8818 9.50467 14.4492 9.50474 14.0123C9.50474 13.1301 9.85527 12.284 10.4791 11.6602C11.1029 11.0363 11.949 10.6859 12.8312 10.6859C13.7135 10.6859 14.5596 11.0363 15.1835 11.6601C15.8074 12.2839 16.1581 13.13 16.1582 14.0123V17.3393H12.8312Z" fill="#EAEAEE"/>
            <path d="M176.821 25.2845C176.204 24.7186 175.717 24.0254 175.394 23.2528C175.072 22.4801 174.921 21.6465 174.952 20.8098C174.932 19.6568 175.272 18.5261 175.924 17.5752C176.593 16.6228 177.514 15.8759 178.584 15.4185C179.762 14.9043 181.036 14.6466 182.322 14.6628C183.977 14.6208 185.625 14.9015 187.174 15.4893V14.6984C187.187 14.2311 187.091 13.767 186.895 13.3429C186.698 12.9188 186.405 12.5462 186.04 12.2546C185.17 11.5941 184.094 11.263 183.003 11.3201C182.135 11.3215 181.28 11.5248 180.505 11.914C179.733 12.2843 179.052 12.8186 178.508 13.4795L175.488 11.1075C176.369 9.96179 177.517 9.04873 178.831 8.44771C180.206 7.81759 181.703 7.49853 183.215 7.51327C186.019 7.51327 188.151 8.16107 189.613 9.45666C191.075 10.7522 191.806 12.6451 191.805 15.1351V26.4203H187.169V24.5514H186.881C186.299 25.2954 185.555 25.8975 184.706 26.3123C183.739 26.7831 182.673 27.0172 181.598 26.9952C179.845 27.0611 178.134 26.4483 176.821 25.2845ZM179.661 20.8098C179.65 21.152 179.715 21.4923 179.852 21.8062C179.989 22.12 180.194 22.3996 180.452 22.6247C181.094 23.1305 181.9 23.3805 182.716 23.3265C183.32 23.3552 183.924 23.2529 184.485 23.0264C185.047 22.8 185.553 22.4549 185.968 22.0147C186.753 21.1855 187.185 20.0836 187.172 18.942C185.97 18.3711 184.656 18.076 183.326 18.0783C180.882 18.0783 179.661 18.9888 179.661 20.8098ZM156.856 25.752C155.494 24.9163 154.388 23.7227 153.658 22.3014C152.858 20.7401 152.457 19.0055 152.489 17.2518C152.461 15.5042 152.862 13.7763 153.658 12.22C154.384 10.7912 155.491 9.59093 156.856 8.75164C158.214 7.92327 159.777 7.49305 161.367 7.51003C162.521 7.48751 163.661 7.76663 164.673 8.31977C165.559 8.79258 166.313 9.47915 166.866 10.3171H167.153L166.866 7.7292V0.68496H171.538V26.4186H167.153V24.2264H166.865C166.331 25.0683 165.58 25.7511 164.691 26.2033C163.667 26.7434 162.523 27.0155 161.366 26.9941C159.776 27.0102 158.213 26.579 156.856 25.7498L156.856 25.752ZM159.713 12.5618C158.94 13.0111 158.305 13.6648 157.878 14.4512C157.412 15.3107 157.176 16.2767 157.195 17.2545C157.176 18.2323 157.412 19.1983 157.878 20.0578C158.308 20.8459 158.942 21.5039 159.713 21.9629C160.45 22.4098 161.296 22.646 162.157 22.6458C163.031 22.6493 163.889 22.4131 164.637 21.9629C165.409 21.5039 166.043 20.8459 166.473 20.0578C166.939 19.1982 167.174 18.2323 167.156 17.2545C167.174 16.2767 166.939 15.3108 166.473 14.4512C166.046 13.6648 165.411 13.0112 164.637 12.5618C163.885 12.1223 163.029 11.8926 162.157 11.8967C161.298 11.8955 160.454 12.125 159.713 12.5612L159.713 12.5618ZM127.348 25.6256C126.026 24.7826 125.011 23.5346 124.456 22.0676L128.661 20.2322C128.995 21.0357 129.565 21.7188 130.296 22.1907C131.036 22.6434 131.891 22.8742 132.758 22.8558C133.499 22.8802 134.236 22.7389 134.915 22.4423C135.18 22.3331 135.405 22.1451 135.559 21.9037C135.714 21.6622 135.79 21.3791 135.779 21.0927C135.789 20.8158 135.719 20.5418 135.579 20.3028C135.439 20.0638 135.234 19.8696 134.988 19.7431C134.238 19.3649 133.44 19.0924 132.616 18.9334L130.459 18.4659C129.071 18.1584 127.792 17.4815 126.757 16.5068C126.277 16.0529 125.898 15.5032 125.644 14.8933C125.39 14.2835 125.267 13.627 125.283 12.9666C125.274 11.9401 125.609 10.9402 126.236 10.1271C126.908 9.25882 127.802 8.58754 128.823 8.18374C129.97 7.71767 131.198 7.48549 132.435 7.50085C136.221 7.50085 138.749 8.83063 140.019 11.4902L135.993 13.2511C135.665 12.6302 135.166 12.1168 134.554 11.7722C133.942 11.4276 133.244 11.2664 132.543 11.3077C131.866 11.2734 131.193 11.429 130.6 11.7569C130.389 11.8638 130.211 12.0255 130.085 12.225C129.958 12.4245 129.888 12.6544 129.881 12.8905C129.881 13.7542 130.695 14.402 132.325 14.8339L135.02 15.4817C136.556 15.7884 137.979 16.5092 139.135 17.566C139.587 18.0175 139.943 18.5562 140.181 19.1493C140.419 19.7425 140.534 20.3777 140.519 21.0166C140.536 22.1386 140.174 23.2337 139.493 24.1254C138.761 25.0616 137.793 25.7871 136.69 26.2281C135.443 26.7435 134.104 27.0006 132.754 26.9838C130.528 26.9889 128.726 26.5361 127.348 25.6256ZM108.174 25.7336C106.733 24.9153 105.545 23.7151 104.742 22.2652C103.902 20.7422 103.474 19.0264 103.5 17.2874C103.488 15.5868 103.909 13.911 104.723 12.4176C105.512 10.9472 106.678 9.71313 108.101 8.84179C109.548 7.95236 111.218 7.49117 112.917 7.51164C114.627 7.46505 116.318 7.88773 117.805 8.73382C119.145 9.52105 120.226 10.6829 120.914 12.0764C121.632 13.5408 121.995 15.1539 121.974 16.7848C121.976 17.3138 121.939 17.8422 121.866 18.366H108.1C108.246 19.6527 108.868 20.8383 109.843 21.6903C110.782 22.4513 111.961 22.8532 113.168 22.8239C114.144 22.8502 115.107 22.6074 115.954 22.1221C116.724 21.6632 117.362 21.0122 117.805 20.2327L121.614 22.1016C119.746 25.3604 116.906 26.9898 113.096 26.9898C111.373 27.0149 109.675 26.5814 108.174 25.7336ZM110.064 12.3458C109.233 13.048 108.626 13.9791 108.321 15.0234H117.45C117.388 14.4103 117.172 13.823 116.821 13.3164C116.426 12.7311 115.896 12.2497 115.275 11.9129C114.564 11.5286 113.765 11.3365 112.957 11.3558C111.905 11.3298 110.877 11.681 110.061 12.3458H110.064ZM85.9096 21.7151H93.052C93.8053 21.7142 94.5274 21.4146 95.06 20.882C95.5927 20.3494 95.8924 19.6272 95.8932 18.874C95.8932 18.8583 95.8932 18.8427 95.8932 18.8265C95.8932 18.8103 95.8932 18.7952 95.8932 18.779C95.8924 18.0257 95.5927 17.3036 95.06 16.7709C94.5274 16.2383 93.8053 15.9387 93.052 15.9378H90.5337V11.2046H93.052C93.8053 11.2038 94.5274 10.9042 95.06 10.3715C95.5927 9.8389 95.8924 9.11675 95.8932 8.3635C95.8932 8.3473 95.8932 8.33219 95.8932 8.31599C95.8932 8.2998 95.8932 8.28468 95.8932 8.26849C95.8924 7.51524 95.5927 6.79308 95.06 6.26045C94.5274 5.72783 93.8053 5.42822 93.052 5.42737H93.0046L85.9214 5.44518V0.69468H93.0515C94.0643 0.692227 95.0672 0.894191 96.0001 1.28849C96.4507 1.47923 96.8816 1.71317 97.287 1.98703C97.6894 2.25894 98.0649 2.56878 98.4083 2.9123C98.7517 3.25572 99.0615 3.63116 99.3335 4.03352C99.6074 4.4389 99.8414 4.86991 100.032 5.32048C100.426 6.25358 100.628 7.25661 100.626 8.26957V8.3635C100.628 9.37646 100.426 10.3795 100.032 11.3126C99.8414 11.7631 99.6074 12.1941 99.3335 12.5995C99.1001 12.9441 98.8391 13.269 98.553 13.5712C98.8391 13.8734 99.1001 14.1984 99.3335 14.5429C99.6074 14.9483 99.8414 15.3793 100.032 15.8299C100.426 16.763 100.628 17.766 100.626 18.779V18.8729C100.628 19.8859 100.426 20.8889 100.032 21.822C99.8415 22.2726 99.6074 22.7036 99.3335 23.1089C99.0615 23.5113 98.7517 23.8868 98.4083 24.2302C98.0649 24.5737 97.6894 24.8835 97.287 25.1554C96.8816 25.4293 96.4507 25.6632 96.0001 25.854C95.0672 26.2483 94.0643 26.4502 93.0515 26.4478H85.9214L85.9096 21.7151ZM144.045 26.417V8.08656H148.754V26.4165L144.045 26.417ZM144.261 5.1758C143.972 4.89676 143.743 4.56144 143.589 4.19052C143.434 3.8196 143.358 3.42096 143.363 3.01919C143.357 2.61999 143.433 2.22379 143.588 1.85571C143.742 1.48762 143.972 1.15568 144.261 0.880922C144.543 0.596357 144.879 0.371667 145.25 0.22036C145.62 0.069053 146.018 -0.00574526 146.418 0.000461337C146.816 -0.00661828 147.211 0.0678506 147.578 0.219281C147.946 0.370712 148.279 0.59589 148.556 0.880922C148.841 1.15831 149.066 1.49115 149.218 1.8589C149.369 2.22666 149.444 2.62154 149.437 3.01919C149.443 3.41945 149.368 3.81683 149.217 4.18744C149.066 4.55806 148.841 4.89425 148.556 5.1758C148.282 5.46556 147.95 5.69508 147.582 5.84981C147.213 6.00453 146.817 6.08109 146.418 6.07462C146.016 6.08039 145.617 6.00355 145.245 5.84885C144.874 5.69416 144.538 5.46491 144.259 5.17527L144.261 5.1758Z" fill="#EAEAEE"/>
        </svg>
    </div>
    `
    document.getElementById('AppUpdate').style.visibility = 'visible';
    document.getElementById('AppUpdate').style.opacity = '1';
    document.getElementById('AppView').style.zIndex = '5';
}

// ---

function documentLoaded(){ loadBody(); Theme(userSettings.theme); console.log('[i] Document loaded'); 
document.getElementById('AppView').appendChild(NoteList); AppLoaded = true; }