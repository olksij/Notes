function pt(define, message) {
    var mOut = true; var color = '';
    var time = new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds() + '.' + new Date().getMilliseconds();
    var type = define[0];
    var about = define.slice(1);
    switch(type) {
        case 'i': color='#0000FF'; break;
        case '+': color='#008000'; break;
        case '-': color='#FF0000'; break;
        case '#': color='#FFAA00'; break;
        case '$': color = message=='Online' ? '#008000' : '#FF0000'; break;
        case '!': console.error('[!] ' + about + ':', message + ' @ ' + time); mOut=false; break;
        default: if ( message == undefined ) { message=type+about;type='~'; color='#202040'; } break;
    }

    if ( mOut == true ) {
        var f1='['+type+']';
        about=about+': ';
        color='color: '+color;
        var tcolor = color+
        console.log('%c' + f1 + ' ' + about + '%c' + message + '%c  @  ' + time, color,'color: #000',color+'60');
    }
}

