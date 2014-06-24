var fs = require('fs');

var count = 0, totalBytes = 0;

function caculateByteSize(){
    fs.readdir("./",function(err,filenames){
        var i;
        count = filenames.length;
        for(i = 0;i<filenames.length;i++){
            console.log("filename:"+filenames[i]);
            fs.stat("./"+filenames[i],function(err,stats){
                totalBytes += stats.size;
                count--;
                if(count == 0){
                    console.log(totalBytes);
                }//if
            });//fs stat
        }// for
     });
}

caculateByteSize();

