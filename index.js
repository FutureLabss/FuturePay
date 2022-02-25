
var express = require('express');
const routes = require('./routes');
const cors = require('cors');
const morgan = require('morgan');
const { morganFormat, morganConfig } = require('./config/log');

var app = express()
require('./config/db');

process.on('unhandledRejection', function(reason, p){
  console.log("Possibly Unhandled Rejection at: Promise ", p, " reason: ", reason);
});

app.use(morgan(morganFormat,morganConfig))
app.use(express.static('storage'));
app.use(cors())


app.use('/', routes)



app.use((err, req, res, next) => {
  console.log(err.type, err.message);
  res.status(500).send('Server Error')
})


const port = process.env.PORT || 8000

var server = app.listen(
  port, function (err) {
    if (err) {
      console.log('error');
      return;
    }
    var host = server.address().address;
    var port = server.address().port;
    console.log('node payment listening at http://%s:%s', host, port);
  }
)


exports.app = app