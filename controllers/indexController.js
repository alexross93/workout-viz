const Workout = require('../models/Workout');

exports.index = (req, res) => {

  Workout.find({}).sort('order').exec(function(err, workout) {
    var workoutMap = {};

    workout.forEach(function(workout) {  
      workoutMap[workout._id] = workout;
    });

    res.render('index', {workoutMap: workoutMap});
  });
}

// create a workout 
exports.addWorkout = (req, res, next) => {
  var newWorkout = new Workout();
  newWorkout.distance = req.body.distance;
  if(!(newWorkout.distance.toString().includes("."))){
    newWorkout.distance  = newWorkout.distance.toString().slice(0,1) + "." 
    + newWorkout.distance.toString().slice(1,4);
  }

  var strides = parseInt(newWorkout.distance * 1261);
  newWorkout.strides = strides;
  let calories = parseInt(strides) * .091;
  newWorkout.calories = calories.toString().slice(0,3);
  
  let dt = new Date();
  let t = dt.getMinutes();
  let h = dt.getHours();
  let st = t - req.body.time;
  if(st<0){
    h = h-1;
    st = st+60;
  }
  if(st<10){
    st= '0'+st.toString();
  }
  
  newWorkout.year = '2019';
  newWorkout.month = req.body.month;
  newWorkout.day = req.body.day;
  newWorkout.timeOfDay = h.toString() + ":" + st.toString();
  newWorkout.time = req.body.time;
  var stepsPerMin = newWorkout.strides/newWorkout.time;
  newWorkout.spm = stepsPerMin.toString().substring(0,3);

  newWorkout.save().then((newWorkout) => {
    // console.log('New workout created: ' + newWorkout);
    res.redirect('back');
  });

}

