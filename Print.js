var PrtCol = [ // Change / Add variables to add/change your colors and types
    'i', '#0000FF', // Info
    '+', '#008000', // Added content
    '-', '#FF0000', // Removed content
    '/', '#FFAA00', // Changed content    
    '$', 'S', // Changed content    
    '!', 'E', // Error   
    '#', 'W' // Warn  
]

print = function(define, message) {
    var time = new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds() + '.' + new Date().getMilliseconds();
    try { var type = define[0]; var about = define.slice(1); } catch {var type = '!'; var about = 'Print.js Error'; message = 'value is undefined'}
    if ( message == undefined && !PrtCol.includes(type) ) { console.log('%c[~] ' + type + about + '%c @ ' + time, 'color:#202040;', 'color:#20204060;') } // Normal debugger message
    else if (PrtCol[PrtCol.indexOf(type)] != undefined) {
        if (PrtCol[PrtCol.indexOf(type)+1][0] == '#') { // Colored output
            if (message != undefined) about += ': '; else message = '';
            console.log('%c[' + type + '] ' + about + '%c' + message + '%c  @  ' + time, 'color:'+PrtCol[PrtCol.indexOf(type)+1],'color: #000','color:'+PrtCol[PrtCol.indexOf(type)+1]+'60');
        } else  if (PrtCol[PrtCol.indexOf(type)+1][0] == 'E') { // Error output
            console.error('[' + type + '] ' + about + ': ' + message + '  @  ' + time);
        } else  if (PrtCol[PrtCol.indexOf(type)+1][0] == 'W') { // Warn output
            console.warn('[' + type + '] ' + about + ': ' + message + '  @  ' + time);
        } else  if (PrtCol[PrtCol.indexOf(type)+1][0] == 'S') { // Status output
            console.log('%c[$] Status: ' + '%c' + message + '%c  @  ' + time, 'color:' + (message == 'Online' ? '#008000' : '#FF0000'),'color: #000','color:'+(message == 'Online' ? '#00800060' : '#FF000060'));
        }
    }
}