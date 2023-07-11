const createError = require("http-errors");
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
require("dotenv").config();

//==============Mongodb connection=====================
mongoose.connect(process.env.mongo_url);

// ========== Import Routes======================
const adminRoute = require("./routes/adminRoute");
const userRoute = require("./routes/userRoute");

const app = express();
// =============view engine setup================
app.set("view engine", "ejs");


//========================Sessions====================================
const session = require("express-session");
app.use(session({secret: process.env.sessionSecret,resave: false,saveUninitialized: false}));

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());

//==========================Set Public Directories===================
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

//===============Routers============================
app.use("/", userRoute);
app.use("/admin", adminRoute);






// catch 404 and forward to 404 page
app.use(function(req, res, next) {

    if(req.route){
        next();
    }
    else{
        res.status(404).redirect('/404');
    }
 
});

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

//db connection
// connectDB();

module.exports = app;
