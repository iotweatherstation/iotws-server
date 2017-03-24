var express = require('express');
var router = express.Router();

module.exports = function (app) {
	app.use('/weather', router);
};

/* GET save sensors. */
router.get('/saveSensors', function(req, res, next) {
	console.log('idhome =',req.query.idhome, ' temp =',req.query.temp,' humid =',req.query.humid, ' timestamp =',req.query.timestamp);
  	res.send('OK');
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

    var fecha = year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec;

	res.send(fecha);
});
