const express = require('express');
const router = require('express').Router();
const Workout = require('../models/Workout');
const FitbitApiClient = require("fitbit-node");


/**** CONTROLLER MODULES ****/

const indexController = require('../controllers/indexController');
const fitbitController = require('../controllers/fitbitController');

/**** INDEX ROUTES *****/

router.get('/', indexController.index);

/** FITBIT ROUTE */

router.get('/fitbit', fitbitController.fitbit);

// initialize the Fitbit API client
const client = new FitbitApiClient({
  clientId: "22B5D4",
  clientSecret: "a21507946862c9891c42fb044e8e0b15",
  apiVersion: '1.2' // 1.2 is the default
});

// redirect the user to the Fitbit authorization page
router.get("/authorize", (req, res) => {
  // request access to the user's activity, heartrate, location, nutrion, profile, settings, sleep, social, and weight scopes
  res.redirect(client.getAuthorizeUrl('activity profile heartrate location sleep', 'http://localhost:3000/callback'));
});

// handle the callback from the Fitbit authorization flow
router.get("/callback", (req, res) => {
  // exchange the authorization code we just received for an access token
  client.getAccessToken(req.query.code, 'http://localhost:3000/callback').then(result => {
    // use the access token to fetch the user's profile information
    client.get("/activities/date/2019-09-26.json", result.access_token).then(results => {
      //res.send(results[0]);
      const acts = results[0].activities[0]
      // var newArr = []
      // for (var elem in acts) {
      //    if (elem == 'steps' || elem == 'calories' || elem == 'duration' || elem == 'averageHeartRate'){
      //      console.log(elem + ': ' + acts[elem])
      //      newArr.push(elem)
      //    }
      // }

      // newArr.forEach(function(elem) {
      //   console.log(elem + '--: ' + newArr[elem])
      // });

      res.render('fitbit', { results: acts });
    }).catch(err => {
      res.status(err.status).send(err);
    });
  }).catch(err => {
    res.status(err.status).send(err);
  });
});

/**** REST API ROUTES *****/

//get list of workouts from the database 
router.get('/api/v1/workouts', (req, res, next) => {
  Workout.find({}).then((workout) => {
    res.send(workout);
  }).catch(next); 
});

//create a workout in the database
router.post('/api/v1/workouts', (req, res, next) => {
  
  console.log(req.body.workouts);
  Workout.insertMany(req.body.workouts, function(err, workouts){
    if(err) console.log(err);
    else console.log("Workouts added successfully");
  });
});

//update a workouts in the database
router.put('/api/v1/workouts', (req, res, next) => {
  console.log(req.body.workouts);
  Workout.updateMany({month: req.params.month},req.body.workouts, function(err, workouts){
    if(err) console.log(err);
    else console.log("Workouts updated successfully");
  });
  /*Workout.findOneAndUpdate({_id: req.params.id}, req.body, {new:true}).then((workout) => {
    res.send(workout);
  }).catch(next);*/
});

//delete a workouts in the database
router.delete('/api/v1/workouts', (req, res, next) => {
  console.log(req.query.month);
  Workout.deleteMany({month: req.query.month},req.body.workouts, function(err, workouts){
    if(err) console.log(err);
    else console.log("Workouts deleted successfully");
  });
});

router.post('/add', indexController.addWorkout);

module.exports = router;