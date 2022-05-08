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
  res.render("home");
});

app.get('/modeofop',function(req,res){
  res.render("modeofop");
})
app.get('/blockcipher',function(req,res){
  res.render("blockcipher");
})

app.post('/modeofop',function(req,res){

  fs.readFile('modeofop.csv', function(err, data) {
    if (err) {
      console.log("here 1");
      console.error(err);
      return false;
    }
    console.log(data);
    csv.parse(data, function(err, data) {
      if (err) {
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

        console.log(model.classify(testData[2]));
        let results = model.classify(testData[2]);

        if (results=='ofb' || results == 'cgcm' || results=='unknown'){
          results = 'gcm';

        }

        if (results == 'ecb'){
          results = 'Electronic Code Book (ECB) mode';
          blurb = 'This mode of operation is the simplest to implement and also the fastest. However, do not use this if security is a top priority. It leaks block equality which may be a big problem with redundant data.';
          img = 'https://flylib.com/books/3/190/1/html/2/images/06fig03.jpg';
          link = 'https://www.techtarget.com/searchsecurity/definition/Electronic-Code-Book#:~:text=Electronic%20Code%20Book%20(ECB)%20is,is%20broken%20into%20numerous%20blocks.';
        }else if (results == 'cbc'){
          results = "Cipher Block Chaining (CBC) mode";
          blurb = "This mode of operation is a great choice if you can allow for sequential decryption of data in your project. It is very secure and fast so give it a try!";
          img = 'https://media.geeksforgeeks.org/wp-content/uploads/Cipher-Block-Chaining-1.png';
          link = 'https://www.educative.io/edpresso/what-is-cbc';
        }else if (results == 'gcm'){
          results = "Galois/Counter mode";
          blurb = "This mode of operation is a great option for any streaming service. It is incredibly fast and highly secure. Give it a shot!";
          img = 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/GCM-Galois_Counter_Mode_with_IV.svg/500px-GCM-Galois_Counter_Mode_with_IV.svg.png';
          link = 'https://www.ibm.com/docs/en/zos/2.3.0?topic=operation-galoiscounter-mode-gcm';
        }else if (results == 'cfb'){
          results = "Cipher Feedback (CFB) mode";
          blurb = "The CFB mode is a great option for any streaming service. The CFB mode operates on segments (can be between one bit and the block size) instead of blocks. It is very fast and secure, give it a shot!";
          img = 'https://i.stack.imgur.com/jaqUc.png';
          link = 'https://www.techtarget.com/searchsecurity/definition/ciphertext-feedback#:~:text=In%20cryptography%2C%20ciphertext%20feedback%20(CFB,an%20encryption%20algorithm%2C%20or%20cipher.';
        }


        res.render("modeofopresults",{results:results})
  
      });
    });
  });
  

});

app.post('/blockcipher',function(req,res){

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
      

        let blurb = '';
        let img = '';
        let link = '';
      
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

        
        res.render("blockcipherresults",{results:results, blurb:blurb, img:img, link:link});
  
      });
    });
  });


});

app.listen(process.env.PORT || 3000,function(){
  console.log("listening here");
});
