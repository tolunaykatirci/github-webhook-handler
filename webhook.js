var express = require('express')

function checkAuth(req) {
    return true
}

var app = express()
 
app.get('/', function (req, res) {
   res.send('Hello, stranger!')
})

app.post('/', function (req, res) {
    console.log(JSON.stringify(req))
    res.send('OK!')
})


var server = app.listen(8080)