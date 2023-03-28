{
    //when user discards form modal, reset the form
    $('#discardbtn').click(function (e) {
        $('#newHabitForm')[0].reset();
    })

    //change the colour of the date when user clicks on it
    //onclick, toggle api is invoked, based on response data colour is changed
    //send flash notification for each click
    let enableToggleLinks = function() {
        $('.toggleLink').click(function (e) {
            e.preventDefault();
            let element = $(this);
            $.ajax({
                type: 'get',
                url: $(this).prop('href'),
                success: function (data) {
                    let done = data.data.done;
                    if(done) {
                        //if habit is updated as done change to green
                        if(done == 'yes') {
                            element.toggleClass('list-group-item-success')
                        } else {
                        //if habit is updated as not done remove green and add red
                            element.toggleClass('list-group-item-success')
                            element.toggleClass('list-group-item-danger')
                        }
                    } else {
                        //if habit is updated as not done remove red
                        element.toggleClass('list-group-item-danger')
                    }
                    //send success notification
                    new Notify ({
                        title: data.message,
                        status: 'success',
                        effect: 'slide',
                        speed: 200,
                        autoclose: true
                    })
                },
                error: function (response) {
                    let err = JSON.parse(response.responseText);
                    //send error notification
                    new Notify ({
                        title: err.message,
                        status: 'error',
                        effect: 'slide',
                        speed: 200,
                        autoclose: true
                    })
                }
            })
        });
    }

    //initialising the values for months
    let months = ["January", "February", "March", "April", "May", "June", "July",
        "August", "September", "October", "November", "December"];
    
    //initialising values for days of week
    let weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

    //initialising the array for visible dates(today and 6 dates before)
    let getViewDates = function () {
        let currentDate = new Date(new Date().toDateString());
        currentDate.setDate(currentDate.getDate() - 6);
        let totalDates = [];
        totalDates.push(new Date(currentDate));
        for (let i = 1; i <= 6; i++) {
            currentDate.setDate(currentDate.getDate() + 1);
            totalDates.push(new Date(currentDate));
        }
        return totalDates
    }

    let weekViewDom = function (totalDates, habits) {

        //Calculating current month
        let firstDayOfWeek = totalDates[0];
        let lastDayOfWeek = totalDates[6];
        let currentMonth;
        if (firstDayOfWeek.getMonth() == lastDayOfWeek.getMonth()) {
            currentMonth = `${months[firstDayOfWeek.getMonth()]} ${firstDayOfWeek.getFullYear()}`;
        } else {
            if (firstDayOfWeek.getFullYear() == lastDayOfWeek.getFullYear()) {
                currentMonth = `${months[firstDayOfWeek.getMonth()]} - ${months[lastDayOfWeek.getMonth()]} ${firstDayOfWeek.getFullYear()}`;
            } else {
                currentMonth = `${months[firstDayOfWeek.getMonth()]} ${firstDayOfWeek.getFullYear()} - ${months[lastDayOfWeek.getMonth()]} ${lastDayOfWeek.getFullYear()}`;
            }
        }

        //Creating list of week days as per the visible dates
        let days = [];
        for (let day of totalDates) {
            days.push(weekDays[day.getDay()]);
        }

        //starting the weekview dom - display month, year
        let dom = `
        <ul class="list-group" id="weekview">
            <br>
            <p class="text-primary-emphasis text-center fs-2">${currentMonth}</p>
            <li class="list-group-item border-0">
            <ul class="list-group list-group-horizontal">`
        
        //display days of week
        for (let day of days) {
            dom += `<li class="list-group-item list-group-item-dark flex-fill rounded-0 text-center fw-semibold">${day}</li>`
        }
        dom += `</ul></li><br>`

        //creating week view for each habit
        for (let habit of habits) {
            dom += `
            <li class="list-group-item border-0">
                <p class="fs-5"><i class="fa fa-check-square fs-6 text-info"></i> ${habit.description}</p>
                <ul class="list-group list-group-horizontal">`
            
            //for each date set colour according to done, not done and none
            //for each date enable toggle links
            //for date less than created date of habit disable toggle link
            //highlight today's date with bold and border
            for (let day of totalDates) {
                let timestamp = day.toDateString();
                if (habit.doneOnDays.includes(timestamp)) {
                    dom += `<a href="/toggle/${habit._id}/${day}" class="toggleLink list-group-item 
                    flex-fill rounded-0 text-center list-group-item-success`
                } else if (habit.notDoneOnDays.includes(timestamp)) {
                    dom += `<a href="/toggle/${habit._id}/${day}" class="toggleLink list-group-item 
                    flex-fill rounded-0 text-center list-group-item-danger`
                } else if(day < new Date((new Date(habit.createdAt)).toDateString())){
                    dom += `<a href="/toggle/${habit._id}/${day}" class="list-group-item 
                    flex-fill rounded-0 text-center disabled`
                }  else {
                    dom += `<a href="/toggle/${habit._id}/${day}" class="toggleLink list-group-item 
                    flex-fill rounded-0 text-center`
                }
                if(day == lastDayOfWeek) {
                    dom += ` fw-bold border border-success p-2`
                }
                dom += `">${day.getDate()}</a>`
            }
            dom += `</ul></li>`
        }
        dom += `</ul>`
        return dom
    }

    //display dom for week view and enable toggle links
    $('#weekviewlink').click(function (e) {
        e.preventDefault();

        $.ajax({
            type: 'get',
            url: $('#weekviewlink').prop('href'),
            success: function (data) {
                if (data.data.habitsList) {
                    let habits = data.data.habitsList;
                    if (habits.length != 0) {
                        $('#defaultview').remove();
                        let totalDates = getViewDates();
                        let weekView = weekViewDom(totalDates, habits);
                        $('#container').append(weekView);
                        enableToggleLinks()
                    }
                } else {
                    console.log('habitsList null')
                }
            },
            error: function (response) {
                console.log(response.responseText);
            }
        })
    })

}