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
app.get('/blockcipher',function(req,res){
  res.render("blockcipher");
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
        let blurb = '';
        let img = '';
        let link = '';
        console.log(model.classify(testData[2]));
        let results = model.classify(testData[2]);
        if (results == 'des' || results == 'triple' || results == 'unknown' || results== 'idea'){
          results = 'aes';
        }

        if (results == 'aes'){
          results = 'Advanced Encryption Standard';
          blurb = 'This block cipher has the word standard in it for a reason. It is fast enough for almost all applications (unless your device is resource-constrained), and it is not known to be efficiently breakable. AES with 128-bit keys is a great choice to start with.'
          img = 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/AES_%28Rijndael%29_Round_Function.png/250px-AES_%28Rijndael%29_Round_Function.png';
          link = 'https://www.educative.io/edpresso/what-is-the-aes-algorithm';
        }else if (results == 'simon'){
          results = "Simon";
          blurb = "This block cipher is known to be incredibly fast (even faster than AES). It is popular to use with resource-constrained devices so if that is what your working with it is a great choice. The downside is that it is breakable with a large-computation attack and maybe look elsewhere if you are building a hash function";
          img = 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Simon_block_cipher.svg/280px-Simon_block_cipher.svg.png';
          link = 'https://www.cryptopp.com/wiki/SIMON';
        }else if (results == 'blowfish'){
          results = "Blowfish";
          blurb = "This block cipher was developed in 1993 as an alternative to the Data Encryption Standard block cipher. One of the best features is that it is not subject to any patents and is freely available to use! Look into similar alternative like Twofish if you find that Blowfish is not cutting it for you.";
          img = 'https://www.researchgate.net/profile/Najib-Kofahi/publication/274182230/figure/fig2/AS:669965300559877@1536743583578/Block-Diagram-of-Blowfish-3.ppm';
          link = 'https://en.wikipedia.org/wiki/Blowfish_(cipher)';
        }else if (results == 'idea'){
          results = "International Data Encryption Algorithm";
          blurb = "this is the idea blurb";
        }

        //get blurb for aes, simon, blowfish, idea
        
        res.render("blockcipherresults",{results:results, blurb:blurb, img:img, link:link});
  
      });
    });
  });

  

});

app.listen(process.env.PORT || 3000,function(){
  console.log("listening here");
});
