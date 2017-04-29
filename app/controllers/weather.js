var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var WeatherSchema = mongoose.model('Weather');
var LastWeatherSchema = mongoose.model('LastWeather');
var LocationSchema = mongoose.model('Location');

module.exports = function(app) {
  app.use('/weather', router);
};

/* GET: save my prediction per username */
router.get('/sendMyPrediction', function(req, res, next) {
  var newPrediction = new PredictionSchema({
    idhome: req.query.username,
    predtemp: req.query.predtemp,
    predhumid: req.query.predhumid,
    timestamp: req.query.timestamp,

  });
  newPrediction.save(function(err, newPrediction) {
    if (err) {
      return res.send(500, err.message);
    }
    // send OK
    return res.status(200).jsonp(newWeather);
  });
});


/* GET: save location. */

router.get('/sendMyLocation', function(req, res, next) {

  var newLocation = new LocationSchema({
    idhome: req.query.username,
    latitude: req.query.latitude,
    longitude: req.query.longitude
  });

  LocationSchema.findOne({
    idhome: req.query.username
  }, function(err, location) {
    if (!err) {
      if (location) {
        console.log("actualizando registro");
        location.latitude = req.query.latitude;
        location.longitude = req.query.longitude;
        location.save(function(err, newloc) {
          if (!err)
            return res.status(200).jsonp(newLocation);
          else
            return res.send(500, err.message);
        });
      } else {
        console.log("creando registro");
        newLocation.save(function(err, newLocation) {
          if (err) {
            return res.send(500, err.message);
          } else {
            console.log('creacion exitosa');
            return res.status(200).jsonp(newLocation);
          }
        });
      }
    } else {
      return res.send(500, err.message);
    }
  });
  console.log('idhome =', req.query.username, ' latitude =', req.query.latitude, 'longitude =', req.query.longitude);
});

/* GET: save sensors. */
router.get('/saveSensors', function(req, res, next) {

  var newWeather = new WeatherSchema({
    idhome: req.query.idhome,
    temp: req.query.temp,
    humid: req.query.humid,
    timestamp: req.query.timestamp
  });

  var newLastWeather = new LastWeatherSchema({
    idhome: req.query.idhome,
    temp: req.query.temp,
    humid: req.query.humid,
    timestamp: req.query.timestamp
  });

  LastWeatherSchema.findOne({
    idhome: req.query.idhome
  }, function(err, lastweather) {
    if (!err) {
      if (lastweather) {
        lastweather.temp = req.query.temp;
        lastweather.humid = req.query.humid;
        lastweather.timestamp = req.query.timestamp;
        lastweather.save();
      } else {
        newLastWeather.save();
      }
    }
  });

  newWeather.save(function(err, newWeather) {
    if (err) {
      return res.send(500, err.message);
    }
    return res.status(200).jsonp(newWeather);
  });
  console.log('idhome =', req.query.idhome, ' temp =', req.query.temp, ' humid =', req.query.humid, ' timestamp =', req.query.timestamp);
});

router.get('/getTime', function(req, res, next) {

  console.log(req.path);

  var date = new Date();

  var hour = date.getHours();
  hour = (hour < 10 ? "0" : "") + hour;

  var min = date.getMinutes();
  min = (min < 10 ? "0" : "") + min;

  var sec = date.getSeconds();
  sec = (sec < 10 ? "0" : "") + sec;

  var year = date.getFullYear();

  var month = date.getMonth() + 1;
  month = (month < 10 ? "0" : "") + month;

  var day = date.getDate();
  day = (day < 10 ? "0" : "") + day;

  var fecha = year + "-" + month + "-" + day + "T" + hour + ":" + min + ":" + sec + ".0Z";

  res.send(fecha);
});

router.get('/:id/:size', function(req, res) {

  WeatherSchema.find({
    idhome: req.params.id
  }, {
    _id: 0,
    idhome: 1,
    temp: 1,
    humid: 1,
    timestamp: 1
  }, function(err, weather) {
    if (!err) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      res.send(weather);
    } else {
      return res.send(500, err.message);
    }
  }).sort({
    timestamp: -1
  }).limit(parseInt(req.params.size));
});

router.get('/:id', function(req, res) {

  WeatherSchema.find({
      idhome: req.params.id,
      timestamp: {
        $gte: new Date(new Date().setDate(new Date().getDate() - 1)),
        $lt: new Date()
      }
    }, {
      _id: 0,
      idhome: 1,
      temp: 1,
      humid: 1,
      timestamp: 1
    },
    function(err, weather) {
      if (!err) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        //res.send(weather);
        if (weather) {
          var rawout = "";
          for (var x = 0; x < weather.length; x++) {
            rawout += weather[x].idhome + "," + weather[x].temp + "," + weather[x].humid + "," + weather[x].timestamp.toISOString() + "\r\n";
          }
          console.log(rawout);
          res.send(rawout);
        }
      } else {
        return res.send(500, err.message);
      }
    }).sort({
    timestamp: -1
  });
});
