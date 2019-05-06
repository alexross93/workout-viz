const express = require('express');
const router = require('express').Router();
const Workout = require('../models/Workout');


/**** CONTROLLER MODULES ****/

const indexController = require('../controllers/indexController');


/**** INDEX ROUTES *****/

router.get('/', indexController.index);

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
  // Workout.create(req.body).then((workout) => {
  //   console.log('Workout created: ' + workout);
  //   res.send(workout);
  // }).catch(next); 

});

//update a workouts in the database
router.put('/api/v1/workouts/:id', (req, res, next) => {
  Workout.findOneAndUpdate({_id: req.params.id}, req.body, {new:true}).then((workout) => {
    res.send(workout);
  }).catch(next); 
});

//delete a workouts in the database
router.delete('/api/v1/workouts/:id', (req, res, next) => {
  Workout.findOneAndRemove({_id: req.params.id}).then((workout) => {
    res.send(workout);
  }).catch(next); 
});

module.exports = router;