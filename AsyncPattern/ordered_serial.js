var fs = require('fs').oldFilename,newFilename;

oldFilename = "./processId.txt";
newFilename = "./processIdOld.txt";

fs.chmod(oldFilename,777,function(err){
    fs.rename(oldFilename,newFilename,function(err){
        fs.lstat(newFilename,function(err,stats){
            var isSymLink = stats.isSymbolicLink();
        });
    });
});

