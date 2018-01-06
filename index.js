const httpSignature = require('http-signature');
const publicKey = fs.readFileSync('./config/smartthings_rsa.pub', 'utf8');

app.post('/smartthings', function (req, response) {
  // We don't yet have the public key during PING (when the app is created),
  // so no need to verify the signature. All other requests are verified.
  if (req.body && req.body.lifecycle === "PING" || signatureIsVerified(req)) {
    handleRequest(req, response);
  } else {
    response.status(401).send("Forbidden");
  }
});

function signatureIsVerified(req) {
  try {
    let parsed = httpSignature.parseRequest(req);
    if (!httpSignature.verifySignature(parsed, publicKey)) {
      console.log('forbidden - failed verifySignature');
      return false;
    }
  } catch (error) {
    console.error(error);
    return false;
  }
  return true;
}

function handleRequest(req, response) {
  // handle all lifecycles from SmartThings
}