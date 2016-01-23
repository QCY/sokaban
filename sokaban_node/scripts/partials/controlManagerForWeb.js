var ControlManager = require('./controlManager.js');

var keydownControlerForWeb = function() {
    ControlManager.keydownControler.apply(this);
    this.configKey();
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

keydownControlerForWeb.prototype.configKey = function() {
    var btn = document.querySelector('[name="button"]');

    btn.onclick = function() {
        keydownCommands = {};
        var upValue = Counts.keyCode[document.querySelector(
                '[name="up"]').value.toUpperCase()],
            downValue = Counts.keyCode[document.querySelector(
                '[name="down"]').value.toUpperCase()],
            rightValue = Counts.keyCode[document.querySelector(
                '[name="right"]').value.toUpperCase()],
            leftValue = Counts.keyCode[document.querySelector(
                '[name="left"]').value.toUpperCase()];

        if (upValue && downValue && rightValue && leftValue) {
            keydownCommands[upValue] = 'moveUp';
            keydownCommands[rightValue] = 'moveRight';
            keydownCommands[downValue] = 'moveDown';
            keydownCommands[leftValue] = 'moveLeft';
        } else {
            alert('按键配置有误，请重新配置');
        }
    };
};

module.exports = {
    keydownControler: keydownControlerForWeb
};
