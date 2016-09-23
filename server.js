var webpack = require('webpack')
var webpackDevMiddleware = require('webpack-dev-middleware')
var webpackHotMiddleware = require('webpack-hot-middleware')
var config = require('./webpack.config')

var express = require('express');
var app = express()
var port = 3000
var router = express.Router();
var querystring = require('querystring')

var request = require('request');
var rp = require('request-promise');
var Promise = require('bluebird');

var compiler = webpack(config)
app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }))
app.use(webpackHotMiddleware(compiler))

app.use('/static', express.static('static'));

function getRandomInRange(from, to, fixed) {
  return (Math.random() * (to - from) + from).toFixed(fixed) * 1
}

function random() {
  let numFailures = 0;
  const maxFailures = 3;

  // http://stackoverflow.com/questions/34359902/better-way-to-pick-random-point-on-earth

  let latitude = (Math.PI / 2 - Math.acos(2 * getRandomInRange(0, 1000000, 0) / 1000000 - 1)) * 180 / Math.PI
  let longitude = (Math.PI - 2 * Math.PI * getRandomInRange(0, 1000000, 0) / 1000000) * 180 / Math.PI
  console.log('latitude',latitude,'longitude',longitude)

  var wikipediaPromise = new Promise(function(resolve, reject) {
    // http://stackoverflow.com/questions/34359902/better-way-to-pick-random-point-on-earth


    // latitude = 34.723554927042215
    // longitude = 136.669921875

    let url = `https://en.wikipedia.org/w/api.php?action=query&prop=coordinates%7Cpageimages%7Cpageterms&colimit=50&piprop=thumbnail&pithumbsize=144&pilimit=50&wbptterms=description&generator=geosearch&ggscoord=${latitude}|${longitude}&ggsradius=10000&ggslimit=50&format=json`

    rp({
      uri: url,
      json: true
    }).then(function(response) {
      if (response && response.query && response.query.pages) {
        console.log('wiki resolve!!!')
        resolve({latitude, longitude});
      } else {
        console.log('wiki invalid response')
        if (++numFailures >= maxFailures) reject('wiki error with', {latitude, longitude})
      }
    }).catch(function(err) {
       console.log('error error!!!')
       if (++numFailures >= maxFailures) reject('wiki error with', {latitude, longitude})
    })
  })

  var flickrPromise = new Promise(function(resolve, reject) {
    let url = `https://api.flickr.com/services/rest/?method=flickr.photos.search&per_page=20&extras=description,geo,url_sq,url_t,url_s,url_q,url_m,url_n,url_z,url_c,url_l,url_o
    &api_key=22355a5ffcecac332859348f3d9f2611&lat=${latitude}&lon=${longitude}&format=json&nojsoncallback=1`
    //console.log(url)
    rp({
      uri: url,
      json: true
    }).then(function(response) {
      console.log('flickr resolve!!!')
      if (response && response.photos && response.photos.photo && response.photos.photo.length > 0) {
        resolve({latitude, longitude});
      } else {
        console.log('flickr invalid response')
        if (++numFailures >= maxFailures) reject('flickr error with', {latitude, longitude})
      }
    }).catch(function(err) {
       console.log('error error!!!')
       if (++numFailures >= maxFailures) reject('flickr error with', {latitude, longitude})
    })
  })

  var panoramioPromise = new Promise(function(resolve, reject) {
    let url = `https://api.flickr.com/services/rest/?method=flickr.photos.search&per_page=20&extras=description,geo,url_sq,url_t,url_s,url_q,url_m,url_n,url_z,url_c,url_l,url_o
    &api_key=22355a5ffcecac332859348f3d9f2611&lat=${latitude}&lon=${longitude}&format=json&nojsoncallback=1`
    //console.log(url)
    rp({
      uri: url,
      json: true
    }).then(function(response) {
      console.log('panoramio resolve!!!', response)
      if (response && response.photos && response.photos.length > 0) {
        resolve({latitude, longitude});
      } else {
        console.log('panoramio invalid response')
        if (++numFailures >= maxFailures) reject('panoramio error with', {latitude, longitude})
      }
    }).catch(function(err) {
       console.log('error error!!!')
       if (++numFailures >= maxFailures) reject('panoramio error with', {latitude, longitude})
    })
  })

  let racePromise = new Promise(function(resolve, reject) {
    Promise.race([wikipediaPromise, flickrPromise, panoramioPromise])
    .then(function(response) {
      resolve({latitude,longitude});
    }).catch(function(err) {
      reject('race error with', {latitude, longitude})
    })
  })

  return racePromise
}

function waitRandom(req, res) {
  return random()
  .then(function(result){
    console.log('then!!! res', result)
    //return result
    res.json(result)
  })
  .catch(function(err) {
     console.log('catch', err)
     waitRandom(req, res)
  });
}

router.get('/random',function (req, res) {
  waitRandom(req, res)
  //console.log('result',result)
  //res.json(result)
})

app.use('/api', router);

app.use(function(req, res) {
  res.sendFile(__dirname + '/index.html')
})

app.listen(port, function(error) {
  if (error) {
    console.error(error)
  } else {
    console.info("==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port)
  }
})
