# habit-tracker

A habit tracker app, where we can define habits and track them on a daily basis.

## Installation

Use npm to install express, mongoose, ejs, express-ejs-layouts, express-session, connect-flash.

Configure the host and port in the index.js file. Configure the db connection in config/mongoose.js. By default everything is set up on localhost.

The folder structure is scalable (separate models, controllers, assets and routes).

## Usage
Following are the features:
- Add multiple habits to track like reading a book, going to the gym etc
- Track each habit everyday using 3 statuses (Done, Not done, None)
- A view to show all current habits (default view)
- A view to display 7 days of each habit. Toggling enabled for each date to change status.
- Track the number of days the user completed each habit since it was created
- UI notifications for each user action

<img width="473" alt="habitTracker1" src="https://user-images.githubusercontent.com/96715878/228164173-9af2452a-c9b3-44d9-82a0-5e7216e87bbc.png">
<img width="476" alt="habitTracker2" src="https://user-images.githubusercontent.com/96715878/228164218-9dbc6df3-4896-4585-8e34-191c253639b6.png">
