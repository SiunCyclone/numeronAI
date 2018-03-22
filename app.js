var express = require('express')
var app = express()

app.use(express.static('dist'));

app.get('/', (req, res) => {
  res.sendFile('dist/index.html', { root: __dirname })
})

app.listen(3000)

