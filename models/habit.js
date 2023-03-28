const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
    description: { type: String },
    notDoneOnDays: [{ type: String }],
    doneOnDays: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Habit', habitSchema);
