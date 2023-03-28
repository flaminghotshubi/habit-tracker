const Habit = require('../models/habit');
const mongoose = require('mongoose');

module.exports.home = async function (req, res) {
    let habits = await Habit.find({}).sort({ 'createdAt': -1 });
    for (let habit of habits) {
        let createdDate = habit.createdAt.toDateString();
        let currentDate = new Date().toDateString();
        let currentDays = `${habit.doneOnDays.length}/${Math.round((new Date(currentDate).getTime() - new Date(createdDate).getTime())/(1000 * 3600 * 24)) + 1}`;
        habit.currentDays = currentDays
    }
    if (req.xhr) {
        return res.status(200).json({
            message: "List of habits",
            data: {
                habitsList: habits
            }
        })
    }
    res.render('home', {
        habitsList: habits
    });
}

module.exports.create = async function (req, res) {
    if (req.body.description && req.body.description.length != 0) {
        await Habit.create({
            description: req.body.description
        })
        req.flash('success', 'Habit created successfully!');
    } else {
        req.flash('error', 'Habit description missing!');
        console.log('description details missing')
    }
    res.redirect('back');
}

module.exports.toggle = async function (req, res) {
    if (mongoose.isValidObjectId(req.params.id)) {
        let timestamp = Date.parse(req.params.date);
        if (isNaN(timestamp) == false) {
            let date = new Date(timestamp).toDateString();
            let habit = await Habit.findById(req.params.id);
            if (habit) {
                let done;
                if (habit.doneOnDays.includes(date)) {
                    let index = habit.doneOnDays.indexOf(date);
                    habit.doneOnDays.splice(index, 1);
                    habit.notDoneOnDays.push(date);
                    done = 'no'
                } else if (habit.notDoneOnDays.includes(date)) {
                    let index = habit.notDoneOnDays.indexOf(date);
                    habit.notDoneOnDays.splice(index, 1);
                } else {
                    habit.doneOnDays.push(date);
                    done = 'yes'
                }
                habit.save();
                return res.status(200).json({
                    data: {
                        done: done
                    },
                    message: 'Habit details updated successfully!'
                })
            } else {
                return res.status(404).json({
                    message: "Habit not found! Please check the id"
                })
            }
        } else {
            return res.status(403).json({
                message: "Invalid date!"
            })
        }
    } else {
        return res.status(403).json({
            message: "Invalid id!"
        })
    }
}