//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _=require("lodash");
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');

mongoose.connect("mongodb://localhost:27017/WeCBRdb", {useNewUrlParser: true});


var qusArray = [];
const qusSchema = new mongoose.Schema({
  id: Number,
  usr: String,
  questionData : String,
  answerDataS: [String]
});
const ansSchema = new mongoose.Schema({
  usr: String,
  answerData : String
});

const qusData = mongoose.model("qusData", qusSchema);
const ansData = mongoose.model("ansData", ansSchema);
var i;
qusData.find({}, function(err, foundqus){
  if(foundqus.length === 0){i=1;}
  else{i = foundqus.length;} });


app.get("/", function(req,res){
  qusData.find({}, function(err, foundqus){
    if(foundqus.length === 0){
      res.render("index2");
    }
    else{
      res.render("index", {questions: foundqus});
    }
  });
});


app.post("/", function(req,res){
  if(req.body.questionName){
  const qus1 = new qusData({
    id: i,
    usr: "rohanjai77",
    questionData: req.body.questionName
  });
  qus1.save(function(err){
    if(err) {
      console.log(err);
    } else {
      console.log("Successfully saved");
      i++;
      res.redirect("/");
    }
  });
}
  else if(req.body.answerName){
    const ans1 = new ansData({
      usr: "rohanjai77",
      answerData: req.body.answerName
    });

    qusData.updateOne({ "id": i-1},{$push: {"answerDataS": req.body.answerName }},function (err) {
       if (err) {console.log(err);}
       else{console.log("Value Successfully Updated");}
   }
);
    ans1.save(function() {
      console.log("Saved!!");
      console.log();
      res.redirect("/question/" + (i-1).toString());

    });

  }

});

app.get("/question/:anything",function(req,res) {


      qusData.findOne({id : req.params.anything},function(err,foundQuestion) {
          if(err) {
            console.log(err);
            res.send("Error 404, Question not found");
          } else {
            if(foundQuestion) {
              res.render("post",{foundQuestion : foundQuestion});
            } else {
              res.send("Questn not found");
            }

          }
      });
});


app.get("/delete",function(req,res){
  qusData.deleteMany({},function(err){
    if(err) {
      console.log(err);
    } else {
      console.log("successfully deleted");
      i=1;
      res.redirect("/");
    }
  });
});


app.post("/question", function(req, res){
  res.render("question");
});

app.post("/answer", function(req,res){

  res.render("answer");
});

app.listen(3000, function(){
  console.log("Server started at port 3000");
});
// qusData.find({},function(err,questionsss){
//   if(err){console.log(err);}
//   else{
//     questionsss.forEach(function(i){
//       qusArray.push(i.questionData);
//     })
//     console.log(qusArray);
//   }
// })
// res.render("index",{questions: qusArray});


// <% for(var j=0;i<questions[i].answerDataS.length;j++){ %>
// <h2><%= questions[i].answerDataS[j]  %></h2>
// <% } %>
// <% } %>
