var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var WeatherSchema = mongoose.model('Weather');
var LastWeatherSchema = mongoose.model('LastWeather');
var LocationSchema = mongoose.model('Location');
var SwitchSchema = mongoose.model('Switch');

module.exports = function(app) {
  app.use('/weather', router);
};

/* GET: get switch value per idhome -> 0 off, 1 on, -1 error */
router.get('/getSwitch', function(req, res, next) {
  SwitchSchema.findOne({
    idhome: req.query.idhome
  }, function(err, switchval) {
    if (!err) {
      if (switchval) {
        return res.send(200, switchval.val);
      } else {
        return res.send(200, "-1");
      }
    } else {
      return res.send(500, "-1");
    }
  });
});

/* GET: put switch value per idhome: 0 off, 1 on */
router.get('/putSwitch', function(req, res, next) {

  var newSwitch = new SwitchSchema({
    idhome: req.query.idhome,
    val: req.query.val
  });
  SwitchSchema.findOne({
    idhome: req.query.idhome
  }, function(err, switchval) {
    if (!err) {
      if (switchval) {
        switchval.val = req.query.val;
        switchval.save(function(err, newloc) {
          if (!err)
            return res.status(200).jsonp(newSwitch);
          else
            return res.send(500, err.message);
        });
      } else {
        newSwitch.save(function(err, newSwitch) {
          if (err) {
            return res.send(500, err.message);
          } else {
            return res.status(200).jsonp(newSwitch);
          }
        });
      }
    } else {
      return res.send(500, err.message);
    }
  });
  console.log('idhome =', req.query.idhome, ' val =', req.query.val);
});

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

/* GET: get location. */

router.get('/getMyLocation', function(req, res, next) {

  LocationSchema.findOne({
    idhome: req.query.idhome
  }, {
    _id: 0,
    idhome: 1,
    latitude: 1,
    longitude: 1
  }, function(err, location) {
    if (!err) {
      if (location) {
        console.log('/getMyLocation?idhome =', location.idhome, ' latitude =', location.latitude, 'longitude =', location.longitude);
        return res.status(200).jsonp(location);
      } else {
        console.log('/getMyLocation?idhome =', req.query.idhome, ' Not found');
        return res.send('idhome_not_found');
      }
    } else {
      return res.send(500, err.message);
    }
  });
});

/* GET: get all locations. */

router.get('/getAllLocations', function(req, res, next) {

  LocationSchema.find({}, {
    _id: 0,
    idhome: 1,
    latitude: 1,
    longitude: 1
  }, function(err, location) {
    if (!err) {
      if (location) {
        return res.status(200).jsonp(location);
      } else {
        return res.send('error');
      }
    } else {
      return res.send(500, err.message);
    }
  });
});

/* GET: save location. */

router.get('/sendMyLocation', function(req, res, next) {

  var newLocation = new LocationSchema({
    idhome: req.query.idhome,
    latitude: req.query.latitude,
    longitude: req.query.longitude
  });

  LocationSchema.findOne({
    idhome: req.query.idhome
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
  console.log('idhome =', req.query.idhome, ' latitude =', req.query.latitude, 'longitude =', req.query.longitude);
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
    latitude:'',
    longitude:'',
    temp: req.query.temp,
    humid: req.query.humid,
    timestamp: req.query.timestamp
  });

  LastWeatherSchema.findOne({idhome: req.query.idhome},
    function(err, lastweather) {
    if (!err) {
      if (lastweather) {
        lastweather.temp = req.query.temp;
        lastweather.humid = req.query.humid;
        lastweather.timestamp = req.query.timestamp;
        LocationSchema.findOne({idhome: req.query.idhome},
          function(err, loc) {
          if (!err) {
            if (loc) {
              lastweather.latitude = loc.latitude;
              lastweather.longitude = loc.longitude;
              lastweather.save();
            } else {
              lastweather.save();
            }
          }
        });
      } else {
        LocationSchema.findOne({
          idhome: req.query.idhome
        }, function(err, loc) {
          if (!err) {
            if (loc) {
              newLastWeather.latitude = loc.latitude;
              newLastWeather.longitude = loc.longitude;
              newLastWeather.save();
            } else {
              newLastWeather.save();
            }
          }
        });
      }
    }
  });

  newWeather.save(function(err, sample) {
    if (err) {
      return res.send(500, err.message);
    } else
      return res.status(200).jsonp(sample);
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

router.get('/getAllLastWeatherTest', function(req, res, next) {

  var lasthour2 = new Date().setHours(new Date().getHours() - 1);
  var now = new Date().getTime();
  var lasthour = new Date(new Date().getTime() - 1000 * 60 * 60);

  console.log("now", now);
  console.log("lasthour", lasthour);

  LastWeatherSchema.find({
    timestamp: {
      $gte: lasthour
    }
  }, {
    _id: 0,
    idhome: 0,
    temp: 1,
    humid: 1,
    timestamp: 1
  }, function(err, weather) {

    if (!err) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      if (weather) {
        var rawout = "";
        for (var x = 0; x < weather.length; x++) {
          rawout += weather[x].idhome + "," + weather[x].temp + "," + weather[x].humid + "," + weather[x].timestamp.toISOString() + "\r\n";
        }
        console.log(rawout);
        res.send(rawout);
      } else {
        console.log('no trajo registros');
      }
    } else {
      return res.send(500, err.message);
    }

  });
});

router.get('/getAllLastWeather2', function(req, res, next) {

  var lasthour = new Date().setHours(new Date().getHours() - 1);

  LastWeatherSchema.find({
    timestamp: {
      $gte: lasthour,
      $lt: new Date()
    }
  }, {
    _id: 0,
    idhome: 0,
    temp: 1,
    humid: 1,
    timestamp: 1
  }, function(err, weather) {

    if (!err) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      if (weather) {
        var rawout = "";
        for (var x = 0; x < weather.length; x++) {
          rawout += weather[x].idhome + "," + weather[x].temp + "," + weather[x].humid + "," + weather[x].timestamp.toISOString() + "\r\n";
        }
        console.log(rawout);
        res.send(rawout);
      } else {
        console.log('no trajo registros');
      }
    } else {
      return res.send(500, err.message);
    }

  });
});

router.get('/getAllLastWeather', function(req, res, next) {
  LastWeatherSchema.find({},{latitude:1,longitude:1,temp:1,humid:1,timestamp:1},function(err, allhomes) {
    if (!err) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      if (allhomes)
        return res.status(200).jsonp(allhomes);
    } else {
      return res.send(500, err.message);
    }
  });
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
        } else {
          console.log('no trajo registros');
        }
      } else {
        return res.send(500, err.message);
      }
    }).sort({
    timestamp: -1
  });
});
