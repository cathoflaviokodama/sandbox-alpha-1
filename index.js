const vm = require('vm');
const readline = require('readline');
const express = require('express');
const request = require('request');
var server = express();
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
var app = {
    shell : true
};
var sandbox = {
    console : {
        log : function() {
            var args = [];
            for(var x = 0; x < arguments.length;x++) args.push(arguments[x]);
            console.log("-------------------------------------------------------------------------------");
            return console.log.apply(console,args);
        }
    },
    request : request,
    quit : () => {
        
        app.shell = false;
    },
    routes : {
    }
};
server.get("/*",(req,res) => {
    var parts = req.url.split('?');
    
    res.end(req.url);
});
app.server = server.listen(9090);
process.on('SIGTERM', () => {
    rl.close();
    app.server.close();
});
process.on('SIGINT', () => {
    rl.close();
    app.server.close();
});
function shell() {
    rl.question('>', (answer) => {
        try {
            const script = new vm.Script(answer);
            const context = vm.createContext(sandbox);
            script.runInContext(context);
        } catch(e) {
            console.log(e);
        }
        if(app.shell) setTimeout(()=> { shell(); },0);
        else {
            app.server.close();
            rl.close();
        }
    });
}
shell();