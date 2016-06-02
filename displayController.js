var request = require('request');


var displayController = {}

displayController.googleAPI = function(req, next) {
  var google1 = 'https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=';
  var google2 = '&destinations=';
  var google3 = '&key=AIzaSyDxbPL9_qP_gaIQmRLmVAIBMZuW3B5KIT4';
  var origin = req.query.origin;
  var destination = req.query.destination;
  var time = req.query.DTA;
  var url = google1+origin+google2+destination+google3;

  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var data = parseData(JSON.parse(body));
      next(travelTimeCheck(data, time));
    }
  });
}


function parseData(dataObject) {
  var formattedTravelInfoObj = {};
  formattedTravelInfoObj.origin = dataObject.origin_addresses[0];
  formattedTravelInfoObj.destination = dataObject.destination_addresses[0];
  formattedTravelInfoObj.travelTime = (dataObject.rows[0].elements[0].duration.value)*1000;
  return formattedTravelInfoObj;
}

function travelTimeCheck(formattedTravelInfoObj, inputedTime) {
  var currentTime = Date.now() - 25200000;
  var currentProjectedArrival = currentTime + formattedTravelInfoObj.travelTime;
  var d = new Date();
  var y = d.getFullYear();
  var mon = d.getMonth();
  var dd = d.getDate();
  var h = d.getHours();
  var min = d.getMinutes();
  var sec = d.getSeconds();
  var hoursToAdd = Math.floor(inputedTime / 100) - 7;
  var minutesToAdd = Math.floor(inputedTime % 100);
  var desiredArrivalTime = new Date(y,mon,dd,hoursToAdd,minutesToAdd,sec);
  var etaDate = new Date(currentProjectedArrival);
  var etaHours = etaDate.getHours() + 7;
  var etaMinutes = etaDate.getMinutes();
  var dtaHours = desiredArrivalTime.getHours() + 7;
  var dtaMinutes = desiredArrivalTime.getMinutes();
  var departureTime = Math.floor((desiredArrivalTime.getTime() - etaDate.getTime()) /60000);
  if (min < 10) {
    formattedTravelInfoObj.currentTime = `${h}:0${min}`;
  } else {
    formattedTravelInfoObj.currentTime = `${h}:${min}`;
  }

  if (dtaMinutes < 10) {
    formattedTravelInfoObj.DesiredTimeOfArrival = `${dtaHours % 24}:0${dtaMinutes % 60}`;
  } else {
    formattedTravelInfoObj.DesiredTimeOfArrival = `${dtaHours % 24}:${dtaMinutes % 60}`;
  }

  if (etaMinutes < 10) {
    formattedTravelInfoObj.ETA = `${etaHours % 24}:0${etaMinutes % 60}`;
  } else {
    formattedTravelInfoObj.ETA = `${etaHours % 24}:${etaMinutes % 60}`;
  }
  //setting travel time to destination
  formattedTravelInfoObj['travelTime'] = `${Math.floor(formattedTravelInfoObj['travelTime']/60000)} minutes`
  //outputting user action
  if (desiredArrivalTime.getTime() - currentProjectedArrival < 300000) {
    formattedTravelInfoObj.action = 'Leave now!';
  } else {
    formattedTravelInfoObj.action = 'Leave in '+departureTime+' minutes';
  }

  return formattedTravelInfoObj;
}



module.exports = displayController;
