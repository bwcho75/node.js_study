// test global module 
console.time('measurement');

var result = '';
for(var i=1;i<=100;i++){
	result +=i+' ';
}

console.log('Result:',result);
console.timeEnd('measurement');