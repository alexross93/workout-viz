const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create book Schema and model
const workoutSchema = new Schema ({
    month: {type: String, required:true},
    day: {type: String, required:true},
    timeOfDay: {type: String, required:true},
    distance: {type: String, required:true},
    calories: {type: String, required:true},
    strides: {type: String, required:true}
});

const Workout = mongoose.model('workout', workoutSchema);

module.exports = Workout;