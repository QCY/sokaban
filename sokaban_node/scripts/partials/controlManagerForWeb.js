var ControlManager = require('./controlManager.js');

var keydownControlerForWeb = function() {
    ControlManager.keydownControler.apply(this);
};

keydownControlerForWeb.prototype = new ControlManager.keydownControler();

keydownControlerForWeb.prototype.control = function() {
    document.onkeydown = function(e) {

        var keyCode = e.keyCode,
            state = this.keydownCommands[keyCode];

        if (state) {
            this.trigger('onMove', state);
        }

    }.bind(this);
};

module.exports = {
    keydownControler: keydownControlerForWeb
};
