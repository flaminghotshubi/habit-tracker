const Habit = require('../models/habit');
const mongoose = require('mongoose');

module.exports.home = async function (req, res) {
    let habits = await Habit.find({}).sort({ 'createdAt': -1 });
    for (let habit of habits) {
        let createdDate = habit.createdAt.toDateString();
        let currentDate = new Date().toDateString();
        //no. of days activity was done divided by 
        //the total number of days from createdDate
        let currentDays = `${habit.doneOnDays.length}/${Math.round((new Date(currentDate).getTime() - new Date(createdDate).getTime())/(1000 * 3600 * 24)) + 1}`;
        habit.currentDays = currentDays
    }
    //for week view, we make ajax call
    if (req.xhr) {
        return res.status(200).json({
            message: "List of habits",
            data: {
                habitsList: habits
            }
        })
    }
    //homepage
    res.render('home', {
        habitsList: habits
    });
}

//creating a new habit with user provided description
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

//toggle function
module.exports.toggle = async function (req, res) {
    //check if id in api is valid
    if (mongoose.isValidObjectId(req.params.id)) {
        //check if date in api is valid
        let timestamp = Date.parse(req.params.date);
        if (isNaN(timestamp) == false) {
            let date = new Date(timestamp).toDateString();
            //fetch the habit doc using id
            let habit = await Habit.findById(req.params.id);
            //if habit exists
            if (habit) {
                let done;
                //flow: none-> done -> not done -> none
                //if done array includes the date, 
                //add it to not done and remove it from done
                if (habit.doneOnDays.includes(date)) {
                    let index = habit.doneOnDays.indexOf(date);
                    habit.doneOnDays.splice(index, 1);
                    habit.notDoneOnDays.push(date);
                    done = 'no'
                } 
                // else if not done array includes the date, 
                //remove it from not done
                else if (habit.notDoneOnDays.includes(date)) {
                    let index = habit.notDoneOnDays.indexOf(date);
                    habit.notDoneOnDays.splice(index, 1);
                } 
                //else 
                else {
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