var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var WeatherSchema = mongoose.model('Weather');
var LocationSchema = mongoose.model('Location');

module.exports = function (app) {
	app.use('/weather', router);
};

/* GET: save location. */

router.get('/sendMyLocation', function(req, res, next) {

	var newLocation = new LocationSchema({
		idhome: req.query.username,
		latitude: req.query.latitude,
		longitude: req.query.longitude
	});

	LocationSchema.findOne({idhome:req.query.username}, function (err, location) {
		if(!err) {
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
					} else  {
						console.log('creacion exitosa');
						return res.status(200).jsonp(newLocation);
					}
				});
			}
		}
		else {
			return res.send(500, err.message);
			}
	});
	console.log('idhome =',req.query.username, ' latitude =',req.query.latitude, 'longitude =',req.query.longitude);
});

/* GET: save sensors. */
router.get('/saveSensors', function(req, res, next) {

	var newWeather = new WeatherSchema({
		idhome: req.query.idhome,
		temp: req.query.temp,
		humid: req.query.humid,
		timestamp: req.query.timestamp
	});

	newWeather.save(function(err, newWeather) {
		if (err) {
			return res.send(500, err.message);
		}
		// send OK
		return res.status(200).jsonp(newWeather);
	});

	console.log('idhome =',req.query.idhome, ' temp =',req.query.temp,' humid =',req.query.humid, ' timestamp =',req.query.timestamp);
	//res.send('OK');
});

router.get('/getTime', function(req, res, next) {

	console.log(req.path);

	var date = new Date();

	var hour = date.getHours();
	hour = (hour < 10 ? "0" : "") + hour;

	var min  = date.getMinutes();
	min = (min < 10 ? "0" : "") + min;

	var sec  = date.getSeconds();
	sec = (sec < 10 ? "0" : "") + sec;

	var year = date.getFullYear();

	var month = date.getMonth() + 1;
	month = (month < 10 ? "0" : "") + month;

	var day  = date.getDate();
	day = (day < 10 ? "0" : "") + day;

	var fecha = year + "-" + month + "-" + day + "T" + hour + ":" + min + ":" + sec+".0Z";

	res.send(fecha);
});

router.get('/:id/:size',function(req,res){

	WeatherSchema.find({idhome:req.params.id},{_id:0,idhome:1,temp:1,humid:1,timestamp:1},function (err, weather) {
		if (!err) {
			res.header("Access-Control-Allow-Origin", "*");
			res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
			res.send(weather);
		} else {
			return res.send(500, err.message);
		}
	}).sort({timestamp:-1}).limit(parseInt(req.params.size));
});

router.get('/:id',function(req,res){

  WeatherSchema.find({idhome:req.params.id,
											timestamp: {$gte: new Date(new Date().setDate(new Date().getDate()-1)), $lt: new Date()}},
											{_id:0,idhome:1,temp:1,humid:1,timestamp:1},
											function (err, weather) {
    if (!err) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
			res.send(weather);
			if (weather) {
				for (var x=0;x<weather.length;x++) {
						console.log(weather[x].temp);
				}
			}
    } else {
      return res.send(500, err.message);
    }
  }).sort({timestamp:-1});
});
