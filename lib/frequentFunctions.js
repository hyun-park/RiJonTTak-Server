var strftime = require('strftime');


var frequentFunctions = {
    timestampToDate: function(timestamp) {
        return strftime('%F %T', new Date(timestamp));
    },
    getCurrentTimestamp: function () {
        return Math.floor(Date.now()/1000);
    },
    getCurrentDate: function() {
        return strftime('%F %T', new Date());
    },
    getRandomString: function(length) {
        return Math.random().toString(36).substr(2, length);
    }
}

var getFunctions = function() {
    return frequentFunctions;
}

module.exports = function() {
    return getFunctions();
}