const express = require('express');
const app = express();
const port = 8000;
const hostname = '127.0.0.1';
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const customMware = require('./config/middleware');
const expressLayouts = require('express-ejs-layouts');

//configure mongoose connection
const db = require('./config/mongoose');

const bodyParser = require('body-parser');
// for parsing application/json
app.use(bodyParser.json());
// for parsing application/xwww-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    name: 'habitTracker',
    secret: 'trackhabits',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    }
}));
app.use(flash());
app.use(customMware.setFlash);

app.use(express.static('./assets'));

app.use(expressLayouts);
// extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//api path folder
app.use('/', require('./routes'));

//start the server
var server = app.listen(port, hostname, function (err) {
    if (err) {
        console.log("error!")
    } else {
        var host = server.address().address;
        var port = server.address().port;
        console.log('express server running at http://' + host + ':' + port)
    }
});
