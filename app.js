//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const PORT = 3000;

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect("mongodb://0.0.0.0:27017/userDB");

//Mongoose Schema
const userSchema = new mongoose.Schema({
    email:String,
    password: String
});

userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});

//Mongoose Model
const User = new mongoose.model("User", userSchema);


app.get("/", function(req, res){
    res.render("home");
})

app.get("/login", function(req, res){
    res.render("login");
})

app.post("/login", function(req, res){
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({email: username}).exec().then(function(result){
        if(result.email && result.email === username){
            console.log("User found!");
            if(result.password === password){
                console.log("Login succesfully!");
                res.render("secrets");
            }else{
                console.log("Wrong password!");
            }
        }else{
            console.log("User not found!");
        }
    }).catch(function(err){
        console.log(err);
    })
})

app.get("/register", function(req, res){
    res.render("register");
})

app.post("/register", function(req, res){
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });

    try {
        newUser.save();
        res.render("secrets");
    } catch (error) {
        console.log(error);
    }
})

app.listen(PORT, function(){
    console.log("Server started on port 3000.");
});

