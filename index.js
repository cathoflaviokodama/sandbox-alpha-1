const vm = require('vm');
const readline = require('readline');
const express = require('express');
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
            return console.log.apply(console,args);
        }
    },
    quit : () => {
        app.shell = false;
    },
    server : server
};
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
            rl.close();
        }
    });
}
shell();