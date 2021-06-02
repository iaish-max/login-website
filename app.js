const bodyParser = require("body-parser");
const express = require("express");
const ejs = require("ejs");
const mongoose = require('mongoose');
var encrypt = require('mongoose-encryption');

mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true, useUnifiedTopology: true});


const app = express();
app.set("view engine" , "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

const secret = "prem naam hai mera, prem chopra.";

userSchema.plugin(encrypt, {secret: secret , encryptedFields: ['password'] });

const User = mongoose.model("User",userSchema);

app.get("/",function(req,res){
  res.render("home");
});

app.get("/register",function(req,res){
  res.render("register");
});

app.get("/login",function(req,res){
  res.render("login");
});

app.post("/register" , function(req,res){
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });

  newUser.save(function(err){
    if(err) console.log(err);
    else res.render("secrets");
  });
});

app.post("/login",function(req,res){
  User.findOne({email: req.body.username} , function(err,foundUser){
    if(err) console.log(err);
    else{
      if(foundUser && foundUser.password === req.body.password)  res.render("secrets");
    }
  });
});

app.listen(3000,function(req,res){
  console.log("Server started at 3000 port");
});
