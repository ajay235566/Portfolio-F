const https = require('https');
const fs = require('fs');

https.get('https://framerusercontent.com/modules/rQoMQRXAFBKwYlEaTMkj/NY6J1jNOSXn9pueaMBOe/q9WzHyj8P.js', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    fs.writeFileSync('d:\\portfolio\\Portfolio\\scripts\\temp_framer_payload.js', data);
    console.log('Saved payload');
  });
}).on('error', (err) => {
  console.log('Error: ' + err.message);
});
