var fs =require('fs');

process.argv.forEach(function (item,index){
	console.log(index + ' : ' + item);

	if(index == 2){
		fs.readFile(item,'utf8',function(err,data){
			console.log(data);
		});
	}// if
});