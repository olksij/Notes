function Start(){ Resize() }

function Resize(){
    if (document.getElementById('body').offsetWidth > 650) {
        document.getElementById("BackgroundNoteLogo").style.left = (0 - document.getElementById('body').offsetWidth/4)+'px';
        document.getElementById("BackgroundNoteLogo").style.width = document.getElementById('body').offsetWidth+'px';
        document.getElementById("BackgroundNoteLogo").style.height = (document.getElementById('body').offsetWidth/100*95)+'px';
    } else {
        document.getElementById("BackgroundNoteLogo").style.width = ((document.getElementById('body').offsetHeight/95*100)*1.5)+'px';
        document.getElementById("BackgroundNoteLogo").style.height = (document.getElementById('body').offsetHeight*1.5)+'px';
        document.getElementById("BackgroundNoteLogo").style.left = ((document.getElementById('body').offsetWidth-document.getElementById("BackgroundNoteLogo").offsetWidth)/2)+'px';
    }
    document.getElementById("BackgroundNoteLogo").style.top = ((document.getElementById('body').offsetHeight-document.getElementById("BackgroundNoteLogo").offsetHeight)/2)+'px';
}