const Workout = require('../models/Workout');

exports.index = (req, res) => {
 
  Workout.find({}, function(err, workout) {
    var workoutMap = {};

    workout.forEach(function(workout) {  
      workoutMap[workout._id] = workout;
    });

      res.render('index', {workoutMap: workoutMap});
  });
}

