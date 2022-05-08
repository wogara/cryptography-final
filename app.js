const express = require("express");
const fs = require('fs');
const csv = require('csv');
const C45 = require('c4.5');
const app = express();
const bodyParser = require('body-parser');

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/",function(req,res){
  //res.render("blockcipher"); 
  res.render("home");
  //res.render("modeofop");
});

app.get('/modeofop',function(req,res){
  res.render("modeofop");
})




app.post('/modeofop',function(req,res){
  console.log(req.body.q1);
  console.log(req.body.q2);
  console.log(req.body.q3);
  console.log(req.body.q4);
  console.log(req.body.q5);
  console.log(req.body.q6);
  console.log(req.body);


  fs.readFile('modeofop.csv', function(err, data) {
    if (err) {
      console.log("here 1");
      console.error(err);
      return false;
    }
    console.log(data);
    csv.parse(data, function(err, data) {
      if (err) {
        console.log("here 2");
        console.error(err);
        return false;
      }
  
      var headers = data[0];
      var features = headers.slice(1,-1); // ["attr1", "attr2", "attr3"]
      console.log(features);
      var featureTypes = ['category','category','category','category','category','category'];
      var trainingData = data.slice(1).map(function(d) {
        return d.slice(1);
      });
      var target = headers[headers.length-1]; // "class"
      var c45 = C45();
  
      c45.train({
          data: trainingData,
          target: target,
          features: features,
          featureTypes: featureTypes
      }, function(error, model) {
        if (error) {
          console.error(error);
          return false;
        }
  
        var testData = [
          ['a','a','a','a','a','a'],
          ['b','b','b','b','b','b'],
          [req.body.q1,req.body.q2,req.body.q3,req.body.q4,req.body.q5,req.body.q6]
        ];
      
  
        console.log(model.classify(testData[0]) === 'aes'); // true
        console.log(model.classify(testData[1]) === 'triple'); // false
        console.log(model.classify(testData[2]) === 'simon');
       // if (model.classify(testData[2]) == 'unknown'){
       //   console.log("aes");
       // }
        console.log(model.classify(testData[2]));
        let results = model.classify(testData[2]);

        res.render("modeofopresults",{results:results})
  
      });
    });
  });
  

});

app.post('/blockcipher',function(req,res){
  console.log(req.body.q1);
  console.log(req.body.q2);
  console.log(req.body.q3);
  console.log(req.body.q4);
  console.log(req.body.q5);
  console.log(req.body.q6);
  console.log(req.body);


  fs.readFile('blockcipher.csv', function(err, data) {
    if (err) {
      console.log("here 1");
      console.error(err);
      return false;
    }
    console.log(data);
    csv.parse(data, function(err, data) {
      if (err) {
        console.log("here 2");
        console.error(err);
        return false;
      }
  
      var headers = data[0];
      var features = headers.slice(1,-1); // ["attr1", "attr2", "attr3"]
      console.log(features);
      var featureTypes = ['category','category','category','category','category','category'];
      var trainingData = data.slice(1).map(function(d) {
        return d.slice(1);
      });
      var target = headers[headers.length-1]; // "class"
      var c45 = C45();
  
      c45.train({
          data: trainingData,
          target: target,
          features: features,
          featureTypes: featureTypes
      }, function(error, model) {
        if (error) {
          console.error(error);
          return false;
        }
  
        var testData = [
          ['a','a','a','a','a','a'],
          ['b','b','b','b','b','b'],
          [req.body.q1,req.body.q2,req.body.q3,req.body.q4,req.body.q5,req.body.q6]
        ];
      
  
        console.log(model.classify(testData[0]) === 'aes'); // true
        console.log(model.classify(testData[1]) === 'triple'); // false
        console.log(model.classify(testData[2]) === 'simon');
        if (model.classify(testData[2]) == 'unknown'){
          console.log("aes");
        }
        console.log(model.classify(testData[2]));
        let results = model.classify(testData[2]);

        res.render("blockcipherresults",{results:results})
  
      });
    });
  });

  

  

});

app.listen(3000,function(){
  console.log("listening here");
});
