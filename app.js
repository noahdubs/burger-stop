require('dotenv').config();

const express        = require('express'),
    bodyParser     = require('body-parser'),
    mongoose       = require('mongoose'),
    passport       = require("passport"),
    LocalStrategy  = require("passport-local"),
    methodOverride = require("method-override"),
    User           = require("./models/user"),
    flash          = require("connect-flash");

// requiring routes
var commentRoutes    = require("./routes/comments"),
    burgerRoutes     = require("./routes/burgers"),
    indexRoutes      = require("./routes/index"),
    userRoutes       = require("./routes/user");

var app = express();
mongoose.connect(`mongodb+srv://noahdubs:${process.env.CLUSTER_PASSWORD}@cluster0-wbttr.mongodb.net/burger?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true})

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname+ "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// passport config
app.use(require("express-session")({
    secret: "can be anything",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=>{
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/burgers/:id/comments", commentRoutes);
app.use("/burgers", burgerRoutes);
app.use("/users", userRoutes);


app.listen(8000, ()=>{
    console.log("burger stop has started on port 8000");
});