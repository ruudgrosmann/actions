const system = require('system-commands')
//const dir = '/home/rdgon/project/github';
const res = __dirname + '/resultaat.zip';

//system(`cd ${dir};zip -r ${res} reports`).then(output => {
system(`zip -r ${res} bin`).then(output => {
    console.log(output)
	console.log( `resultaat: ${res}`);
}).catch(error => {
    console.error(error)
})
