Applied Cryptography final. Choose your block cipher and your mode of operation. 

This project was done with NodeJS, Express, and EJS (embedded javascript). The decision tree algorithm is from the c4.5 package which we used utilized through the node package manager (npm). 

To run, clone this repository and run npm install in your terminal. Then, step into the directory with app.js. Run "node app.js" and go to localhost:3000 in your browser.

The app.js file is our website backend. Inside the views folder, you can see our .ejs files. The site works by having the two tests, block cipher test (blockcipher.ejs) and modes of operation test (modesofop.ejs). These files record the users answers and make a post request to our app.js file. 

The app.js file takes the input from the user and runs the decision tree algorithm from the c4.5 package. The .csv files are the data on which the decision tree algorithm is trained (blockcipher.csv is the for the block cipher test, and modesofop.csv is for the modes of operation test). The user is then directed to a new page that gives them their results plus a link to learn more about their chosen cipher.

link to website
https://fast-spire-01733.herokuapp.com
