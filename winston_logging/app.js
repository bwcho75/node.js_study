var Logger = require(__dirname+'/myLogger');

global.log = new Logger('./logfile.log');
log.info('hello');
