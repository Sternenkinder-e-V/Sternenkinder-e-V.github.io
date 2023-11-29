// consolenManager.js

const consoleManager = {
    consoleSettings: {
        enableConsoleOutput: true
    },
    setConsoleOutput: function (value) {
        this.consoleSettings.enableConsoleOutput = value;
    },
    getConsoleOutput: function () {
        return this.consoleSettings.enableConsoleOutput;
    }
};
