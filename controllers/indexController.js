const Workout = require('../models/Workout');

exports.index = (req, res) => {
 
  Workout.find({}, function(err, workout) {
    var workoutMap = {};

    workout.forEach(function(workout) {  
      workoutMap[workout._id] = workout;
    });

      res.render('index', {workoutMap: workoutMap});
  }).sort( { order: 1 } );
}

// create an ebook post
exports.addWorkout = (req, res, next) => {
  var newWorkout = new Workout();
  newWorkout.distance = req.body.distance;
  if(!(newWorkout.distance.toString().includes("."))){
    newWorkout.distance  = newWorkout.distance.toString().slice(0,1) + "." 
    + newWorkout.distance.toString().slice(1,4);
  }
  newWorkout.calories = req.body.calories;
  newWorkout.strides = req.body.strides;
  newWorkout.year = req.body.year;
  newWorkout.month = req.body.month;
  newWorkout.day = req.body.day;
  newWorkout.timeOfDay = req.body.timeOfDay;
  newWorkout.time = req.body.time;
  var stepsPerMin = newWorkout.strides/newWorkout.time;
  newWorkout.spm = stepsPerMin.toString().substring(0,3);

  newWorkout.save().then((newWorkout) => {
    console.log('New workout created: ' + newWorkout);
    res.redirect('back');
  });

}

