var fs = require('fs');
var csv = require('csv');
var C45 = require('c4.5');

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
        ['a','a','a','b','c','b']
      ];

      console.log(model.classify(testData[0]) === 'aes'); // true
      console.log(model.classify(testData[1]) === 'triple'); // false
      console.log(model.classify(testData[2]) === 'simon');
      console.log(model.classify(testData[2]));
    });
  });
});
