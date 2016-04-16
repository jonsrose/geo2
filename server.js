var webpack = require('webpack')
var webpackDevMiddleware = require('webpack-dev-middleware')
var webpackHotMiddleware = require('webpack-hot-middleware')
var config = require('./webpack.config')

var express    = require('express');
var app = express()
var port = 3000
var router = express.Router();
var querystring = require('querystring')

// require('es6-promise').polyfill();
// var fetch = require ('isomorphic-fetch')
// var fetch = require('node-fetch');

var request = require('request');

router.get('/wikipedia', function(req, res) {

  //res.json({ message: 'hooray! welcome to our api!' });
  //var country = 'Antarctica'
  var endpoint = 'https://en.wikipedia.org/w/api.php'
// ?action=parse&format=json&prop=text&page=Antarctica
  //// sole.log(endpoint)
  // var json = getRestApi(endpoint)
/*
  fetch(endpoint)
    .then(function(response) {
    var json = response.json()
    var text = json.parse.text
    // sole.log(text)
    res.send(response.json())
  })
*/

  // sole.log(req.query)

  var paramsQueryString = querystring.stringify(req.query)

  var url = endpoint + '?' + paramsQueryString

  // sole.log(url)

  request({url, json: true}, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      //// sole.log(body)
      res.json(body)
    }
  })

});

var compiler = webpack(config)
app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }))
app.use(webpackHotMiddleware(compiler))

app.use('/api', router);

app.get('*', function (request, response){
  response.sendFile(__dirname + '/index.html')
})

app.listen(port, function(error) {
  if (error) {
    console.error(error)
  } else {
    console.info("==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port)
  }
})
