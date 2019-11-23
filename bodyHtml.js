var loadJSLinksFl = ['firebase.js','changelog.js','main.js','ripple.js']
function loadBody(){
    document.getElementById('AppNotifications').innerHTML =`
        <div id="ANS" class="ANCard">
            <svg class='ANIcon' id='ANSIcon' width="24" height="24" viewBox="0 0 24 24" style="fill:var(--ContentColor)" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.7592 7.73841C6.939 7.52882 7.25723 7.52998 7.45249 7.72525L8.55955 8.83231C8.87453 9.14729 9.4131 8.92421 9.41311 8.47875L9.41311 4.51475C9.41311 3.96246 8.96539 3.51475 8.41311 3.51475L4.4491 3.51475C4.00365 3.51475 3.78056 4.05332 4.09554 4.3683L5.20261 5.47536C5.39787 5.67062 5.39664 5.98632 5.21287 6.19244C3.79147 7.7867 3 9.85256 3 12C3 14.3146 3.91948 16.5345 5.55616 18.1711C6.41098 19.026 7.4003 19.6617 8.4536 20.0839C9.12478 20.3529 9.7988 19.814 9.7988 19.0909C9.7988 18.5911 9.46539 18.1599 9.01006 17.9537C8.31466 17.6388 7.66164 17.1911 7.09894 16.6284C5.87143 15.4009 5.18182 13.736 5.18182 12C5.18182 10.4313 5.74492 8.92073 6.7592 7.73841ZM15.0082 3.91913C14.3336 3.64802 13.6557 4.18992 13.6557 4.91703C13.6557 5.41364 13.983 5.84383 14.4353 6.04882C15.1341 6.36555 15.7904 6.8065 16.3556 7.37169C17.5831 8.5992 18.2727 10.2641 18.2727 12C18.2727 13.5687 17.7096 15.0793 16.6953 16.2616C16.5155 16.4712 16.1973 16.4701 16.0021 16.2748L14.895 15.1677C14.58 14.8528 14.0414 15.0758 14.0414 15.5213V19.4853C14.0414 20.0376 14.4892 20.4853 15.0414 20.4853L19.0054 20.4853C19.4509 20.4853 19.674 19.9467 19.359 19.6318L18.2519 18.5247C18.0567 18.3294 18.0579 18.0137 18.2417 17.8076C19.6631 16.2134 20.4545 14.1475 20.4545 12C20.4545 9.68541 19.5351 7.46559 17.8984 5.82891C17.0455 4.97607 16.0588 4.34127 15.0082 3.91913Z" style="fill:var(--ContentColor)"/>
            </svg>
            <p id='ANSTitle' class='ANTitle'>Syncing..</p>
            <div id='ANSBar'><div id='ANSBarActive'></div></div>
            <p id='ANSText'>0%</p>
        </div>
        <div id="ANO" class="ANCard">
            <svg class='ANIcon' id='ANOIcon' width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2.01999C6.49002 2.01999 2.02002 6.48999 2.02002 12C2.02002 17.51 6.49002 21.98 12 21.98C17.51 21.98 21.98 17.51 21.98 12C21.98 6.48999 17.51 2.01999 12 2.01999ZM12 19.98C7.60002 19.98 4.02002 16.4 4.02002 12C4.02002 7.59999 7.60002 4.01999 12 4.01999C16.4 4.01999 19.98 7.59999 19.98 12C19.98 16.4 16.4 19.98 12 19.98ZM12.75 4.99999L8.25002 13.5H11.39V19L15.75 10.5H12.75V4.99999Z" style="fill:var(--ContantColor)"/>
            </svg>
            <p id='ANOTitle' class='ANTitle'>You are offline</p>
        </div>
    `;

    document.getElementById('body').setAttribute('onscroll','Scrolled();')
    document.getElementById('body').setAttribute('onresize','Resized();')

    loadJSLinksFl.forEach( e => { 
        var temploader = document.createElement('script'); 
        temploader.setAttribute('src', e); 
        document.getElementsByTagName("head")[0].appendChild(temploader); 
    });
    var temploader = document.createElement('script'); 
    document.getElementsByTagName("head")[0].appendChild(temploader); 
}