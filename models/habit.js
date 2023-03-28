const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
    description: { type: String },
    notDoneOnDays: [{ type: String }], //array to hold dates when activity was done
    doneOnDays: [{ type: String }] //array to hold dates when activity was not done
}, { timestamps: true });

module.exports = mongoose.model('Habit', habitSchema);
