var fs = require('fs'),oldFilename,newFilename,isSymLink;

oldFilename = "c:/temp/processId.txt";
newFilename ="c:/temp/processIdOld.txt";

fs.chmodSync(oldFilename,777);
fs.renameSync(oldFilename,newFilename);

isSymLink = fs.lstatSync(newFilename).isSymbolicLink();
