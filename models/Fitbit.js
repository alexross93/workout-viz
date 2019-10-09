const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create book Schema and model
const fitbitSchema = new Schema ({
    averageHeartRate: {type: String, required:true},
    calories: {type: String, required:true},
    steps: {type: String, required:true},
    duration: {type: String, required:true},
    lastRefreshed: {type: String, required:true},
});

const Fitbit = mongoose.model('fitbit', fitbitSchema);

module.exports = Fitbit;