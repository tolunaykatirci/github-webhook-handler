const fs = require('fs');
const express = require('express')
const crypto = require('crypto')
const sudo = require('sudo-js')

const mySecretRaw = fs.readFileSync('mysecret.json');
const mySecret = JSON.parse(mySecretRaw);

sudo.setPassword(mySecret.password)

const sigHeaderName = 'X-Hub-Signature-256'
const sigHashAlg = 'sha256'

function verifyPostData(req, res, next) {
    if (!req.rawBody) {
        return next('Request body empty')
      }
    
      const sig = Buffer.from(req.get(sigHeaderName) || '', 'utf8')
      const hmac = crypto.createHmac(sigHashAlg, mySecret.key)
      const digest = Buffer.from(sigHashAlg + '=' + hmac.update(req.rawBody).digest('hex'), 'utf8')
      if (sig.length !== digest.length || !crypto.timingSafeEqual(digest, sig)) {
        return next(`Request body digest (${digest}) did not match ${sigHeaderName} (${sig})`)
      }
    
      return next()
}

var app = express()
app.use(express.json({
    verify: (req, res, buf, encoding) => {
        if (buf && buf.length) {
          req.rawBody = buf.toString(encoding || 'utf8');
        }
      }
}))

app.get('/', function (req, res) {
   res.send('Hello, stranger!')
})

app.post('/', verifyPostData, function (req, res) {
    // console.log(JSON.stringify(req.body))
    var command = ['sh', './deploy.sh']
    sudo.exec(command, function(err, pid, result) {
        console.log(result)
    })

    res.status(200).send('Request body was signed')
})

app.listen(8080)
