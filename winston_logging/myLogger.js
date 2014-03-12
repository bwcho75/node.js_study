var winston = require('winston');
module.exports = function(logfilename){
    var logger = new winston.Logger({
        transports: [
            new (winston.transports.Console)(),
            new (winston.transports.File)({
                filename:logfilename
            })]
    });
    return logger;
};
