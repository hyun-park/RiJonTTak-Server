var mcache = require('memory-cache');

var cache = function(duration) {
    return function(req, res, next) {
        var key = '__express__' + req.originalUrl || req.url;
        var cachedBody = mcache.get(key);
        if(cachedBody) {
            res.status(200).json(JSON.parse(cachedBody));
            return
        } else {
            res.sendResponse = res.send;
            res.send = function(body){
                mcache.put(key, body, duration * 1000);
                res.sendResponse(body);
            }
            next();
        }
    }
}

module.exports = function(duration){
    return cache(duration);
}