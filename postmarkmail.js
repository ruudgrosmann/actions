const http = require('node:https');

const postData = JSON.stringify({
	'TextBody': 'Hallo Wereld!',
	'HtmlBody': '<p><b>Hello</b> World!</p>',
	'From': "info@sdu.nl",
	'To': "r.grosmann@sdu.nl",
	'Subject': "Postmark test",
	'MessageStream': "outbound",
});
const options = {
  hostname: 'api.postmarkapp.com',
  port: 443,
  path: '/email',
  method: 'POST',
  headers: {
	'X-Postmark-Server-Token': 'geheim-0cf9-4e1c-96fd-fda37919e0f5',
	'Accept': 'application/json',
	'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData),
  },
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    //console.log(`BODY: ${chunk}`);
    console.log(`resultaat: ${JSON.parse(chunk).Message}`);
  });
  res.on('end', () => {
    console.log('No more data in response.');
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

// Write data to request body
req.write(postData);
req.end();
