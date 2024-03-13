const stdio = require('stdio');
const http = require('node:https');
const fs = require('node:fs');

var ops = stdio.getopt({
    'datestamp': {key: 'd', description: 'voeg datum in'},
    _meta_: { minArgs: 0, maxArgs: 1 },
});

const system = require('system-commands');
const datestamp = true;
//const argumenten = process.argv.slice(2);
var res = __dirname + '/' + ((ops.args && ops.args[0]) || 'resultaat.zip');

function tweepos (i) { return ( (i < 10 ? '0' : '') + i) }
function getDateStamp() {
    const now = new Date();
    return (now.getFullYear() + '-' +
            tweepos (now.getMonth() + 1) + '-' +
             tweepos (now.getDate()));
}

system(`zip -r ${res} bin`).then(output => {
    console.log(output);
	console.log( `resultaat: ${res}`);
}).catch(error => {
    console.error(error);
})

function getdata (res) {
	return (fs.readFileSync(res));
}

const postData = JSON.stringify({
	'TextBody': 'Dit zijn de resultaten van de laatste testrun',
	'HtmlBody': '<p><i>Hello</i> world!</p>',
	'From': "informatie@sdu.nl",
	'To': "r.grosmann@sdu.nl",
	'Subject': "testresultaten",
	'MessageStream': "outbound",
	"Attachments": [
		{	"Name": 'resultaat_' + getDateStamp() + '.zip',
			"Content": Buffer.from(getdata(res)).toString('base64'),
			"ContentType": 'application/zip'
		}
	]
});

const options = {
  hostname: 'api.postmarkapp.com',
  port: 443,
  path: '/email',
  method: 'POST',
  headers: {
	'X-Postmark-Server-Token': process.env.POSTMARK_TOKEN,
	'Accept': 'application/json',
	'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData),
  },
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    console.log(`resultaat: ${JSON.parse(chunk).Message}`);
  });
  res.on('end', () => {
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

req.write(postData);
req.end();
